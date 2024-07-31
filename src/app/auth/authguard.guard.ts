import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationSharedService } from '../services/authentication/authentication-shared.service';

export const authguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationSharedService);
  const router = inject(Router);

  if(authService.isLoggedIn()){
  return true;
  }

  router.navigate(['/']);
  return false;

};
