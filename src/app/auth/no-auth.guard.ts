import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationSharedService } from '../services/authentication/authentication-shared.service';

/**
 * Blocks access to public-only routes (login, landing, register) when already logged in.
 * Redirects authenticated users to their role-appropriate default page.
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationSharedService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; // Not logged in — allow access to the public route
  }

  // User is already authenticated — redirect to their home page
  if (authService.isStaffOrAdmin()) {
    router.navigate(['/pendingApplications']);
  } else if (authService.isMember()) {
    router.navigate(['/ihtsdoReleases']);
  } else {
    router.navigate(['/userDashboard']);
  }

  return false;
};
