import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Audits service provides methods to retrieve audit logs from the API.
 */
@Injectable({
  providedIn: 'root'
})
export class AuditsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves audits with optional filtering.
   *
   * @param filter - OData filter query (e.g. `auditEventDate ge '2022-01-01' and auditEventDate le '2022-01-31'`)
   * @returns Observable of an array of audit logs
   */
  private findFilteredAudits(filter?: string): Observable<any[]> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('$filter', filter);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/audits`, { params }).pipe(
      map(response => response.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    );
  }

  /**
   * Retrieves all audits.
   *
   * @returns Observable of an array of all audit logs
   * @example
   * this.auditsService.findAll().subscribe(audits => console.log(audits));
   */
  findAll(): Observable<any[]> {
    return this.findFilteredAudits();
  }

  /**
   * Retrieves audits by date range.
   *
   * @param fromDate - Start date of the range (e.g. '2022-01-01')
   * @param toDate - End date of the range (e.g. '2022-01-31')
   * @returns Observable of an array of audit logs within the specified date range
   * @example
   * this.auditsService.findByDates('2022-01-01', '2022-01-31').subscribe(audits => console.log(audits));
   */
  findByDates(fromDate: string, toDate: string): Observable<any[]> {
    return this.findFilteredAudits(`auditEventDate ge '${fromDate}' and auditEventDate le '${toDate}'`);
  }

  /**
   * Retrieves audits by audit event type.
   *
   * @param auditEventType - Type of audit event (e.g. 'LOGIN_SUCCESS')
   * @returns Observable of an array of audit logs with the specified audit event type
   * @example
   * this.auditsService.findByAuditEventType('LOGIN_SUCCESS').subscribe(audits => console.log(audits));
   */
  findByAuditEventType(auditEventType: string): Observable<any[]> {
    return this.findFilteredAudits(`auditEventType eq '${auditEventType}'`);
  }

  /**
   * Retrieves audits by affiliate ID.
   *
   * @param affiliateId - ID of the affiliate (e.g. 'AFFILIATE_123')
   * @returns Observable of an array of audit logs with the specified affiliate ID
   * @example
   * this.auditsService.findByAffiliateId('AFFILIATE_123').subscribe(audits => console.log(audits));
   */
  findByAffiliateId(affiliateId: string): Observable<any[]> {
    return this.findFilteredAudits(`affiliateId eq '${affiliateId}'`);
  }

  /**
   * Retrieves audits by application ID.
   *
   * @param applicationId - ID of the application (e.g. 'APP_123')
   * @returns Observable of an array of audit logs with the specified application ID
   * @example
   * this.auditsService.findByApplicationId('APP_123').subscribe(audits => console.log(audits));
   */
  findByApplicationId(applicationId: string): Observable<any[]> {
    return this.findFilteredAudits(`applicationId eq '${applicationId}'`);
  }
}