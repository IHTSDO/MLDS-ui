import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})
export class PostAnnouncementService {

  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) {}

  postAnnouncement(announcement: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/announcements`, announcement, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
