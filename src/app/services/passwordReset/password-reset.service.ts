import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_ROUTES } from 'src/app/routes-config-api';

/**
 * Service for handling password reset functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = API_ROUTES.apiUrl;

  /**
   * Creates an instance of PasswordResetService.
   * @param {HttpClient} http - The HTTP client for making requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Resets a user's password using a token.
   * @param {string} token - The password reset token.
   * @param {string} password - The new password.
   * @returns {Observable<any>} - An observable that resolves to a success message.
   * @example
   * const token = 'reset-token';
   * const password = 'new-password';
   * this.passwordResetService.resetPassword(token, password).subscribe((response) => {
   *   console.log(response); // Output: "Password reset successfully."
   * });
   */
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/passwordReset/${token}`, { password }, { responseType: 'text' });
  }

  /**
   * Requests a password reset email to be sent to a user.
   * @param {string} email - The user's email address.
   * @returns {Observable<any>} - An observable that resolves to a success message or throws an error.
   * @example
   * const email = 'user@example.com';
   * this.passwordResetService.requestResetEmail(email).subscribe((response) => {
   *   console.log(response); // Output: "Password reset email sent successfully."
   * }, (error) => {
   *   console.error(error); // Output: "Email not found."
   * });
   */
  requestResetEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/passwordReset`, { email }, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Unknown error occurred.';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            errorMessage = this.getServerErrorMessage(error);
          }
          return throwError(errorMessage);
        })
      );
  }

  /**
   * Gets a server error message based on the HTTP error status code.
   * @param {HttpErrorResponse} error - The HTTP error response.
   * @returns {string} - A user-friendly error message.
   * @private
   */
  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404:
        return 'Email not found.';
      default:
        return `Server error: ${error.status}.`;
    }
  }
}