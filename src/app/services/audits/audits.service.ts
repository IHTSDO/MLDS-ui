import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private findFilteredAudits(filter?: string): Observable<any[]> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('$filter', filter);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/audits`, { params }).pipe(
      map(response => response.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    );
  }

  findAll(): Observable<any[]> {
    return this.findFilteredAudits();
  }

  findByDates(fromDate: string, toDate: string): Observable<any[]> {
    return this.findFilteredAudits(`auditEventDate ge '${fromDate}' and auditEventDate le '${toDate}'`);
  }

  findByAuditEventType(auditEventType: string): Observable<any[]> {
    return this.findFilteredAudits(`auditEventType eq '${auditEventType}'`);
  }

  findByAffiliateId(affiliateId: string): Observable<any[]> {
    return this.findFilteredAudits(`affiliateId eq '${affiliateId}'`);
  }

  findByApplicationId(applicationId: string): Observable<any[]> {
    return this.findFilteredAudits(`applicationId eq '${applicationId}'`);
  }
  
}

