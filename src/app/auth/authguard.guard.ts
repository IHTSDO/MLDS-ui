import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationSharedService } from "../services/authentication/authentication-shared.service";

/**
 * AuthGuard that checks if the user is logged in before allowing access to a route.
 *
 * If the user is not logged in, it redirects them to the root route ('/').
 *
 * @example
 * ```typescript
 * import { NgModule } from '@angular/core';
 * import { RouterModule, Routes } from '@angular/router';
 * import { AuthGuard } from './auth.guard';
 *
 * const routes: Routes = [
 *   {
 *     path: 'protected',
 *     component: ProtectedComponent,
 *     canActivate: [AuthGuard]
 *   }
 * ];
 *
 * @NgModule({
 *   imports: [RouterModule.forRoot(routes)],
 *   exports: [RouterModule]
 * })
 * export class AppRoutingModule {}
 * ```
 *
 * @param {import('@angular/router').ActivatedRouteSnapshot} route
 * @param {import('@angular/router').RouterStateSnapshot} state
 * @returns {boolean} true if the user is logged in, false otherwise
 */
export const authguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationSharedService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};