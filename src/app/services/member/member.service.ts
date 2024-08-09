import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private apiUrl = environment.apiUrl;
  private memberKeySubject = new BehaviorSubject<string | null>(null);
  memberKey$ = this.memberKeySubject.asObservable();

  private memberLogoSubject = new BehaviorSubject<string | null>(null);
  memberLogo$ = this.memberLogoSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  getMembers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/members`);
  }

  setMemberKey(memberKey: string): void {
    this.memberKeySubject.next(memberKey);
  }

  setMemberLogo(logoUrl: string): void {
    this.memberLogoSubject.next(logoUrl);
  }


  getMemberLogo(memberKey: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/logo`, { responseType: 'blob' }).pipe(
      map((blob: Blob) => {
        if (blob.type.startsWith('image/')) {
          return URL.createObjectURL(blob);
        } else {
          throw new Error('Received non-image blob');
        }
      }),
      catchError(error => {
        return of('assets/logo.png');
      })
    );
  }

  updateMemberBrand(memberKey: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/brand`, formData,{
      headers: {},
      observe: 'response'
    });
  }

  updateMemberNotifications(memberKey: string, staffNotificationEmail: string): Observable<any> {
    const member = { staffNotificationEmail };
    return this.http.put<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/notifications`, member);
  }

  getMemberLicense(memberKey: string): Observable<string> {
    return of(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/license`);
  }

  updateLicense(memberKey: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/license`, formData);
  }

  updateMemberFeedData(memberKey: string, memberOrgName: string, memberOrgURL: string, contactEmail: string): Observable<any> {
    const member = {
      memberOrgName,
      memberOrgURL,
      contactEmail
    };
    return this.http.put<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/memberFeedUrl`, member);
  }
}
