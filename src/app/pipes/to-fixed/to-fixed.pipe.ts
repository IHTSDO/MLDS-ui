import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed',
  standalone: true
})
export class ToFixedPipe implements PipeTransform {
  transform(value: number): number {
    if (isNaN(value)) {
      return 0;
    }
    return Math.round(value);
  }

}
