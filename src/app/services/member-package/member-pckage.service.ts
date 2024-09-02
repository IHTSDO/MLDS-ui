import { Injectable } from '@angular/core';
import _ from 'lodash';
import { MemberService } from '../member/member.service';
import { UserAffiliateService } from '../user-affiliate/user-affiliate.service';

@Injectable({
  providedIn: 'root'
})
export class MemberPckageService {

  constructor(
    private userAffiliateService: UserAffiliateService,
    private memberService: MemberService,
    
  ) {}

  // Method to determine if the member is an IHTSDO member
  private orderIhtsdo(memberReleases: any): boolean {
    return memberReleases.member && this.memberService.isIhtsdoMember(memberReleases.member);
}

// Method to order by approved memberships
private orderApprovedMemberships(memberReleases: any): boolean {
  debugger;
  return !(
    memberReleases.member &&
    _.some(this.userAffiliateService.approvedMemberships, 
           _.partial(this.memberService.isMemberEqual, memberReleases.member))
  );
}

// Method to order by incomplete memberships
private orderIncompleteMemberships(memberReleases: any): boolean {
  debugger;
  return !(
    memberReleases.member &&
    _.some(this.userAffiliateService.incompleteMemberships, 
           _.partial(this.memberService.isMemberEqual, memberReleases.member))
  );
}

// Method to get member name (or key if name is not available)
private orderMemberName(memberReleases: any): string {
  return memberReleases.member?.name || memberReleases.member?.key || 'NONE';
}

// Public methods to get the ordering functions
public getOrderBy(): Array<(memberReleases: any) => boolean | string> {
  debugger;
  return [
    this.orderIhtsdo.bind(this),
    this.orderApprovedMemberships.bind(this),
    this.orderIncompleteMemberships.bind(this),
    this.orderMemberName.bind(this)
  ];
}

// Sorting function
get orderByJustName(): (a: any, b: any) => number {
  return (a: any, b: any) => {
     // Determine if each item is an IHTSDO member
     const isIhtsdoA = this.orderIhtsdo(a);
     const isIhtsdoB = this.orderIhtsdo(b);

     // Ensure IHTSDO members come first
     if (isIhtsdoA && !isIhtsdoB) return -1; // IHTSDO member comes before non-IHTSDO member
     if (!isIhtsdoA && isIhtsdoB) return 1; 
    // Both are IHTSDO or both are not IHTSDO, sort alphabetically
    const nameA = this.orderMemberName(a).toLowerCase();
    const nameB = this.orderMemberName(b).toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    return 0;
  };
}

}