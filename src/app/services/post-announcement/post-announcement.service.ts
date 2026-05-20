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
  sendTestEmail(payload: any) {
    return this.http.post(
        '/api/announcements/test',
        payload
    );
  }
  getTestEmailDomains() {

    return this.http.get(
      '/api/test-email-domains'
    );
  }
  
  createTestEmailDomain(payload: any) {
  
    return this.http.post(
      '/api/test-email-domains',
      payload
    );
  }
  
  updateTestEmailDomain(
    id: number,
    payload: any
  ) {
  
    return this.http.put(
      `/api/test-email-domains/${id}`,
      payload
    );
  }
  
  deleteTestEmailDomain(id: number) {
  
    return this.http.delete(
      `/api/test-email-domains/${id}`
    );
  }
  getMaxTestEmailCount() {

    return this.http.get<number>(
      '/api/test-email/max-count'
    );
  }
}
