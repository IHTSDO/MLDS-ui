import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

/**
 * Audits embed component
 *
 * This component displays a list of audits and allows sorting by different columns.
 *
 * Example usage:
 * ```
 * <app-audits-embed [audits]="auditsList"></app-audits-embed>
 * ```
 */
@Component({
  selector: 'app-audits-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audits-embed.component.html',
  styleUrls: ['./audits-embed.component.scss']
})
export class AuditsEmbedComponent implements OnInit {
  /**
   * Input audits array
   *
   * An array of audit objects to be displayed.
   *
   * Example:
   * ```
   * [
   *   { id: 1, timestamp: '2022-01-01T12:00:00', message: 'Audit 1' },
   *   { id: 2, timestamp: '2022-01-02T13:00:00', message: 'Audit 2' },
   *   { id: 3, timestamp: '2022-01-03T14:00:00', message: 'Audit 3' }
   * ]
   * ```
   */
  @Input() audits: any[] = [];

  /**
   * Error message
   *
   * Displays an error message if there's an issue with the audits data.
   */
  errorMessage: string | null = null;

  /**
   * Current sort predicate
   *
   * The column by which the audits are currently sorted.
   */
  predicate: string = 'timestamp';

  /**
   * Reverse sort flag
   *
   * Whether the sort order is reversed (descending).
   */
  reverse: boolean = false;

  constructor() {}

  /**
   * Initializes the component
   *
   * Called when the component is initialized.
   */
  ngOnInit(): void {
    this.toggleSort('timestamp');
  }

  /**
   * Toggles the sort order for a given column
   *
   * @param column The column to sort by
   */
  toggleSort(column: string): void {
    if (this.predicate === column) {
      this.reverse = !this.reverse;
    } else {
      this.predicate = column;
      this.reverse = false;
    }
  }

  /**
   * Returns the sorted audits array
   *
   * Returns a new array with the audits sorted by the current predicate and reverse flag.
   */
  get sortedAudits() {
    return [...this.audits].sort((a, b) => {
      const aValue = new Date(a[this.predicate]).getTime();
      const bValue = new Date(b[this.predicate]).getTime();
      const comparison = aValue - bValue;
      return this.reverse ? -comparison : comparison;
    });
  }
}