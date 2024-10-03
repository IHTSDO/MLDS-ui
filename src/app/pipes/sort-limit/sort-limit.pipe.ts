import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortLimit',
  standalone: true
})
export class SortLimitPipe implements PipeTransform {

  transform(value: any[], sortFn: (a: any, b: any) => number, limit: number): any[] {

    if (!value || !sortFn) {
      return value;
    }
 
    const sorted = [...value].sort(sortFn); 
    return sorted.slice(0, limit);
  }
  
}