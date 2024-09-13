import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'
import moment from 'moment'
import { Observable, Subject } from 'rxjs';
import { API_ROUTES } from 'src/app/routes-config-api';

/**
 * A service that generates commercial usage ranges for a given number of periods in a year.
 */
@Injectable({
  providedIn: 'root'
})
export class CommercialUsageService {
  sendUsageReportForApproval(commercialUsageReport: any) {
    throw new Error('Method not implemented.');
  }
   /**
   * Base URL for API requests.
   */
   private commercialUsageUpdated = new Subject<void>();
   private apiUrl = API_ROUTES.apiUrl;
   constructor(private http: HttpClient) {}

   broadcastCommercialUsageUpdate(): void {
    this.commercialUsageUpdated.next();
  }

  notifyUsageUpdatedIfRequired(httpPromise: Promise<any>, options?: { skipBroadcast?: boolean }): void {
    httpPromise.then(() => {
      if (!options || !options.skipBroadcast) {
        this.broadcastCommercialUsageUpdate();
      }
    }).catch((error) => {
      console.error('HTTP request failed:', error);
    });
  }

  getCommercialUsageUpdatedObservable() {
    return this.commercialUsageUpdated.asObservable();
  }
   generateRanges(): Array<{ startDate: string, endDate: string }> {
    const periods = 6;
    return this.annualPeriods(periods);
  }

  private annualPeriods(periods: number): Array<{ startDate: string, endDate: string }> {
    const ranges: Array<{ startDate: string, endDate: string }> = [];
    let date = moment();

    for (let i = 0; i < periods; i++) {
      date = date.startOf('year');
      const end = date.clone().endOf('year');
      ranges.push(this.generateRangeEntry(date, end));

      date = date.clone().subtract(2, 'months');
    }

    return ranges;
  }

  private generateRangeEntry(start: moment.Moment, end: moment.Moment): { startDate: string, endDate: string } {
    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD')
    };
  }

  getUsageReports(affiliateId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/affiliates/${affiliateId}/commercialUsages`);
  }

  getSubmittedUsageReports(page: number, pageSize: number, orderby: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString())
      .set('orderby', orderby)
      .set('$filter', 'approvalState/not submitted eq false');

    return this.http.get(`${this.apiUrl}/commercialUsages/`, { params });
  }

  createUsageReport(affiliateId: string, startDate: string, endDate: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/affiliates/${affiliateId}/commercialUsages`, {
      startDate: this.serializeDate(startDate),
      endDate: this.serializeDate(endDate)
    });
  }

  private serializeDate(date: string): string {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }

  getUsageReport(commercialUsageId: string): Observable<any> {
    console.log("commercial Usage Id" + commercialUsageId)
    return this.http.get(`${this.apiUrl}/commercialUsages/${commercialUsageId}`);
  }

  updateUsageReportContext(usageReport: any, options?: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/context`, usageReport.context);
  }

  updateUsageReportType(usageReport: any, options?: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/type/${encodeURIComponent(usageReport.type)}`,
      {},  // This is the body argument
      options  // This is optional, you can add it if you have any options to pass
    );
  }
  

  addUsageEntry(usageReport: any, entry: any, options?: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}`, this.serializeCommercialEntry(entry));
  }

  private serializeCommercialEntry(entry: any): any {
    const serializable = { ...entry };
    serializable.startDate = this.serializeDate(serializable.startDate);
    serializable.endDate = this.serializeDate(serializable.endDate);
    return serializable;
  }

  updateUsageEntry(usageReport: any, entry: any, options?: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/entries/${entry.commercialUsageEntryId}`, this.serializeCommercialEntry(entry));
  }

  deleteUsageEntry(usageReport: any, entry: any, options?: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/entries/${entry.commercialUsageEntryId}`);
  }

  addUsageCount(usageReport: any, count: any, options?: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/countries`, this.serializeCommercialCount(count));
  }

  private serializeCommercialCount(count: any): any {
    return count;
  }

  updateUsageCount(usageReport: any, count: any, options?: any): Observable<any> {
    console.log('API call - usageReport:', usageReport); // Check what is sent
    return this.http.put(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/countries/${count.commercialUsageCountId}`, this.serializeCommercialCount(count));
  }

  deleteUsageCount(usageReport: any, count: any, options?: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/countries/${count.commercialUsageCountId}`);
  }

  submitUsageReport(usageReport: any, options?: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/approval`, {
      transition: 'SUBMIT'
    });
  }

  retractUsageReport(usageReport: any, options?: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/approval`, {
      transition: 'RETRACT'
    });
  }

  updateUsageReport(usageReport: any, newState: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/commercialUsages/${usageReport.commercialUsageId}/approval`, {
      transition: newState
    });
  }
    /**
   * Retrieves review usage reports.
   *
   * Fetches a list of usage reports that are under review.
   *
   * @returns Observable of review usage reports.
   *
   * @example
   * this.usageReportsService.getReviewUsageReport()
   *   .subscribe(reports => console.log(reports));
   */
    getReviewUsageReport(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/reviewUsageReports`);
    }
}