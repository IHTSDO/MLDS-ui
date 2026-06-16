import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationSharedService } from '../services/authentication/authentication-shared.service';

/**
 * Protects routes that require authentication.
 * Saves the intended route path to localStorage so the user is redirected
 * back after a successful login (including IMS login).
 */
export const authguardGuard: CanActivateFn = (route, state: RouterStateSnapshot) => {
  const authService = inject(AuthenticationSharedService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    if (!authService.isImsSessionValid()) {
      authService.invalidate();
      router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // Store the Angular route path (e.g. "/pendingApplications") — NOT the full href.
  // This works correctly with both normal login and IMS redirect login.
  sessionStorage.setItem('redirectAfterLogin', state.url);

  router.navigate(['/login']);
  return false;
};
