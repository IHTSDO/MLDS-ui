import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';
import { User } from 'src/model/user.model';
import { ROUTES } from 'src/app/routes-config';
import { ImsConfigService } from '../ims-config/ims-config.service';

/**
 * Shared service for authentication state and operations.
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private imsConfigService: ImsConfigService
  ) {
    this.loadFromLocalStorage();
    this.setupFocusListener();
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  /**
   * Authenticate with username/password and load account details.
   */
  login(username: string, password: string, rememberMe: boolean): Observable<User> {

    const data = new URLSearchParams();
    data.set('j_username', username);
    data.set('j_password', password);
    data.set('remember-me', rememberMe.toString());

    return this.http.post<HttpResponse<any>>('/app/authentication', data.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
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
      })
    );

  }

  // ─── Account ─────────────────────────────────────────────────────────────────

  /** Fetch current account details from the server. */
  getAccountDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/account`);
  }

  /**
   * Update local state and localStorage with a received User object.
   */
  handleUserDetails(user: User): User {
    this.userRoles = user.roles;
    this.userDetails = user;
    this.saveToLocalStorage();
    return user;
  }

  /**
   * Fetch account details and update local state, used during route activation.
   * Returns EMPTY (and logs out) on error.
   */
  AccountFromActivate(): Observable<any> {
    if (!this.isLoggedIn()) {
      return of(null);
    }
    return this.getAccountDetails().pipe(
      tap(user => this.handleUserDetails(user)),
      catchError(() => {
        this.logout();
        return EMPTY;
      })
    );
  }

  // ─── Role Checks ─────────────────────────────────────────────────────────────

  hasRole(role: string | string[]): boolean {
    return Array.isArray(role)
      ? role.some(r => this.userRoles.includes(r))
      : this.userRoles.includes(role);
  }

  isAdmin(): boolean        { return this.hasRole('ROLE_ADMIN'); }
  isStaff(): boolean        { return this.hasRole('ROLE_STAFF'); }
  isStaffOrAdmin(): boolean { return this.hasRole(['ROLE_ADMIN', 'ROLE_STAFF']); }
  isMember(): boolean       { return this.hasRole('ROLE_MEMBER'); }
  isUser(): boolean         { return this.hasRole('ROLE_USER'); }

  isMemberOrStaffOrAdmin(): boolean {
    return this.hasRole(['ROLE_MEMBER', 'ROLE_STAFF', 'ROLE_ADMIN']);
  }

  // ─── Session State ────────────────────────────────────────────────────────────

  isLoggedIn(): boolean {
    return this.loginStatus || localStorage.getItem('isLoggedIn') === 'true';
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn() && this.userDetails !== null;
  }

  getUserDetails(): User | null {
    return this.userDetails;
  }

  updateUserName(firstName: string, lastName: string): void {
    if (this.userDetails) {
      this.userDetails.firstName = firstName;
      this.userDetails.lastName = lastName;
    }
  }

  // ─── Logout / Invalidate ─────────────────────────────────────────────────────

  /** Clear in-memory state and localStorage without making a server call. */
  invalidate(): void {
    this.loginStatus = false;
    this.userRoles = [];
    this.userDetails = null;
    this.removeFromLocalStorage();
  }

  logout(): void {
    const user = this.userDetails;
    const isIms = !!(user && user.login && !user.login.includes('@'));
    const hasImsCookie = this.isImsSessionValid();
    const cookieName = this.imsConfigService.getImsCookieName();
    let token = cookieName ? this.getCookie(cookieName) : null;

    if (isIms && hasImsCookie ) {
      const imsEndpoint = this.imsConfigService.getImsEndpoint();

      const callbackUrl =
        `${imsEndpoint}/#/login?serviceReferer=${encodeURIComponent(
          window.location.origin + '/#/login'
        )}`;

      const imsUrl = new URL(imsEndpoint);

      let keycloakHost = imsUrl.hostname;
      if (keycloakHost.includes('-ims.')) {
        keycloakHost = keycloakHost.replace('-ims.', '-snoauth.');
      } else if (keycloakHost.startsWith('ims.')) {
        keycloakHost = keycloakHost.replace('ims.', '-snoauth.');
      }

      const keycloakEndpoint = `${imsUrl.protocol}//${keycloakHost}`;

      const redirectUrl =
        `${keycloakEndpoint}/realms/snomed/protocol/openid-connect/logout` +
        `?client_id=IMS` +
        `&post_logout_redirect_uri=${encodeURIComponent(callbackUrl)}`;

      const width = 600;
      const height = 500;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const popup = window.open(
        redirectUrl,
        'logoutPopup',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      

      const startTime = Date.now();

      const monitor = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (popup && popup.closed) {
          clearInterval(monitor);

          this.router.navigate(['/pendingApplications']);

          return;
        }

        if (elapsed >= 60000) {
          clearInterval(monitor);
          if (popup && !popup.closed) {
            popup.close();
          }

          this.router.navigate(['/pendingApplications']);

          return;
        }
        this.http
          .get('/ims-api/api/account', {
            withCredentials: true
          })
          .subscribe({
            next: () => {
            },
            error: () => {

              clearInterval(monitor);

              if (popup && !popup.closed) {
                popup.close();
              }

              this.http.get<void>('/app/logout', {
                withCredentials: true
              }).subscribe({
                next: () => {
                  this.invalidate();

                  if (cookieName) {
                    this.deleteCookie(cookieName);
                  }

                  this.router.navigate([this.routes.login]);
                },
                error: () => {
                  this.invalidate();

                  if (cookieName) {
                    this.deleteCookie(cookieName);
                  }

                  this.router.navigate([this.routes.login]);
                }
              });
            }
          });
      }, 2000);

      return;
    }


    const hasImsCookieValid = this.isImsSessionValid();

    this.invalidate();

    if (cookieName) {
      this.deleteCookie(cookieName);
    }

    const handleRedirect = () => {
      if (isIms && hasImsCookieValid) {
        sessionStorage.setItem('loggedOut', 'true');

        const imsEndpoint = this.imsConfigService.getImsEndpoint();
        const callbackUrl = `${window.location.origin}/`;

        const imsUrl = new URL(imsEndpoint);

        let keycloakHost = imsUrl.hostname;
        if (keycloakHost.includes('-ims.')) {
          keycloakHost = keycloakHost.replace('-ims.', '-snoauth.');
        } else if (keycloakHost.startsWith('ims.')) {
          keycloakHost = keycloakHost.replace('ims.', '-snoauth.');
        }

        const keycloakEndpoint = `${imsUrl.protocol}//${keycloakHost}`;

        let redirectUrl =
          `${keycloakEndpoint}/realms/snomed/protocol/openid-connect/logout`;

        if (token) {
          redirectUrl +=
            `?id_token_hint=${encodeURIComponent(token)}` +
            `&post_logout_redirect_uri=${encodeURIComponent(callbackUrl)}`;
        } else {
          redirectUrl +=
            `?client_id=IMS` +
            `&post_logout_redirect_uri=${encodeURIComponent(callbackUrl)}`;
        }

        window.location.href = redirectUrl;
      } else {
        this.afterLogout();
      }
    };

    this.http.get<void>('/app/logout', { withCredentials: true }).subscribe({
      next: () => handleRedirect(),
      error: () => handleRedirect()
    });
  }
  /**
   * Extract a translation key from a server error code.
   */
  extractErrorCode(message: string): string {
    const errorCodeMapping: { [key: string]: string } = {
      'MLDS_ERR_AUTH_NO_PERMISSIONS': 'login.messages.error.noPermissions',
      'MLDS_ERR_AUTH_BAD_PASSWORD':   'login.messages.error.authentication',
      'MLDS_ERR_AUTH_DEREGISTERED':   'login.messages.error.deregistered',
      'MLDS_ERR_AUTH_SYSTEM':         'global.messages.error.server'
    };
    return errorCodeMapping[message] || 'login.messages.error.authentication';
  }


  private loadFromLocalStorage(): void {
    this.loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const stored = localStorage.getItem('userDetails');
    this.userDetails = stored ? JSON.parse(stored) : null;
    this.userRoles = this.userDetails?.roles ?? [];
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
    localStorage.removeItem('selectedItem');
    localStorage.removeItem('loginType');
  }

  private afterLogout(): void {
    this.cleanupModals();
    this.router.navigate([this.routes.login]).then(() => {
      window.location.reload();
    });
  }

  private cleanupModals(): void {
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops[0]) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  private deleteCookie(name: string): void {
    const domainParts = window.location.hostname.split('.');
    const domains: string[] = ['', window.location.hostname, 'localhost'];
    let currentDomain = '';

    for (let i = domainParts.length - 1; i >= 0; i--) {
      currentDomain = '.' + domainParts[i] + currentDomain;
      domains.push(currentDomain);
      domains.push(currentDomain.substring(1));
    }

    for (const domain of domains) {
      for (const path of ['/', window.location.pathname]) {
        let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
        if (domain) {
          cookieString += `; domain=${domain}`;
        }
        document.cookie = cookieString;
      }
    }
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    for (let c of document.cookie.split(';')) {
      c = c.trimStart();
      if (c.startsWith(nameEQ)) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  private setupFocusListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        if (this.isLoggedIn()) {
          this.imsConfigService.load().then(() => {
            if (!this.isImsSessionValid()) {
              this.logout();
            }
          });
        }
      });
    }
  }

  isImsSession(): boolean {
    return localStorage.getItem('loginType') === 'IMS';
  }

  isImsUser(): boolean {
    return this.isImsSession();
  }

  isImsSessionValid(): boolean {
    if (!this.isImsUser()) {
      return true;
    }
    const cookieName = this.imsConfigService.getImsCookieName();
    let token = cookieName ? this.getCookie(cookieName) : null;
    if (!token) {
      token = this.getCookie('dev-ims-ihtsdo') || this.getCookie('test-ims-ihtsdo') || this.getCookie('ims-ihtsdo');
    }
    return !!token;
  }

}
