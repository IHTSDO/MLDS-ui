import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApplicationUtilsService } from '../application-utils/application-utils.service';
import { AuthenticationSharedService } from '../authentication/authentication-shared.service';
import { UserAffiliateService } from '../user-affiliate/user-affiliate.service';
import { ROUTES } from 'src/app/routes-config';
import { HttpClient } from '@angular/common/http';
import { ImsConfigService } from '../ims-config/ims-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthBootstrapService {

  constructor(
    private authenticationService: AuthenticationSharedService,
    private userAffiliateService: UserAffiliateService,
    private applicationUtilsService: ApplicationUtilsService,
    private router: Router,
    private http: HttpClient,
    private imsConfigService: ImsConfigService
  ) {}

  async initialize(): Promise<void> {

    await this.imsConfigService.load();

    if (sessionStorage.getItem('loggedOut') === 'true') {
      sessionStorage.removeItem('loggedOut');
      window.location.replace(`${window.location.origin}/#/login`);
      return;
    }

    const imsCookieName = this.imsConfigService.getImsCookieName();

    if (!imsCookieName) {
      return;
    }

    const token = this.getCookie(imsCookieName);

    if (!token) {

      return;
    }


    if (this.authenticationService.isLoggedIn()) {
      return;
    }

    try {

      try {
        await firstValueFrom(this.restoreSession());
      } catch {

      }

      const user = await firstValueFrom(
        this.authenticationService.getAccountDetails()
      );

      this.authenticationService.loginStatus = true;
      this.authenticationService.handleUserDetails(user);
      localStorage.setItem('loginType', 'IMS');


      const destination = this.resolveDestination(user.roles ?? []);


      const hash = window.location.hash;
      if (this.isAtRootWithoutHash() || hash.includes('/login') || hash.includes('/landing')) {

        window.location.replace(destination);
      }

    } catch (error) {

      console.error('Bootstrap: unable to restore IMS session:', error);
      this.authenticationService.invalidate();


    }

  }


  private resolveDestination(roles: string[]): string {

    const origin = window.location.origin;

    const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');

    if (redirectAfterLogin) {
      sessionStorage.removeItem('redirectAfterLogin');
      return `${origin}/#${redirectAfterLogin}`;
    }

    if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF')) {
      return `${origin}/#${ROUTES.pendingApplications}`;
    }

    if (roles.includes('ROLE_MEMBER')) {
      return `${origin}/#${ROUTES.ihtsdoReleases}`;
    }

    return `${origin}/#${ROUTES.userDashboard}`;

  }

  private isAtRootWithoutHash(): boolean {
    const hash = window.location.hash;
    return !hash || hash === '#' || hash === '#/';
  }

  async navigateByRole(): Promise<void> {

    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');

    if (redirectUrl) {
      sessionStorage.removeItem('redirectAfterLogin');
      await this.router.navigateByUrl(redirectUrl);
      return;
    }

    if (this.authenticationService.isStaffOrAdmin()) {
      await this.router.navigate([ROUTES.pendingApplications]);
      return;
    }

    if (this.authenticationService.isMember()) {
      await this.router.navigate([ROUTES.ihtsdoReleases]);
      return;
    }

    try {

      await firstValueFrom(this.userAffiliateService.loadUserAffiliate());

      const waiting = this.applicationUtilsService.isApplicationWaitingForApplicant(
        this.userAffiliateService.affiliate.application
      );

      await this.router.navigate([
        waiting ? '/affiliateRegistration' : ROUTES.userDashboard
      ]);

    } catch {

      await this.router.navigate([ROUTES.userDashboard]);

    }

  }

  private restoreSession() {
    return this.http.post('/api/auth/restore', {}, { withCredentials: true });
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

}