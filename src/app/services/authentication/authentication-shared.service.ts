import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationSharedService {
  private apiUrl = environment.apiUrl;
  private accountApiBaseUrl = environment.accountApiBaseUrl;
  loginStatus = false;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    const data = new URLSearchParams();
    data.set('j_username', username);
    data.set('j_password', password);
    data.set('remember-me', rememberMe.toString());

    return this.http.post(`${this.accountApiBaseUrl}/authentication`, data.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }), observe: 'response', withCredentials: true
    }).pipe(
      map((response: any) => {
        if (response.status == 200) {
          this.loginStatus = true;
        }
        return this.getAccountDetails().pipe(
          map((accountData) => {
            return accountData;
          })
        );
      })
    );
  }

  getAccountDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/account`);
  }



  extractErrorCode(message: string): string {
    const errorCodeMapping: { [key: string]: string } = {
      'MLDS_ERR_AUTH_NO_PERMISSIONS': 'login.messages.error.noPermissions',
      'MLDS_ERR_AUTH_BAD_PASSWORD': '<strong>Authentication failed!</strong> Please check your credentials and try again. Passwords are case sensitive.',
      'MLDS_ERR_AUTH_DEREGISTERED': 'login.messages.error.deregistered',
      'MLDS_ERR_AUTH_SYSTEM': 'global.messages.error.server'
    };

    return errorCodeMapping[message] || '<strong>Authentication failed!</strong> Please check your credentials and try again. Passwords are case sensitive.';
  }


  logout() {
    this.loginStatus = false;

  }

  isLoggedIn() {
    if (this.loginStatus) {
      return true;
    }
    return false;
  }

}
