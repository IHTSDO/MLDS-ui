import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})

export class ReleaseFileService {

  private baseUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) { }

  save(releasePackageId: string, releaseVersionId: string, releaseFile: any): Observable<any> {
    const url = `${this.baseUrl}/releasePackages/${releasePackageId}/releaseVersions/${releaseVersionId}/releaseFiles`;

    return this.http.post<any>(url, releaseFile).pipe(
      catchError(this.handleError)
    );
  }

  update(releasePackageId: string, releaseVersionId: string, releaseFileId: string, releaseFile: any): Observable<any> {
    const url = `${this.baseUrl}/releasePackages/${releasePackageId}/releaseVersions/${releaseVersionId}/releaseFiles`;
    const params = { releaseFileId: releaseFileId };

    return this.http.put<any>(url, releaseFile, { params }).pipe(
      catchError(this.handleError)
    );
  }

  delete(releasePackageId: string, releaseVersionId: string, releaseFileId: string): Observable<any> {
    const url = `${this.baseUrl}/releasePackages/${releasePackageId}/releaseVersions/${releaseVersionId}/releaseFiles/${releaseFileId}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}