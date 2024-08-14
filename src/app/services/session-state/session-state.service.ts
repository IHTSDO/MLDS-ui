import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service to manage session state.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStateService {

  /**
   * Session state object.
   */
  sessionState: any = {};

  /**
   * Subject to notify when login is confirmed.
   */
  private loginConfirmedSubject = new Subject<void>();

  /**
   * Subject to notify when login is cancelled.
   */
  private loginCancelledSubject = new Subject<void>();

  /**
   * Constructor.
   */
  constructor() {
    this.resetSessionState();

    /**
     * Reset session state when login is confirmed or cancelled.
     */
    this.loginConfirmedSubject.subscribe(() => this.resetSessionState());
    this.loginCancelledSubject.subscribe(() => this.resetSessionState());
  }

  /**
   * Reset session state to its default values.
   */
  private resetSessionState(): void {
    this.sessionState = {
      affiliatesFilter: {
        standingStateFilter: 'APPLYING',
        standingStateNotApplying: true
      },
      releaseManagementFilter: {
        showAllMembers: ""
      },
      pendingApplicationsFilter: {
        showAllApplications: null,
        orderByField: null,
        reverseSort: null
      }
    };
  }

  /**
   * Notify when login is confirmed.
   *
   * Example:
   * ```
   * this.sessionStateService.onLoginConfirmed();
   * ```
   */
  onLoginConfirmed(): void {
    this.loginConfirmedSubject.next();
  }

  /**
   * Notify when login is cancelled.
   *
   * Example:
   * ```
   * this.sessionStateService.onLoginCancelled();
   * ```
   */
  onLoginCancelled(): void {
    this.loginCancelledSubject.next();
  }
}