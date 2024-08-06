import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BolcklistDomainService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDomainBlacklist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/domain-blacklist`);
  }

  addDomain(domainName: string): Observable<any> {
    console.log('addDomain', domainName);
    return this.http.post<any>(`${this.apiUrl}/domain-blacklist/create`, null, { params: { domain: domainName } });
  }

  removeDomain(domainName: string): Observable<any> {
    console.log('removeDomain', domainName);
    return this.http.post<any>(`${this.apiUrl}/domain-blacklist/remove`, null, { params: { domain: domainName } });
  }
}