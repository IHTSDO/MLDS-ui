import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config'

/**
 * LoginComponent - Handles user login functionality
 *
 * This component is responsible for handling user login functionality, including
 * validating user credentials, authenticating with the backend, and redirecting
 * to the appropriate dashboard based on user role.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  /**
   * Username input field value
   */
  username: string = '';

  /**
   * Password input field value
   */
  password: string = '';

  /**
   * Remember me checkbox value
   */
  rememberMe: boolean = true;

  /**
   * Indicates whether the login form is currently submitting
   */
  submitting: boolean = false;

  /**
   * Indicates whether an authentication error occurred
   */
  authenticationError: boolean = false;

  /**
   * Error message key for authentication error
   */
  authenticationErrorMessageKey: string = '';

  /**
   * Routes configuration
   */
  routes = ROUTES;

  /**
   * Constructor
   *
   * @param authenticationService - Authentication shared service
   * @param router - Router instance
   */
  constructor(
    private authenticationService: AuthenticationSharedService,
    private router: Router
  ) {}

  /**
   * Login function
   *
   * Submits the login form and authenticates with the backend. If successful,
   * redirects to the appropriate dashboard based on user role.
   *
   * Example:
   * ```
   * this.login();
   * ```
   */
  login() {
    this.submitting = true;
    this.authenticationService.login(this.username, this.password, this.rememberMe)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (data) => {
          if(this.authenticationService.isStaffOrAdmin()){
            this.router.navigate([this.routes.pendingApplications]);
          } else {
            this.router.navigate([this.routes.userDashboard])
          }
        },
        error: (error) => {
          this.authenticationError = true;
          this.authenticationErrorMessageKey = this.authenticationService.extractErrorCode(error.message);
        }
      });
  }

}