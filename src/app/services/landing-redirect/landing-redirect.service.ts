import { Injectable } from '@angular/core';
import { AuthenticationSharedService } from '../authentication/authentication-shared.service';
import { Router } from '@angular/router';
import { ApplicationUtilsService } from '../application-utils/application-utils.service';
import { UserAffiliateService } from '../user-affiliate/user-affiliate.service';
import { switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingRedirectService {

  constructor(
    private router: Router,
    private userAffiliateService: UserAffiliateService,
    private applicationUtilsService: ApplicationUtilsService,
    private authenticationSharedService: AuthenticationSharedService // Assuming you have a SessionService
  ) {}

  
  redirect(): void {
    const user = this.authenticationSharedService.getUserDetails();
    if (user) {
      if (this.authenticationSharedService.isStaffOrAdmin()) {
        this.router.navigate(['/pendingApplications']);
      } else if (this.authenticationSharedService.isMember()) {
        this.router.navigate(['/ihtsdoReleases']);
      } else if (this.authenticationSharedService.isUser()) {
        this.userAffiliateService.affiliate$.pipe(
          switchMap((affiliate) => {
            if (this.applicationUtilsService.isApplicationWaitingForApplicant(affiliate?.application)) {
              return this.router.navigate(['/affiliateRegistration']);
            } else {
              return this.router.navigate(['/dashboard']);
            }
          }),
          tap({
            error: (err) => {
              console.error('Error during redirection:', err);
              this.router.navigate(['/landing']);
            }
          })
        ).subscribe();
      } else {
        this.router.navigate(['/landing']);
      }
    } else {
      // Handle case where user is not logged in or userDetails is null
      this.router.navigate(['/landing']);
    }
  }
}