import { Injectable } from '@angular/core';

/**
 * Utility service for working with standing states.
 */
@Injectable({
  providedIn: 'root'
})
export class StandingStateUtilsService {

  /**
   * Constructor.
   */
  constructor() { }

  /**
   * Returns an array of all possible standing state options.
   *
   * @returns {string[]} An array of standing state options.
   * @example
   * const options = standingStateUtils.options();
   * console.log(options); // Output: ['APPLYING', 'REJECTED', ...]
   */
  options(): string[] {
    return ['APPLYING', 'REJECTED', 'IN_GOOD_STANDING', 'DEACTIVATED', 'DEACTIVATION_PENDING', 'PENDING_INVOICE', 'DEREGISTERED'];
  }

  /**
   * Checks if the standing state is 'APPLYING'.
   *
   * @param {string} standingState The standing state to check.
   * @returns {boolean} True if the standing state is 'APPLYING', false otherwise.
   * @example
   * const isApplying = standingStateUtils.isApplying('APPLYING');
   * console.log(isApplying); // Output: true
   */
  isApplying(standingState: string): boolean {
    return (standingState === 'APPLYING');
  }

  /**
   * Checks if the standing state is 'REJECTED'.
   *
   * @param {string} standingState The standing state to check.
   * @returns {boolean} True if the standing state is 'REJECTED', false otherwise.
   * @example
   * const isRejected = standingStateUtils.isRejected('REJECTED');
   * console.log(isRejected); // Output: true
   */
  isRejected(standingState: string): boolean {
    return (standingState === 'REJECTED');
  }

  /**
   * Checks if the standing state was approved (i.e. not 'APPLYING' or 'REJECTED').
   *
   * @param {string} standingState The standing state to check.
   * @returns {boolean} True if the standing state was approved, false otherwise.
   * @example
   * const wasApproved = standingStateUtils.wasApproved('IN_GOOD_STANDING');
   * console.log(wasApproved); // Output: true
   */
  wasApproved(standingState: string): boolean {
    return (standingState !== 'APPLYING' && standingState !== 'REJECTED');
  }

  /**
   * Checks if the standing state is 'DEACTIVATED'.
   *
   * @param {string} standingState The standing state to check.
   * @returns {boolean} True if the standing state is 'DEACTIVATED', false otherwise.
   * @example
   * const isDeactivated = standingStateUtils.isDeactivated('DEACTIVATED');
   * console.log(isDeactivated); // Output: true
   */
  isDeactivated(standingState: string): boolean {
    return (standingState === 'DEACTIVATED');
  }

  /**
   * Checks if the standing state is 'DEACTIVATION_PENDING'.
   *
   * @param {string} standingState The standing state to check.
   * @returns {boolean} True if the standing state is 'DEACTIVATION_PENDING', false otherwise.
   * @example
   * const isDeactivationPending = standingStateUtils.isDeactivationPending('DEACTIVATION_PENDING');
   * console.log(isDeactivationPending); // Output: true
   */
  isDeactivationPending(standingState: string): boolean {
    return (standingState === 'DEACTIVATION_PENDING');
  }

  /**
   * Checks if the standing state is 'PENDING_INVOICE' or 'INVOICE_SENT'.
   *
   * @param {string} standingState The standing state to check.
   * @returns {boolean} True if the standing state is 'PENDING_INVOICE' or 'INVOICE_SENT', false otherwise.
   * @example
   * const isPendingInvoice = standingStateUtils.isPendingInvoice('PENDING_INVOICE');
   * console.log(isPendingInvoice); // Output: true
   */
  isPendingInvoice(standingState: string): boolean {
    return (standingState === 'PENDING_INVOICE' || standingState === 'INVOICE_SENT');
  }

  /**
   * Checks if the standing state is 'INVOICE_SENT'.
   *
   * @param {string} standingState The standing state to check.
   * @returns {boolean} True if the standing state is 'INVOICE_SENT', false otherwise.
   * @example
   * const isInvoiceSent = standingStateUtils.isInvoiceSent('INVOICE_SENT');
   * console.log(isInvoiceSent); // Output: true
   */
  isInvoiceSent(standingState: string): boolean {
    return (standingState === 'INVOICE_SENT');
  }
/**
 * Checks if the standing state is in the success category.
 *
 * @param {string} standingState The standing state to check.
 * @returns {boolean} True if the standing state is in the success category, false otherwise.
 * @example
 * const isSuccess = standingStateUtils.isSuccessCategory('IN_GOOD_STANDING');
 * console.log(isSuccess); // Output: true
 */
isSuccessCategory(standingState: string): boolean {
  return (standingState === 'IN_GOOD_STANDING');
}

/**
 * Checks if the standing state is in the warning category.
 *
 * @param {string} standingState The standing state to check.
 * @returns {boolean} True if the standing state is in the warning category, false otherwise.
 * @example
 * const isWarning = standingStateUtils.isWarningCategory('APPLYING');
 * console.log(isWarning); // Output: true
 */
isWarningCategory(standingState: string): boolean {
  return (standingState === 'APPLYING'
    || standingState === 'PENDING_INVOICE'
    || standingState === 'INVOICE_SENT'
    || standingState === 'DEACTIVATION_PENDING');
}

/**
 * Checks if the standing state is in the danger category.
 *
 * @param {string} standingState The standing state to check.
 * @returns {boolean} True if the standing state is in the danger category, false otherwise.
 * @example
 * const isDanger = standingStateUtils.isDangerCategory('REJECTED');
 * console.log(isDanger); // Output: true
 */
isDangerCategory(standingState: string): boolean {
  return (standingState === 'REJECTED'
    || standingState === 'DEACTIVATED'
    || standingState === 'DEREGISTERED');
}
}