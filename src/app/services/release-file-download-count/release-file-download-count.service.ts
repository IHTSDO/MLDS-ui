import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Service for retrieving release file download counts and user data.
 */
@Injectable({
  providedIn: 'root'
})
export class ReleaseFileDownloadCountService {

  /**
   * Base URL for API requests.
   */
  private apiUrl = environment.apiUrl;

  /**
   * Constructor.
   * @param http HttpClient instance.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves release file download counts.
   *
   * Retrieves an array of release file download counts based on the provided request parameters.
   *
   * @param params Request parameters.
   * @returns Observable of release file download counts.
   * @example
   * const params = {
   *   releaseId: 1,
   *   fileId: 2,
   *   startDate: '2022-01-01',
   *   endDate: '2022-01-31'
   * };
   * this.releaseFileDownloadCountService.findReleaseFileDownloadCounts(params).subscribe(response => {
   *   console.log(response); // Output: [{ releaseId: 1, fileId: 2, downloadCount: 10 }]
   * });
   */
  findReleaseFileDownloadCounts(params: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/audits/getAllAuditEvents`, params);
  }

  /**
   * Retrieves users for a given date range.
   *
   * Retrieves an array of users who have performed actions within the specified date range.
   *
   * @param startDate Start date of the range (inclusive).
   * @param endDate End date of the range (inclusive).
   * @returns Observable of users.
   * @example
   * const startDate = '2022-01-01';
   * const endDate = '2022-01-31';
   * this.releaseFileDownloadCountService.getUsers(startDate, endDate).subscribe(response => {
   *   console.log(response); // Output: [{ userId: 1, username: 'john Doe' }, { userId: 2, username: 'Jane Doe' }]
   * });
   */
  getUsers(startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get(`${this.apiUrl}/audits/getAllUsersonSelectedDate`, { params });
  }
}