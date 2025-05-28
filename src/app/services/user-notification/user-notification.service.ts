import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {

  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) {}

  unsubscribeUser(affiliateId: string, key: string): Observable<any> {
    const url = `${this.apiUrl}/unsubscribenotification/${affiliateId}/${key}`;
    return this.http.post(url, null, { responseType: 'text' });
  }
  
}