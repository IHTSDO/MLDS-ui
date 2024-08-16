import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Service for interacting with the domain blacklist API.
 */
@Injectable({
  providedIn: 'root'
})
export class BolcklistDomainService {
  private apiUrl = environment.apiUrl;

  /**
   * Creates an instance of BolcklistDomainService.
   * @param {HttpClient} http - The HTTP client for making API requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves the list of blacklisted domains.
   * @returns {Observable<any[]>} An observable that emits an array of blacklisted domains.
   * @example
   * this.bolcklistDomainService.getDomainBlacklist().subscribe(domains => console.log(domains));
   */
  getDomainBlacklist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domain-blacklist`);
  }

  /**
   * Adds a new domain to the blacklist.
   * @param {string} domainName - The domain name to add to the blacklist.
   * @returns {Observable<any>} An observable that emits a response indicating the success of the operation.
   * @example
   * this.bolcklistDomainService.addDomain('example.com').subscribe(response => console.log(response));
   */
  addDomain(domainName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/domain-blacklist/create`, null, { params: { domain: domainName } });
  }

  /**
   * Removes a domain from the blacklist.
   * @param {string} domainName - The domain name to remove from the blacklist.
   * @returns {Observable<any>} An observable that emits a response indicating the success of the operation.
   * @example
   * this.bolcklistDomainService.removeDomain('example.com').subscribe(response => console.log(response));
   */
  removeDomain(domainName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/domain-blacklist/remove`, null, { params: { domain: domainName } });
  }
}