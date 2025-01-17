import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

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
  private apiUrl = API_ROUTES.apiUrl;

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

  findReleaseFileDownloadCountsCSV(params: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/audits/getAllAuditEventsCSV`, params);
  }
}