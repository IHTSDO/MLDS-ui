import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogsService {

  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) {}

  findFilteredAudits(filter?: string): Observable<any[]> {
    const url = `${this.apiUrl}/audits${filter ? `?$filter=${encodeURIComponent(filter)}` : ''}`;
    return this.http.get<any[]>(url).pipe(
      map(response => response.sort((a, b) => b.timestamp - a.timestamp))
    );
  }

  findAll(): Observable<any> {
    return this.findFilteredAudits();
  }

  findByDates(fromDate: string, toDate: string): Observable<any> {
    const filter = `auditEventDate ge '${fromDate}' and auditEventDate le '${toDate}'`;
    return this.findFilteredAudits(filter);
  }

  findByAuditEventType(auditEventType: string): Observable<any> {
    const filter = `auditEventType eq '${auditEventType}'`;
    return this.findFilteredAudits(filter);
  }

  findByAffiliateId(affiliateId: string): Observable<any> {
    const filter = `affiliateId eq '${affiliateId}'`;
    return this.findFilteredAudits(filter);
  }

  findByApplicationId(applicationId: string): Observable<any> {
    const filter = `applicationId eq '${applicationId}'`;
    return this.findFilteredAudits(filter);
  }
}