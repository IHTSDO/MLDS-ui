import { Injectable } from '@angular/core';
import { ApprovalStateUtilsService } from '../approval-state-utils/approval-state-utils.service';

/**
 * Utility service for application-related functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationUtilsService {
  /**
   * List of organization types.
   */
  private organizationTypes: string[] = [
    'PUBLIC_HEALTH_ORGANIZATION',
    'PRIVATE_HEALTH_ORGANIZATION',
    'RESEARCH_AND_DEVELOPMENT_ORGANIZATION',
    'HEALTHCARE_APPLICATION_DEVELOPER',
    'GENERAL_PRACTITIONER_PRACTICE',
    'EDUCATIONAL_INSTITUTE',
    'OTHER'
  ];

  constructor(private approvalStateUtils: ApprovalStateUtilsService) {}

  /**
   * Checks if an application is waiting for applicant.
   *
   * @param application - The application object.
   * @returns {boolean} True if the application is waiting for applicant, false otherwise.
   *
   * @example
   * const application = { approvalState: 'WAITING_FOR_APPLICANT' };
   * const isWaiting = applicationUtils.isApplicationWaitingForApplicant(application); // true
   */
  isApplicationWaitingForApplicant(application: any): boolean {
    return this.approvalStateUtils.isWaitingForApplicant(application.approvalState);
  }

  /**
   * Checks if an application is approved.
   *
   * @param application - The application object.
   * @returns {boolean} True if the application is approved, false otherwise.
   *
   * @example
   * const application = { approvalState: 'APPROVED' };
   * const isApproved = applicationUtils.isApplicationApproved(application); // true
   */
  isApplicationApproved(application: any): boolean {
    return this.approvalStateUtils.isApproved(application.approvalState);
  }

  /**
   * Checks if an application is rejected.
   *
   * @param application - The application object.
   * @returns {boolean} True if the application is rejected, false otherwise.
   *
   * @example
   * const application = { approvalState: 'REJECTED' };
   * const isRejected = applicationUtils.isApplicationRejected(application); // true
   */
  isApplicationRejected(application: any): boolean {
    return this.approvalStateUtils.isRejected(application.approvalState);
  }

  /**
   * Checks if an application is incomplete.
   *
   * @param application - The application object.
   * @returns {boolean} True if the application is incomplete, false otherwise.
   *
   * @example
   * const application = { approvalState: 'INCOMPLETE' };
   * const isIncomplete = applicationUtils.isApplicationIncomplete(application); // true
   */
  isApplicationIncomplete(application: any): boolean {
    return this.approvalStateUtils.isIncomplete(application.approvalState);
  }

  /**
   * Checks if an application is pending.
   *
   * @param application - The application object.
   * @returns {boolean} True if the application is pending, false otherwise.
   *
   * @example
   * const application = { approvalState: 'PENDING' };
   * const isPending = applicationUtils.isApplicationPending(application); // true
   */
  isApplicationPending(application: any): boolean {
    return this.approvalStateUtils.isPending(application.approvalState);
  }

  /**
   * Returns the list of organization types.
   *
   * @returns {string[]} List of organization types.
   */
  getOrganizationTypes(): string[] {
    return this.organizationTypes;
  }

  /**
   * Checks if an application is a primary application.
   *
   * @param application - The application object.
   * @returns {boolean} True if the application is primary, false otherwise.
   *
   * @example
   * const application = { applicationType: 'PRIMARY' };
   * const isPrimary = applicationUtils.isPrimaryApplication(application); // true
   */
  isPrimaryApplication(application: any): boolean {
    return (application.applicationType === 'PRIMARY');
  }

  /**
   * Checks if an application is an extension application.
   *
   * @param application - The application object.
   * @returns {boolean} True if the application is an extension, false otherwise.
   *
   * @example
   * const application = { applicationType: 'EXTENSION' };
   * const isExtension = applicationUtils.isExtensionApplication(application); // true
   */
  isExtensionApplication(application: any): boolean {
    return (application.applicationType === 'EXTENSION');
  }
}