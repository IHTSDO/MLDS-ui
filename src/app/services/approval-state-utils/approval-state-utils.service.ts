import { Injectable } from '@angular/core';

/**
 * Utility service for working with approval states.
 */
@Injectable({
  providedIn: 'root'
})
export class ApprovalStateUtilsService {

  /**
   * Checks if the approval state is waiting for the applicant's action.
   *
   * @param approvalState The approval state to check.
   * @returns True if the approval state is waiting for the applicant, false otherwise.
   *
   * Example:
   * ```
   * const approvalState = null;
   * console.log(approvalStateUtils.isWaitingForApplicant(approvalState)); // true
   *
   * approvalState = { NotSubmitted: 'NotSubmitted' };
   * console.log(approvalStateUtils.isWaitingForApplicant(approvalState)); // true
   * ```
   */
  isWaitingForApplicant(approvalState: any): boolean {
    return (
      !approvalState ||
      approvalState === 'NOT_SUBMITTED'||
      approvalState === 'CHANGE_REQUESTED'
    );
  }

  /**
   * Checks if the approval state is approved.
   *
   * @param approvalState The approval state to check.
   * @returns True if the approval state is approved, false otherwise.
   *
   * Example:
   * ```
   * const approvalState = { Approved: 'Approved' };
   * console.log(approvalStateUtils.isApproved(approvalState)); // true
   * ```
   */
  isApproved(approvalState: any): boolean {
    return approvalState === 'APPROVED';
  }

  /**
   * Checks if the approval state is rejected.
   *
   * @param approvalState The approval state to check.
   * @returns True if the approval state is rejected, false otherwise.
   *
   * Example:
   * ```
   * const approvalState = { Rejected: 'Rejected' };
   * console.log(approvalStateUtils.isRejected(approvalState)); // true
   * ```
   */
  isRejected(approvalState: any): boolean {
    return approvalState === 'REJECTED';
  }

  /**
   * Checks if the approval state is incomplete.
   *
   * @param approvalState The approval state to check.
   * @returns True if the approval state is incomplete, false otherwise.
   *
   * Example:
   * ```
   * const approvalState = { NotSubmitted: 'NotSubmitted' };
   * console.log(approvalStateUtils.isIncomplete(approvalState)); // true
   * ```
   */
  isIncomplete(approvalState: any): boolean {
    return (
      approvalState !== 'APPROVED' &&
      approvalState !== 'REJECTED'
    );
  }

  /**
   * Checks if the approval state is pending.
   *
   * @param approvalState The approval state to check.
   * @returns True if the approval state is pending, false otherwise.
   *
   * Example:
   * ```
   * const approvalState = { Submitted: 'Submitted' };
   * console.log(approvalStateUtils.isPending(approvalState)); // true
   * ```
   */
  isPending(approvalState: any): boolean {
    return (
      approvalState === 'SUBMITTED' ||
      approvalState === 'RESUBMITTED' ||
      approvalState === 'REVIEW_REQUESTED'
    );
  }
}