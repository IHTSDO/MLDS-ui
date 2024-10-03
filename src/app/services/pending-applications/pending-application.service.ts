import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

/**
 * Service for handling pending applications.
 */
@Injectable({
  providedIn: 'root'
})
export class PendingApplicationsService {

  /**
   * Base URL for API requests.
   */
  private apiUrl = API_ROUTES.apiUrl;

  /**
   * Creates an instance of PendingApplicationsService.
   * @param http HttpClient instance.
   */
  constructor(private http: HttpClient) {}

  /**
   * Filters pending applications based on the provided criteria.
   * 
   * @param q Search query.
   * @param page Page number (starts from 1).
   * @param pageSize Number of items per page.
   * @param member Optional filter by home member.
   * @param orderBy Optional field to order by.
   * @param reverseSort Whether to sort in descending order.
   * @returns Observable with the filtered pending applications.
   * 
   * @example
   * this.pendingApplicationsService.filterPendingApplications(
   *   'search query', 
   *   1, 
   *   10, 
   *   'member1', 
   *   'createdDate', 
   *   true
   * ).subscribe(response => console.log(response));
   */
  filterPendingApplications(
    q: string,
    page: number,
    pageSize: number,
    member: string | null,
    orderBy: string | null,
    reverseSort: boolean
  ): Observable<any> {
    let url = `${this.apiUrl}/applications?$filter=approvalState/pending eq true&$page=${encodeURIComponent(
      page
    )}&$pageSize=${encodeURIComponent(pageSize)}`;
    if (member) {
      const filter = `homeMember eq '${member}'`;
      url += `&$filter=${encodeURIComponent(filter)}`;
    }
    if (orderBy) {
      url += `&$orderby=${encodeURIComponent(orderBy)}${reverseSort ? ' desc' : ''}`;
    }
    return this.http.get(url);
  }
}