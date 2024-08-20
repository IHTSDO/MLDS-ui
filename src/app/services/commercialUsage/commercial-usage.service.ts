import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'
import moment from 'moment'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * A service that generates commercial usage ranges for a given number of periods in a year.
 */
@Injectable({
  providedIn: 'root'
})
export class CommercialUsageService {
   /**
   * Base URL for API requests.
   */
   private apiUrl = environment.apiUrl;
   constructor(private http: HttpClient) {}

   
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

  getUsageReport(reportId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/commercialUsages/${reportId}`);
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
}