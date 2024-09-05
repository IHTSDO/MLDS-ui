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

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
