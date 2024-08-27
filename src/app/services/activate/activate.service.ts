import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';
@Injectable({
  providedIn: 'root'
})
export class ActivateService {
  private apiUrl = API_ROUTES.apiUrl;
  constructor(private http: HttpClient) {}

  get(params: any): Observable<string> {
    const httpParams = new HttpParams({ fromObject: params });

    return this.http.get<string>(`${this.apiUrl}/activate`, {
      params: httpParams,
      responseType: 'text' as 'json' // Forces the response to be treated as text
    });
  }
}
