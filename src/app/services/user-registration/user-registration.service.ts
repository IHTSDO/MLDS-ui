import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getApplicationById(applicationId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/${encodeURIComponent(applicationId)}`);
  }

  updateApplicationNoteInternal(application: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/applications/${encodeURIComponent(application.applicationId)}/notesInternal`, application.notesInternal);
  }

  approveApplication(application: any, approvalStatus: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/applications/${encodeURIComponent(application.applicationId)}/approve`, approvalStatus);
  }
}
