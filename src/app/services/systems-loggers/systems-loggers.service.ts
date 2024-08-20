import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

@Injectable({
  providedIn: 'root'
})
export class SystemsLoggersService {
  private apiUrl = API_ROUTES.apiUrl;
  constructor(private http: HttpClient) { }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logs`);
  }

  changeLevel(name: string, level: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/logs`, { name, level });
  }
}
