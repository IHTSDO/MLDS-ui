import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})
export class ReleaseVersionsService {


  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) { }

  save(releasePackageId: string, releaseVersion: any): Observable<any> {
    const url = `${this.apiUrl}/releasePackages/${releasePackageId}/releaseVersions`;
    return this.http.post<any>(url, releaseVersion).pipe(
      catchError(this.handleError)
    );
  }
  
  update(releasePackageId: string, releaseVersionId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/releasePackages/${releasePackageId}/releaseVersions/${releaseVersionId}`, data).pipe(
      catchError(this.handleError)
    );
  }

  notify(releasePackageId: string, releaseVersionId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/releasePackages/${releasePackageId}/releaseVersions/${releaseVersionId}/notifications`, data).pipe(
      catchError(this.handleError)
    );
  }

  checkFilePresence(downloadUrl: string): Observable<boolean> {
    const checkUrl = downloadUrl.replace('/download', '/check');
    return this.http.get<string>(checkUrl, { responseType: 'text' as 'json' }).pipe(
      map(response => response === 'true'),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
