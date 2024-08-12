import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberRound',
  standalone: true
})
export class NumberRoundPipe implements PipeTransform {

  transform(value: number, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return '';
    }
    return value.toFixed(decimals);
  }
}
