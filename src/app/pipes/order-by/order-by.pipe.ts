import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], primaryKey: string, secondaryKey: string): any[] {
    if (!array || array.length === 0) return array;

    return array.sort((a, b) => {
     
      const dateA = new Date(a[primaryKey]).getTime();
      const dateB = new Date(b[primaryKey]).getTime();
      
      if (dateA !== dateB) {
        return dateB - dateA; 
      } else {
        const createdA = new Date(a[secondaryKey]).getTime();
        const createdB = new Date(b[secondaryKey]).getTime();
        return createdB - createdA; 
      }
    });
  }
}
