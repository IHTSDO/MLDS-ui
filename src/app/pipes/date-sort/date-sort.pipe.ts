import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSort',
  standalone: true
})
export class DateSortPipe implements PipeTransform {

  transform(value: any[], sortField: string, order: string = 'desc'): any[] {
    if (!value || !sortField) {
      return value;
    }

    return value.sort((a, b) => {
      const yearA = new Date(a[sortField]).getFullYear();
      const yearB = new Date(b[sortField]).getFullYear();
      return order === 'desc' ? yearB - yearA : yearA - yearB;
    });
  }
}
