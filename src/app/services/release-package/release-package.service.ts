import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})
export class ReleasePackageService {

  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) { }

  updateReleaseLicense(releasePackageId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${this.apiUrl}/releasePackages/${releasePackageId}/license`;
    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError)
    );
  }


  getReleaseLicense(releasePackageId: string): void {
    const url = `${this.apiUrl}/releasePackages/${encodeURIComponent(releasePackageId)}/license`;
    window.open(url, '_blank');
  }

  updateArchive(releaseVersionId: number, isArchive: boolean): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateArchive/${encodeURIComponent(releaseVersionId)}`, null, {
      params: { isArchive: isArchive.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  determineDependencyPresence(releaseVersionId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkVersionDependency/${releaseVersionId}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  getVersionDependencyNames(releaseVersionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getVersionDependencyNames/${releaseVersionId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

}
