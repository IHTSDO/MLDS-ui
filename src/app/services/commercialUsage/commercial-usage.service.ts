import { Injectable } from '@angular/core'
import moment from 'moment'

/**
 * A service that generates commercial usage ranges for a given number of periods in a year.
 */
@Injectable({
  providedIn: 'root'
})
export class CommercialUsageService {

  /**
   * Generates an array of commercial usage ranges for the specified number of periods in a year.
   * @param periods - The number of periods in a year.
   * @returns An array of objects, each containing a `startDate` and `endDate` for a commercial usage range.
   * @example
   * generateRanges(6) // Returns an array of 6 commercial usage ranges in a year
   */
  generateRanges(periods: number): Array<{ startDate: string, endDate: string }> {
    return this.annualPeriods(periods)
  }

  /**
   * Generates an array of commercial usage ranges for a year, split into the specified number of periods.
   * @private
   * @param periods - The number of periods in a year.
   * @returns An array of objects, each containing a `startDate` and `endDate` for a commercial usage range.
   */
  private annualPeriods(periods: number): Array<{ startDate: string, endDate: string }> {
    const ranges: Array<{ startDate: string, endDate: string }> = []
    let date = moment()

    for (let i = 0; i < periods; i++) {
      date = date.startOf('year')
      const end = date.clone().endOf('year')
      ranges.push(this.generateRangeEntry(date, end))

      date = date.clone().subtract(2, 'months')
    }

    return ranges
  }

  /**
   * Generates an object containing a `startDate` and `endDate` for a commercial usage range.
   * @private
   * @param start - The start date of the commercial usage range.
   * @param end - The end date of the commercial usage range.
   * @returns An object with `startDate` and `endDate` properties.
   */
  private generateRangeEntry(start: moment.Moment, end: moment.Moment): { startDate: string, endDate: string } {
    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD')
    }
  }
}