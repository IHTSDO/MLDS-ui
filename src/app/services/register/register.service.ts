import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Service for handling user registration.
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  /**
   * The base API URL for registration requests.
   */
  private apiUrl = environment.apiUrl;

  /**
   * Constructor for the RegisterService.
   * @param http The HttpClient instance for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Registers a new user account.
   *
   * @param account The user account information to register.
   * @returns An Observable of the registration response.
   *
   * Example:
   * ```
   * const account = {
   *   username: 'johnDoe',
   *   email: 'johndoe@example.com',
   *   password: 'mysecretpassword'
   * };
   * this.registerService.registerAccount(account).subscribe(response => {
   *   console.log(response);
   * });
   * ```
   */
  registerAccount(account: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, account);
  }
}