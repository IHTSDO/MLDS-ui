import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/passwordReset/${token}`, { password }, { responseType: 'text' });
  }

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

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404:
        return 'Email not found.';
      default:
        return `Server error: ${error.status}.`;
    }
  }



}
