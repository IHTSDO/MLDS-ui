import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AffiliateService } from '../affiliate/affiliate.service';
import { ApplicationUtilsService } from '../application-utils/application-utils.service';
import { MemberService } from '../member/member.service';

@Injectable({
  providedIn: 'root'
})
export class UserAffiliateService {
  private affiliateSubject = new BehaviorSubject<any | null>(null);
  private approvedMembershipsSubject = new BehaviorSubject<any[]>([]);
  private incompleteMembershipsSubject = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private affiliateService: AffiliateService,
    private applicationUtilsService: ApplicationUtilsService,
    private memberService: MemberService
  ) {
    this.loadUserAffiliate();

  ;
  }

  get affiliate$(): Observable<any | null> {
    return this.affiliateSubject.asObservable();
  }

  get approvedMemberships$(): Observable<any[]> {
    return this.approvedMembershipsSubject.asObservable();
  }

  get incompleteMemberships$(): Observable<any[]> {
    return this.incompleteMembershipsSubject.asObservable();
  }

  private loadUserAffiliate(): void {
    this.affiliateService.myAffiliate().pipe(
      tap(response => this.setAffiliate(response.data))
    ).subscribe();
  }

  private initializeMemberships(): void {
    const affiliate = this.affiliateSubject.getValue();
    if (!affiliate) return;

    // Including memberships from extension applications only as IHTSDO is always primary application
    const approvedMemberships = affiliate.applications
      .filter(this.applicationUtilsService.isExtensionApplication)
      .filter(this.applicationUtilsService.isApplicationApproved)
      .map((application: { member: any; }) => application.member);

    const incompleteMemberships = affiliate.applications
      .filter(this.applicationUtilsService.isExtensionApplication)
      .filter(this.applicationUtilsService.isApplicationIncomplete)
      .map((application: { member: any; }) => application.member);

    // Include IHTSDO international membership from primary application
    if (affiliate.application) {
      let primaryApplicationMembers = [this.memberService.ihtsdoMember];
      if (affiliate.application.member && !this.memberService.isMemberEquals(affiliate.application.member, this.memberService.ihtsdoMember)) {
        primaryApplicationMembers.push(affiliate.application.member);
      }
      if (this.applicationUtilsService.isApplicationApproved(affiliate.application)) {
        approvedMemberships.push(...primaryApplicationMembers);
      } else if (this.applicationUtilsService.isApplicationIncomplete(affiliate.application)) {
        incompleteMemberships.push(...primaryApplicationMembers);
      }
    }

    this.approvedMembershipsSubject.next(approvedMemberships);
    this.incompleteMembershipsSubject.next(incompleteMemberships);
  }

  private setAffiliate(affiliate: any): void {
    this.affiliateSubject.next(affiliate);
    if (affiliate && affiliate.applications) {
      this.initializeMemberships();
    }
  }

  private isMemberOf(member: any, memberships: any[]): boolean {
    return memberships.some(m => this.memberService.isMemberEqual(m, member));
  }

  isMembershipApproved(member: any): boolean {
    return this.isMemberOf(member, this.approvedMembershipsSubject.getValue());
  }

  isMembershipIncomplete(member: any): boolean {
    return this.isMemberOf(member, this.incompleteMembershipsSubject.getValue());
  }

  isMembershipNotStarted(member: any): boolean {
    return !this.isMembershipApproved(member) && !this.isMembershipIncomplete(member);
  }

  refreshAffiliate(): void {
    this.loadUserAffiliate();
  }
}