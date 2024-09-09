import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { AuthenticationSharedService } from '../authentication/authentication-shared.service';
import { ApplicationUtilsService } from '../application-utils/application-utils.service'
import { API_ROUTES } from 'src/app/routes-config-api';

/**
 * Affiliate service provides methods for interacting with the affiliate API.
 */
@Injectable({
  providedIn: 'root'
})
export class AffiliateService {
  private apiUrl = API_ROUTES.apiUrl;

  constructor(
    private http: HttpClient,
    private sessionService: AuthenticationSharedService,
    private applicationUtilsService: ApplicationUtilsService,
  ) { }

  /**
   * Retrieves a list of all affiliates.
   *
   * @param q - Search query
   * @returns Observable<any> - List of affiliates
   * @example
   * affiliateService.allAffiliates('searchQuery').subscribe(affiliates => console.log(affiliates));
   */
  allAffiliates(q: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/affiliates?q=${encodeURIComponent(q)}`);
  }

  /**
   * Filters affiliates based on various criteria.
   *
   * @param q - Search query
   * @param page - Page number
   * @param pageSize - Page size
   * @param member - Member filter
   * @param standingState - Standing state filter
   * @param standingStateNot - Whether to negate the standing state filter
   * @param orderBy - Order by field
   * @param reverseSort - Whether to reverse the sort order
   * @returns Observable<any> - Filtered list of affiliates
   * @example
   * affiliateService.filterAffiliates('searchQuery', 1, 10, 'member', 'ACTIVE', false, 'name', true).subscribe(affiliates => console.log(affiliates));
   */
  filterAffiliates(q: string, page: number, pageSize: number, member: any, standingState: string, standingStateNot: boolean, orderBy: string, reverseSort: boolean): Observable<any> {
    let url = `${this.apiUrl}/affiliates?q=${encodeURIComponent(q)}&$page=${encodeURIComponent(page)}&$pageSize=${encodeURIComponent(pageSize)}`;
    if (member) {
      url += `&$filter=${encodeURIComponent(`homeMember eq '${member}'`)}`;
    }
    if (orderBy) {
      url += `&$orderby=${encodeURIComponent(orderBy)}${reverseSort ? ' desc' : ''}`;
    }
    if (standingState) {
      url += `&$filter=${encodeURIComponent(`${standingStateNot ? 'not ' : ''}standingState eq '${standingState}'`)}`;
    }
    return this.http.get(url);
  }

  /**
   * Retrieves the current user's affiliate.
   *
   * @returns Observable<any> - Current user's affiliate
   * @example
   * affiliateService.myAffiliate().subscribe(affiliate => console.log(affiliate));
   */
  myAffiliate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/affiliates/me`, { withCredentials: true }).pipe(
      map((result: any) => {
        const affiliates = result.data;
        if (affiliates && affiliates.length > 0) {
          const affiliate = affiliates[0];
          return { ...result, data: affiliate };
        } else {
          return { ...result, data: null };
        }
      })
    );
  }

  /**
   * Updates an affiliate.
   *
   * @param affiliate - Affiliate to update
   * @returns Observable<any> - Updated affiliate
   * @example
   * affiliateService.updateAffiliate({ id: 1, name: 'New Name' }).subscribe(affiliate => console.log(affiliate));
   */
  updateAffiliate(affiliate: any): Observable<any> {
    const affiliateCopy = { ...affiliate, commercialUsages: [], applications: [] };
    if (affiliateCopy.application) {
      affiliateCopy.application.commercialUsage = null;
    }
    return this.http.put(`${this.apiUrl}/affiliates/${encodeURIComponent(affiliate.affiliateId)}`, affiliateCopy);
  }

  /**
   * Deletes an affiliate.
   *
   * @param affiliate - Affiliate to delete
   * @returns Observable<any> - Deleted affiliate
   * @example
   * affiliateService.deleteAffiliate({ id: 1 }).subscribe(() => console.log('Affiliate deleted'));
   */
  deleteAffiliate(affiliate: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/affiliates/${encodeURIComponent(affiliate.affiliateId)}`);
  }

 /**
   * Creates a new login for an affiliate.
   *
   * @param affiliate - Affiliate to create login for
   * @returns Observable<any> - Created login
   * @example
   * affiliateService.createLogin({ id: 1, name: 'New Affiliate' }).subscribe(login => console.log(login));
   */
 createLogin(affiliate: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/account/create`, affiliate);
}

/**
 * Updates the details of an affiliate.
 *
 * @param affiliateId - ID of the affiliate to update
 * @param affiliateDetails - New details for the affiliate
 * @returns Observable<any> - Updated affiliate details
 * @example
 * affiliateService.updateAffiliateDetails('affiliateId', { firstName: 'New First Name', lastName: 'New Last Name' }).subscribe(details => console.log(details));
 */
updateAffiliateDetails(affiliateId: string, affiliateDetails: any): Observable<any> {
  const url = `${this.apiUrl}/affiliates/${encodeURIComponent(affiliateId)}/detail`;

  return this.http.put<any>(url, affiliateDetails).pipe(
    tap(result => {
      if (result.email === this.sessionService.login) {
        this.sessionService.updateUserName(result.firstName, result.lastName);
      }
    }),
    // catch(this.handleError<any>('updateAffiliateDetails', {}))
  );
}



/**
 * Retrieves the current user's affiliates.
 *
 * @returns Observable<any> - Current user's affiliates
 * @example
 * affiliateService.myAffiliates().subscribe(affiliates => console.log(affiliates));
 */
myAffiliates(): Observable<any> {
  return this.http.get(`${this.apiUrl}/affiliates/me`);
}

/**
 * Retrieves an affiliate by ID.
 *
 * @param affiliateId - ID of the affiliate to retrieve
 * @returns Observable<any> - Retrieved affiliate
 * @example
 * affiliateService.affiliate('affiliateId').subscribe(affiliate => console.log(affiliate));
 */
affiliate(affiliateId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/affiliates/${encodeURIComponent(affiliateId)}`);
}

/**
 * Retrieves affiliates by creator username.
 *
 * @param username - Username of the creator
 * @returns Observable<any> - Retrieved affiliates
 * @example
 * affiliateService.affiliates('creatorUsername').subscribe(affiliates => console.log(affiliates));
 */
affiliates(username: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/affiliates/creator/${encodeURIComponent(username)}`);
}

/**
 * Checks if an affiliate is commercial.
 *
 * @param affiliate - Affiliate to check
 * @returns boolean - Whether the affiliate is commercial
 * @example
 * const isCommercial = affiliateService.affiliateIsCommercial({ type: 'COMMERCIAL' });
 */
affiliateIsCommercial(affiliate: any): boolean {
  return affiliate.type === 'COMMERCIAL';
}

/**
 * Checks if an application is approved.
 *
 * @param affiliate - Affiliate with the application to check
 * @returns boolean - Whether the application is approved
 * @example
 * const isApproved = affiliateService.isApplicationApproved({ application: { status: 'APPROVED' } });
 */
isApplicationApproved(affiliate: any): boolean {
  return affiliate && this.applicationUtilsService.isApplicationApproved(affiliate.application);
}
}