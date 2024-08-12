import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  getHealthCheck(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/health`);
  }

  getMetrics(): Observable<any> {
     return this.http.get(`${this.apiBaseUrl}/metrics/metrics`);
  }
}
