import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';
@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) {}

  // Method to change the password
  changePassword(payload: any): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl}/account/change_password`, payload);
  }
}
