import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReleaseFileDownloadCountService {

  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findReleaseFileDownloadCounts(params: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/audits/getAllAuditEvents`, params);
  }

  getUsers(startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get(`${this.apiUrl}/audits/getAllUsersonSelectedDate`, { params });
  }
}
