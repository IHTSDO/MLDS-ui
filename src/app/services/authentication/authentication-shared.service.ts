import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';
import { User } from 'src/model/user.model';
import { ROUTES } from 'src/app/routes-config';
/**
 * Authentication shared service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationSharedService {
  private apiUrl = API_ROUTES.apiUrl;
  loginStatus = false;
  private userRoles: string[] = [];
  private userDetails: User | null = null;
  routes = ROUTES;
  firstName: string | undefined ;
  lastName:string | undefined;
  /**
   * Constructor
   * @param http - HttpClient instance
   */
  constructor(private http: HttpClient,private router : Router) {
    this.loadFromLocalStorage();
  }

  /**
   * Login to the application
   * @param username - Username to login with
   * @param password - Password to login with
   * @param rememberMe - Whether to remember the user
   * @returns Observable of User object
   * @example
   * this.authenticationSharedService.login('username', 'password', true).subscribe((user) => {
   *   console.log(user);
   * });
   */
  login(username: string, password: string, rememberMe: boolean): Observable<User> {
    const data = new URLSearchParams();
    data.set('j_username', username);
    data.set('j_password', password);
    data.set('remember-me', rememberMe.toString());

    return this.http.post<HttpResponse<any>>('/app/authentication', data.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      observe: 'response',
      withCredentials: true
    }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.loginStatus = true;
        }
        return this.getAccountDetails();
      }),
      switchMap((accountData$: Observable<User>) => accountData$),
      map((accountData: User) => {
        this.userRoles = accountData.roles;
        this.userDetails = accountData;
        this.saveToLocalStorage();
        return accountData;
      }),
    );
  }

  /**
   * Get account details
   * @returns Observable of User object
   */
  getAccountDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/account`);
  }

  /**
   * Extract error code from message
   * @param message - Error message
   * @returns Error code
   * @example
   * const errorCode = this.authenticationSharedService.extractErrorCode('MLDS_ERR_AUTH_NO_PERMISSIONS');
   * console.log(errorCode); // Output: "login.messages.error.noPermissions"
   */
  extractErrorCode(message: string): string {
    const errorCodeMapping: { [key: string]: string } = {
      'MLDS_ERR_AUTH_NO_PERMISSIONS': 'login.messages.error.noPermissions',
      'MLDS_ERR_AUTH_BAD_PASSWORD': 'login.messages.error.authentication',
      'MLDS_ERR_AUTH_DEREGISTERED': 'login.messages.error.deregistered',
      'MLDS_ERR_AUTH_SYSTEM': 'global.messages.error.server'
    };
    return errorCodeMapping[message] || 'login.messages.error.authentication';
  }

  /**
   * Load user data from local storage
   */
  private loadFromLocalStorage(): void {
    this.loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    this.userDetails = localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')!) : null;
    this.userRoles = this.userDetails ? this.userDetails.roles : [];
    this.loadFromAccountData();
  }

  /**
   * Load user data from account data
   */
  loadFromAccountData(): void {
    if (this.isLoggedIn()) {
      this.getAccountDetails().subscribe({
        next: (user) => this.handleUserDetails(user),
        error: () => this.logout()
      });
    }
  }

  /**
   * Handle user details
   * @param user - User object
   * @returns User object
   */
  private handleUserDetails(user: User): User {
    this.userRoles = user.roles;
    this.userDetails = user;
    this.saveToLocalStorage();
    return user;
  }

  /**
   * Check if user is logged in
   * @returns True if user is logged in, false otherwise
   */
  isLoggedIn(): boolean {
    return this.loginStatus || localStorage.getItem('isLoggedIn') === 'true';
  }

  /**
   * Save user data to local storage
   */  
  private saveToLocalStorage(): void {
    if (this.userDetails) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
    }
  }

  /**
 * Remove user data from local storage
 */
private removeFromLocalStorage(): void {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userDetails');
}
invalidate(): void {
  this.loginStatus = false;
  this.userRoles = [];
  this.userDetails = null;
  this.removeFromLocalStorage();
}
/**
 * Logout from the application
 */
logout(): void {
  this.removeFromLocalStorage();
  this.http.get<void>('/app/logout', { withCredentials: true }).subscribe({
    next: () => {
      this.router.navigate([this.routes.login]).then(() => {
        window.location.reload();
      });
    },
    error: () => {
      this.router.navigate([this.routes.login]).then(() => {
        window.location.reload();
      });
    }
  });
}


/**
 * Check if user has a specific role
 * @param role - Role to check (string or array of strings)
 * @returns True if user has the role, false otherwise
 * @example
 * if (this.authenticationSharedService.hasRole('ROLE_ADMIN')) {
 *   console.log('User is an admin');
 * }
 */
hasRole(role: string | string[]): boolean {
  if (Array.isArray(role)) {
    return role.some(r => this.userRoles.includes(r));
  }
  return this.userRoles.includes(role);
}

/**
 * Check if user is an admin
 * @returns True if user is an admin, false otherwise
 * @example
 * if (this.authenticationSharedService.isAdmin()) {
 *   console.log('User is an admin');
 * }
 */
isAdmin(): boolean {
  return this.hasRole('ROLE_ADMIN');
}

/**
 * Check if user is a staff or admin
 * @returns True if user is a staff or admin, false otherwise
 * @example
 * if (this.authenticationSharedService.isStaffOrAdmin()) {
 *   console.log('User is a staff or admin');
 * }
 */
isStaffOrAdmin(): boolean {
  return this.hasRole(['ROLE_ADMIN', 'ROLE_STAFF']);
}

/**
 * Check if user is a member, staff, or admin
 * @returns True if user is a member, staff, or admin, false otherwise
 * @example
 * if (this.authenticationSharedService.isMemberOrStaffOrAdmin()) {
 *   console.log('User is a member, staff, or admin');
 * }
 */
isMemberOrStaffOrAdmin(): boolean {
  return this.hasRole(['ROLE_MEMBER', 'ROLE_STAFF', 'ROLE_ADMIN']);
}

/**
 * Check if user is a member
 * @returns True if user is a member, false otherwise
 * @example
 * if (this.authenticationSharedService.isMember()) {
 *   console.log('User is a member');
 * }
 */
isMember(): boolean {
  return this.hasRole('ROLE_MEMBER');
}

/**
 * Check if user is a user
 * @returns True if user is a user, false otherwise
 * @example
 * if (this.authenticationSharedService.isUser()) {
 *   console.log('User is a user');
 * }
 */
isUser(): boolean {
  return this.hasRole('ROLE_USER');
}

/**
 * Check if user is a staff
 * @returns True if user is a staff, false otherwise
 * @example
 * if (this.authenticationSharedService.isStaff()) {
 *   console.log('User is a staff');
 * }
 */
isStaff(): boolean {
  return this.hasRole('ROLE_STAFF');
}

/**
 * Get user details
 * @returns User object or null
 * @example
 * const userDetails = this.authenticationSharedService.getUserDetails();
 * console.log(userDetails);
 */
getUserDetails(): User | null {
  return this.userDetails;
}
isAuthenticated(): boolean {
  return this.isLoggedIn() && this.getUserDetails() !== null;
}
updateUserName(firstName: any, lastName: any) {
  if (this.userDetails) {
    this.userDetails.firstName = firstName;
    this.userDetails.lastName = lastName;
  }
}


}
