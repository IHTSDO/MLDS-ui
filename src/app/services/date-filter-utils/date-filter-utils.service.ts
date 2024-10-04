import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateFilterUtilsService {


  toDateFilter(m: moment.Moment): string {
    return m.format('YYYY-MM-DD');
  }


  today(): { fromDate: string; toDate: string } {
    const fromDate = this.toDateFilter(moment());
    const toDate = this.toDateFilter(moment().add(1, 'days'));
    return { fromDate, toDate };
  }


  previousWeek(): { fromDate: string; toDate: string } {
    const fromDate = this.toDateFilter(moment().subtract(1, 'weeks'));
    const toDate = this.toDateFilter(moment().add(1, 'days'));
    return { fromDate, toDate };
  }


  previousMonth(): { fromDate: string; toDate: string } {
    const fromDate = this.toDateFilter(moment().subtract(1, 'months'));
    const toDate = this.toDateFilter(moment().add(1, 'days'));
    return { fromDate, toDate };
  }
}
