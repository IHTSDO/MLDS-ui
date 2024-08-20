import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsageReportStateUtilsService {
 // Usage states
 private static readonly NOT_SUBMITTED = 'NOT_SUBMITTED';
 private static readonly CHANGE_REQUESTED = 'CHANGE_REQUESTED';
 private static readonly SUBMITTED = 'SUBMITTED';
 private static readonly RESUBMITTED = 'RESUBMITTED';
 private static readonly PENDING_INVOICE = 'PENDING_INVOICE';
 private static readonly INVOICE_SENT = 'INVOICE_SENT';
 private static readonly REJECTED = 'REJECTED';

 constructor() {}

 isWaitingForApplicant(usageState: string | null): boolean {
   return !usageState || 
     usageState === UsageReportStateUtilsService.NOT_SUBMITTED || 
     usageState === UsageReportStateUtilsService.CHANGE_REQUESTED;
 }

 isInvoiceSent(usageState: string): boolean {
   return usageState === UsageReportStateUtilsService.INVOICE_SENT;
 }

 isPendingInvoice(usageState: string): boolean {
   return usageState === UsageReportStateUtilsService.PENDING_INVOICE;
 }

 isRejected(usageState: string): boolean {
   return usageState === UsageReportStateUtilsService.REJECTED;
 }

 isSubmitted(usageState: string): boolean {
   return usageState === UsageReportStateUtilsService.SUBMITTED || 
     usageState === UsageReportStateUtilsService.RESUBMITTED;
 }
}