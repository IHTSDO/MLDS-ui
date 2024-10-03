import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})
export class ImportAffiliatesService {

 
  private apiUrl = API_ROUTES.apiUrl;

  constructor(private http: HttpClient) {}

  importSpec(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/affiliates/csvSpec`);
  }
  importAffiliates( formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/affiliates/csv`, formData,{
      headers: {},
      observe: 'response'
    });
  }
  exportAffiliatesUrl = `${this.apiUrl}/affiliates/csv`;
}
