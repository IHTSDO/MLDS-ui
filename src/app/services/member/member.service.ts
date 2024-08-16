import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Service for interacting with member-related API endpoints.
 */
@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private apiUrl = environment.apiUrl;
  private memberKeySubject = new BehaviorSubject<string | null>(null);
  /**
   * Observable that emits the current member key.
   */
  memberKey$ = this.memberKeySubject.asObservable();

  private memberLogoSubject = new BehaviorSubject<string | null>(null);
  /**
   * Observable that emits the current member logo URL.
   */
  memberLogo$ = this.memberLogoSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Retrieves a list of all members.
   *
   * @returns An observable that emits an array of member objects.
   */
  getMembers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/members`);
  }

  /**
   * Sets the current member key.
   *
   * @param memberKey The new member key.
   */
  setMemberKey(memberKey: string): void {
    this.memberKeySubject.next(memberKey);
  }

  /**
   * Sets the current member logo URL.
   *
   * @param logoUrl The new member logo URL.
   */
  setMemberLogo(logoUrl: string): void {
    this.memberLogoSubject.next(logoUrl);
  }

  /**
   * Retrieves the logo for a given member key.
   *
   * @param memberKey The member key to retrieve the logo for.
   * @returns An observable that emits the logo URL as a string.
   * @example
   * ```typescript
   * this.memberService.getMemberLogo('member-123').subscribe(logoUrl => {
   *   console.log(logoUrl); // Output: https://example.com/logo.png
   * });
   * ```
   */
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

  /**
   * Updates the brand information for a given member key.
   *
   * @param memberKey The member key to update the brand for.
   * @param formData The form data containing the brand information.
   * @returns An observable that emits the updated brand information.
   * @example
   * ```typescript
   * const formData = new FormData();
   * formData.append('brandName', 'New Brand Name');
   * formData.append('brandLogo', new File(['logo.png'], 'logo.png'));
   * this.memberService.updateMemberBrand('member-123', formData).subscribe(response => {
   *   console.log(response); // Output: Updated brand information
   * });
   * ```
   */
  updateMemberBrand(memberKey: string, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/brand`, formData, {
      headers: {},
      observe: 'response'
    });
  }

  /**
   * Updates the notification settings for a given member key.
   *
   * @param memberKey The member key to update the notifications for.
   * @param staffNotificationEmail The new staff notification email address.
   * @returns An observable that emits the updated notification settings.
   * @example
   * ```typescript
   * this.memberService.updateMemberNotifications('member-123', 'new-email@example.com').subscribe(response => {
   *   console.log(response); // Output: Updated notification settings
   * });
   * ```
   */
  updateMemberNotifications(memberKey: string, staffNotificationEmail: string): Observable<any> {
    const member = { staffNotificationEmail };
    return this.http.put<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/notifications`, member);
  }

  /**
   * Retrieves the license information for a given member key.
   *
   * @param memberKey The member key to retrieve the license for.
   * @returns An observable that emits the license URL as a string.
   * @example
   * ```typescript
   * this.memberService.getMemberLicense('member-123').subscribe(licenseUrl => {
   *   console.log(licenseUrl); // Output: https://example.com/license.pdf
   * });
   * ```
   */
  getMemberLicense(memberKey: string): Observable<string> {
    return of(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/license`);
  }

    /**
   * Updates the license for a given member key.
   *
   * @param memberKey The member key to update the license for.
   * @param formData The form data containing the new license information.
   * @returns An observable that emits the updated license information.
   * @example
   * ```typescript
   * const formData = new FormData();
   * formData.append('licenseFile', new File(['license.pdf'], 'license.pdf'));
   * this.memberService.updateLicense('member-123', formData).subscribe(response => {
   *   console.log(response); // Output: Updated license information
   * });
   * ```
   */
    updateLicense(memberKey: string, formData: FormData): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/license`, formData);
    }
  
    /**
     * Updates the member feed data for a given member key.
     *
     * @param memberKey The member key to update the feed data for.
     * @param memberOrgName The new organization name.
     * @param memberOrgURL The new organization URL.
     * @param contactEmail The new contact email address.
     * @returns An observable that emits the updated feed data.
     * @example
     * ```typescript
     * this.memberService.updateMemberFeedData('member-123', 'New Org Name', 'https://new-org.com', 'new-email@example.com').subscribe(response => {
     *   console.log(response); // Output: Updated feed data
     * });
     * ```
     */
    updateMemberFeedData(memberKey: string, memberOrgName: string, memberOrgURL: string, contactEmail: string): Observable<any> {
      const member = {
        memberOrgName,
        memberOrgURL,
        contactEmail
      };
      return this.http.put<any>(`${this.apiUrl}/members/${encodeURIComponent(memberKey)}/memberFeedUrl`, member);
    }
  }