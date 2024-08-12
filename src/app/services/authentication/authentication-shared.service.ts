import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationSharedService {
  private apiUrl = environment.apiUrl;
  private accountApiBaseUrl = environment.accountApiBaseUrl;
  loginStatus = false;
  private userRoles: string[] = [];
  private userDetails: User | null = null;

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  login(username: string, password: string, rememberMe: boolean): Observable<User> {
    const data = new URLSearchParams();
    data.set('j_username', username);
    data.set('j_password', password);
    data.set('remember-me', rememberMe.toString());

    return this.http.post<HttpResponse<any>>(`${this.accountApiBaseUrl}/authentication`, data.toString(), {
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

  getAccountDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/account`);
  }

  extractErrorCode(message: string): string {
    const errorCodeMapping: { [key: string]: string } = {
      'MLDS_ERR_AUTH_NO_PERMISSIONS': 'login.messages.error.noPermissions',
      'MLDS_ERR_AUTH_BAD_PASSWORD': '<strong>Authentication failed!</strong> Please check your credentials and try again. Passwords are case sensitive.',
      'MLDS_ERR_AUTH_DEREGISTERED': 'login.messages.error.deregistered',
      'MLDS_ERR_AUTH_SYSTEM': 'global.messages.error.server'
    };
    return errorCodeMapping[message] || '<strong>Authentication failed!</strong> Please check your credentials and try again. Passwords are case sensitive.';
  }

  private loadFromLocalStorage(): void {
    this.loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    this.userDetails = localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')!) : null;
    this.userRoles = this.userDetails ? this.userDetails.roles : [];
    this.loadFromAccountData();
  }

  private loadFromAccountData(): void {
    if (this.isLoggedIn()) {
      this.getAccountDetails().subscribe({
        next: (user) => this.handleUserDetails(user),
        error: () => this.logout()
      });
    }
  }

  private handleUserDetails(user: User): User {
    this.userRoles = user.roles; 
    this.userDetails = user; 
    this.saveToLocalStorage();
    return user;
  }

  isLoggedIn(): boolean {
    return this.loginStatus || localStorage.getItem('isLoggedIn') === 'true';
  }

  private saveToLocalStorage(): void {
    if (this.userDetails) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
    }
  }

  private removeFromLocalStorage(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userDetails');
  }

  logout() {
    this.loginStatus = false;
    this.removeFromLocalStorage();
    location.reload();
  }


  // managing user roles

  hasRole(role: string | string[]): boolean {
    if (Array.isArray(role)) {
      return role.some(r => this.userRoles.includes(r));
    }
    return this.userRoles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isStaffOrAdmin(): boolean {
    return this.hasRole(['ROLE_ADMIN', 'ROLE_STAFF']);
  }

  isMemberOrStaffOrAdmin(): boolean {
    return this.hasRole(['ROLE_MEMBER', 'ROLE_STAFF', 'ROLE_ADMIN']);
  }

  isMember(): boolean {
    return this.hasRole('ROLE_MEMBER');
  }

  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }

  isStaff(): boolean {
    return this.hasRole('ROLE_STAFF');
  }

  getUserDetails(): User | null {
    return this.userDetails;
  }

}
