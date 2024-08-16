import { Pipe, PipeTransform } from '@angular/core';

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @example
 * {{ 3.14159 | numberRound }} // outputs "3.14"
 * {{ 3.14159 | numberRound: 3 }} // outputs "3.142"
 *
 * @param value The number to round.
 * @param decimals The number of decimal places to round to. Defaults to 2.
 * @returns A string representation of the rounded number.
 */
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