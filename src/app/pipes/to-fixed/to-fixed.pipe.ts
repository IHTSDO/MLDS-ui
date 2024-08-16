import { Pipe, PipeTransform } from '@angular/core';

/**
 * Rounds a number to the nearest integer.
 *
 * @example
 * {{ 3.14 | toFixed }} // outputs 3
 * {{ -3.14 | toFixed }} // outputs -3
 * {{ 'not a number' | toFixed }} // outputs 0
 */
@Pipe({
  name: 'toFixed',
  standalone: true
})
export class ToFixedPipe implements PipeTransform {
  /**
   * Rounds the input number to the nearest integer.
   *
   * If the input is not a number, returns 0.
   *
   * @param value The number to round.
   * @returns The rounded number.
   */
  transform(value: number): number {
    if (isNaN(value)) {
      return 0;
    }
    return Math.round(value);
  }
}