import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemsLoggersService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logs`);
  }

  changeLevel(name: string, level: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/logs`, { name, level });
  }
}
