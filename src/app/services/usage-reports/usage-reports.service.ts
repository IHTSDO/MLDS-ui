import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Service for retrieving usage reports.
 */
@Injectable({
  providedIn: 'root'
})
export class UsageReportsService {
  /**
   * Base URL for API requests.
   */
  private apiUrl = environment.apiUrl;

  /**
   * Creates an instance of UsageReportsService.
   * @param http HttpClient instance.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves submitted usage reports.
   * 
   * @param page Page number (1-indexed).
   * @param pageSize Number of items per page.
   * @param orderby Field to order by (e.g. 'id', 'name', etc.).
   * @returns Observable of usage reports.
   * 
   * @example
   * this.usageReportsService.getSubmittedUsageReports(1, 10, 'id')
   *   .subscribe(reports => console.log(reports));
   */
  getSubmittedUsageReports(page: number, pageSize: number, orderby: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('orderby', orderby)
      .set('$filter', 'approvalState/not submitted eq false');

    return this.http.get(`${this.apiUrl}/commercialUsages/`, { params });
  }
}