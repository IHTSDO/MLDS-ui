import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationSharedService } from "../services/authentication/authentication-shared.service";

export const memberStaffAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationSharedService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/landing']);
    return false;
  }

  if (authService.isMemberOrStaffOrAdmin()) {
    return true;
  }

  if (authService.isUser()) {
    router.navigate(['/userDashboard']);
    return false;
  }

  router.navigate(['/landing']);
  return false;
};
