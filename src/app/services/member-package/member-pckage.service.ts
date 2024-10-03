import { Injectable } from '@angular/core';
import lodash from 'lodash';
import { MemberService } from '../member/member.service';
import { UserAffiliateService } from '../user-affiliate/user-affiliate.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MemberPckageService {
 
  constructor(
    private userAffiliateService: UserAffiliateService,
    private memberService: MemberService,
    private translate: TranslateService
  ) {}

  // Order by IHTSDO member
  orderIhtsdo(memberReleases: any): boolean {
    return !(memberReleases.member && this.memberService.isIhtsdoMember(memberReleases.member));
  }

  // Order by approved memberships
  orderApprovedMemberships(memberReleases: any): boolean {
    return !(memberReleases.member && lodash.some(this.userAffiliateService.approvedMemberships, 
      lodash.partial(this.memberService.isMemberEqual, memberReleases.member)));
  }

  // Order by incomplete memberships
  orderIncompleteMemberships(memberReleases: any): boolean {
    return !(memberReleases.member && lodash.some(this.userAffiliateService.incompleteMemberships, 
      lodash.partial(this.memberService.isMemberEqual, memberReleases.member)));
  }

  // Order by member name (translated)
  orderMemberName(memberReleases: any): string {
    if (!memberReleases.member) {
        return 'NONE';
    }

    const memberKey = memberReleases.member.key;
    return memberKey ? this.translate.instant('global.member.' + memberKey) : 'NONE';
}


   // Comparator function to sort by IHTSDO and member name
   compareByIhtsdoAndName(a: any, b: any): number {
    // Compare by IHTSDO (true/false comparison)
    const ihtsdoComparison = Number(this.orderIhtsdo(a)) - Number(this.orderIhtsdo(b));
    if (ihtsdoComparison !== 0) {
      return ihtsdoComparison;
    }

    // Compare by member name (string comparison)
    const nameA = this.orderMemberName(a);
    const nameB = this.orderMemberName(b);
    return nameA.localeCompare(nameB);
  }

  // Use this comparator in the template for sorting
  get orderByJustName(): (a: any, b: any) => number {
    return this.compareByIhtsdoAndName.bind(this);
  }
}
