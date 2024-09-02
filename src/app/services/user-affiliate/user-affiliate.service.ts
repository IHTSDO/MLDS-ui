import { Injectable } from '@angular/core';
import { AffiliateService } from '../affiliate/affiliate.service';
import { ApplicationUtilsService } from '../application-utils/application-utils.service';
import { MemberService } from '../member/member.service';


@Injectable({
  providedIn: 'root'
})
export class UserAffiliateService {

  affiliate: any = null;
  approvedMemberships: any[] = [];
  incompleteMemberships: any[] = [];

  constructor(
    private affiliateService: AffiliateService,
    private applicationUtilsService: ApplicationUtilsService,
    private memberService: MemberService
  ) {
    this.loadUserAffiliate();
  }

  loadUserAffiliate() {
      this.affiliateService.myAffiliate().subscribe(resp => {
        this.setAffiliate(resp[0]);
      });
  }

  private initializeMemberships() {
    let primaryApplicationMembers: any[] = [];

    this.approvedMemberships = this.affiliate.applications
    .filter((app: any) => {
      return this.applicationUtilsService.isExtensionApplication(app);
    })
    .filter((app: any) => {
      return this.applicationUtilsService.isApplicationApproved(app);
    })
    .map((app: any) => {
      return app.member;
    });



  this.incompleteMemberships = this.affiliate.applications
  .filter((app: any) => {
    return this.applicationUtilsService.isExtensionApplication(app);
  })
  .filter((app: any) => {
    return this.applicationUtilsService.isApplicationIncomplete(app);
  })
  .map((app: any) => {
    return app.member;
  });




    if (this.affiliate.application) {
      primaryApplicationMembers = [this.memberService.ihtsdoMember];
      if (this.affiliate.application.member &&
          !this.memberService.isMemberEquals(this.affiliate.application.member, this.memberService.ihtsdoMember)) {
        primaryApplicationMembers.push(this.affiliate.application.member);
      }
      if (this.applicationUtilsService.isApplicationApproved(this.affiliate.application)) {
        this.approvedMemberships = [...this.approvedMemberships, ...primaryApplicationMembers];
      } else if (this.applicationUtilsService.isApplicationIncomplete(this.affiliate.application)) {
        this.incompleteMemberships = [...this.incompleteMemberships, ...primaryApplicationMembers];
      }
    }
  }

  private setAffiliate(affiliate: any) {
    this.affiliate = affiliate;
    if (affiliate && affiliate.applications) {
      this.initializeMemberships();
    }
  }



  isMembershipApproved(member: any): boolean {
    return this.isMemberOf(member, this.approvedMemberships);
  }

  isMembershipIncomplete(member: any): boolean {
    return this.isMemberOf(member, this.incompleteMemberships);
  }

  isMembershipNotStarted(member: any): boolean {
    return !this.isMembershipApproved(member) && !this.isMembershipIncomplete(member);
  }

  private isMemberOf(member: any, memberships: any[]): boolean {
    return memberships.some(m => this.memberService.isMemberEquals(member, m));
  }

  refreshAffiliate() {
    this.affiliateService.myAffiliate().subscribe(resp => {
      this.setAffiliate(resp.data);
    });
}

}