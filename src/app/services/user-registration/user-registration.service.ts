import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

/**
 * Service for user registration-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  private apiUrl = API_ROUTES.apiUrl;

  /**
   * Creates an instance of UserRegistrationService.
   * @param {HttpClient} http - The HTTP client for making API requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves an application by its ID.
   * @param {string} applicationId - The ID of the application to retrieve.
   * @returns {Observable<any>} An observable that emits the retrieved application data.
   * @example
   * const applicationId = '12345';
   * this.userRegistrationService.getApplicationById(applicationId).subscribe((application) => {
   *   console.log(application);
   * });
   */
  getApplicationById(applicationId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/${encodeURIComponent(applicationId)}`);
  }

  getApplication(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/me`);
  }


  /**
   * Updates the internal notes for an application.
   * @param {any} application - The application object with updated notesInternal property.
   * @returns {Observable<void>} An observable that completes when the update is successful.
   * @example
   * const application = { applicationId: '12345', notesInternal: 'New internal notes' };
   * this.userRegistrationService.updateApplicationNoteInternal(application).subscribe(() => {
   *   console.log('Internal notes updated successfully');
   * });
   */
  updateApplicationNoteInternal(application: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/applications/${encodeURIComponent(application.applicationId)}/notesInternal`, application.notesInternal);
  }

  /**
   * Approves an application with a specified status.
   * @param {any} application - The application object to approve.
   * @param {string} approvalStatus - The status to set for the application (e.g. 'approved', 'rejected', etc.).
   * @returns {Observable<void>} An observable that completes when the approval is successful.
   * @example
   * const application = { applicationId: '12345' };
   * const approvalStatus = 'approved';
   * this.userRegistrationService.approveApplication(application, approvalStatus).subscribe(() => {
   *   console.log('Application approved successfully');
   * });
   */
  approveApplication(application: any, approvalStatus: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/applications/${encodeURIComponent(application.applicationId)}/approve`, approvalStatus);
  }

  saveApplication(applicationForm: any, applicationId: any): Observable<any> {
    const url = `${this.apiUrl}/applications/${encodeURIComponent(applicationId)}/registration`;
    return this.http.put(url, applicationForm);
  }

  submitApplication(applicationForm: any, applicationId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/applications/${encodeURIComponent(applicationId)}/registration`, applicationForm);
  }

  createExtensionApplication(member: { key: string }): Observable<any> {
    const payload = {
      memberKey: member.key,
      applicationType: 'EXTENSION',
    };

    return this.http.post(`${this.apiUrl}/applications`, payload);
  }
  updateApplication(application: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/`+ encodeURIComponent(application.applicationId), application);
  }

  deleteApplication(applicationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/applications/`+ encodeURIComponent(applicationId));
  }
}