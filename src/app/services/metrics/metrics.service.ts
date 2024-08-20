import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service for interacting with the metrics API.
 */
@Injectable({
  providedIn: 'root'
})
export class MetricsService {


  /**
   * Constructor.
   * @param http HTTP client instance.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves the health check status.
   * @returns Observable containing the health check response.
   * @example
   * this.metricsService.getHealthCheck().subscribe(response => {
   *   console.log(response);
   * });
   */
  getHealthCheck(): Observable<any> {
    return this.http.get('/health');
  }

  /**
   * Retrieves the metrics data.
   * @returns Observable containing the metrics response.
   * @example
   * this.metricsService.getMetrics().subscribe(response => {
   *   console.log(response);
   * });
   */
  getMetrics(): Observable<any> {
    return this.http.get('/metrics/metrics');
  }
}