import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationSharedService } from "../services/authentication/authentication-shared.service";

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationSharedService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (authService.isStaffOrAdmin()) {
    router.navigate(['/pendingApplications']);
    return false;
  }

  if (authService.isMemberOrStaffOrAdmin()) {
    router.navigate(['/ihtsdoReleases']);
    return false;
  }

  if (authService.isUser()) {
    return true;
  }

  router.navigate(['/landing']);
  return false;
};
