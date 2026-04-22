import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationSharedService } from "../services/authentication/authentication-shared.service";

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationSharedService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  if (authService.isStaffOrAdmin()) {
    router.navigate(['/pendingApplications']);
  } else if (authService.isMemberOrStaffOrAdmin()) {
    router.navigate(['/ihtsdoReleases']);
  } else {
    router.navigate(['/userDashboard']);
  }

  return false;
};
