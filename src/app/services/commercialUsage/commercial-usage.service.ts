import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommercialUsageService {

  constructor() { }

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
}


