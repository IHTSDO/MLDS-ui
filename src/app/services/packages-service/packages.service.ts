import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ROUTES } from 'src/app/routes-config-api';
import { MemberService } from '../member/member.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient,private memberService: MemberService) { }

  loadPackages(): Observable<any[]> {
    return this.memberService.getMembers().pipe(
      switchMap(() => this.fetchReleasePackages())
    );
  }

  fetchReleasePackages(): Observable<any[]> {
    return this.getReleasePackages().pipe(
      catchError(this.handleError)
    );
  }

  loadArchivePackages(): Observable<any[]> {
    return this.memberService.getMembers().pipe(
      switchMap(() => this.fetchArchiveReleasePackages())
    );
  }

  fetchArchiveReleasePackages(): Observable<any[]> {
    return this.getArchiveReleasePackages().pipe(
      catchError(this.handleError)
    );
  }

  updateReleasePackage(id: number, p: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/releasePackages/${id}`, p).pipe(
      catchError(this.handleError)
    );
  }

  private getReleasePackages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/releasePackages`).pipe(
      catchError(this.handleError)
    );
  }
  
  private getArchiveReleasePackages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/archiveReleasePackages`).pipe(
      catchError(this.handleError)
    );
  }

  getReleasePackageById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/releasePackages/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  save(releasePackage: any) {
    return this.http.post<any>(`${this.apiUrl}/releasePackages`, releasePackage).pipe(
      catchError(this.handleError)
    );
  }

  delete(releasePackage : any) {
    return this.http.delete<any>(`${this.apiUrl}/releasePackages/${releasePackage.releasePackageId}`,releasePackage).pipe(
      catchError(this.handleError)
    );
  }

   getReleaseTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/releaseTypes`).pipe(
      catchError(this.handleError)
    );
  }

   getReleasePermission(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/releasePermission`).pipe(
      catchError(this.handleError)
    );
  }

  getMasterReleasePermission(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/masterReleasePermission`).pipe(
      catchError(this.handleError)
    );
  }

  getPermissionedUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/usersAccess`).pipe(
      catchError(this.handleError)
    )
  }

  getMasterPermissionedUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/masterUsersAccess?releaseType=${id}`).pipe(
      catchError(this.handleError)
    )
  }

  getReleaseVisiblity(id: string): Observable<string> {
  return this.http.get<string>(`${this.apiUrl}/viewVisiblity/${id}`).pipe(
    catchError(this.handleError)
  );
  }


  updateReleasesPackageType(selectedReleses: string[], releasePackageType: string, selectedUsers: string[]): Observable<any> {
    const body = { releases: selectedReleses, releasePackageType: releasePackageType, users: selectedUsers };
    return this.http.put<any>(`${this.apiUrl}/releasePackages/updatePermissionType`, body).pipe(
      catchError(this.handleError)
    );
  }

  checkUpdateReleasesPackageType(selectedReleses: string[], releasePackageType: string, selectedUsers: string[]): Observable<any> {
    const body = { releases: selectedReleses, releasePackageType: releasePackageType, users: selectedUsers };
    return this.http.post<any>(`${this.apiUrl}/releasePackages/checkUpdatePermissionType`, body).pipe(
      catchError(this.handleError)
    );
  }

  checkUpdateReleasesPackageMasterType(selectedReleses: string, releasePermissionType: string, selectedUsers: string[]): Observable<any> {
    const body = { releaseType: selectedReleses, releasePackage: "ALL", releasePermissionType: releasePermissionType, users: selectedUsers};
    return this.http.post<any>(`${this.apiUrl}/releasePackages/checkConfigPermissionType`, body).pipe(
      catchError(this.handleError)
    );
  }

  updateReleasesPackageMasterType(selectedReleses: string, releasePermissionType: string, selectedUsers: string[]): Observable<any> {
    const body = { releaseType: selectedReleses, releasePackage: "ALL", releasePermissionType: releasePermissionType, users: selectedUsers};
    return this.http.post<any>(`${this.apiUrl}/releasePackages/ConfigPermissionType`, body).pipe(
      catchError(this.handleError)
    );
  }


  updateUserAccess(releaseId: string, user: string): Observable<any> {
    const body = { releaseId: releaseId, user: user};
    return this.http.put(`${this.apiUrl}/userAccessRevoke`, body, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  releaseAccessRevoke(releaseId: string, permissionType: string): Observable<any> {
    const body = { releaseId: releaseId, permissionType: permissionType};
    return this.http.put(`${this.apiUrl}/releaseAccessRevoke`, body, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
