import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
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

  // below methods are added for ngbootstrap datepicker component to handle the input and output conversions.

  isValidDate(date: NgbDate): boolean {
    return (
      date &&
      typeof date.year === 'number' &&
      typeof date.month === 'number' &&
      typeof date.day === 'number' &&
      date.year > 0 &&
      date.month >= 1 && date.month <= 12 &&
      date.day >= 1 && date.day <= 31
    );
  }

  convertToNgbDateStruct(dateStr: string): NgbDate {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new NgbDate(year, month, day);
  }

  convertNgbDateToString(date: NgbDate): string {
    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
  }

}
