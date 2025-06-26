import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { EditAffiliateStandingModalComponent } from '../../admin/edit-affiliate-standing-modal/edit-affiliate-standing-modal.component';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/routes-config';
import { TranslateModule } from '@ngx-translate/core';
import { EditPeimaryEmailComponent } from '../edit-peimary-email/edit-peimary-email.component';


@Component({
    selector: 'app-affiliate-details-summary',
    imports: [CommonModule, TranslateModule],
    templateUrl: './affiliate-details-summary.component.html',
    styleUrl: './affiliate-details-summary.component.scss'
})
export class AffiliateDetailsSummaryComponent implements OnChanges {

  @Input() showEdit: boolean = true;
  @Input() affiliate: any;
  @Input() isEditable: boolean = false;
  @Input() editPrimaryEmail: boolean = true; 
  affiliateId :any;
  routes = ROUTES;
  constructor(public standingStateUtils: StandingStateUtilsService, private modalService: NgbModal,private router: Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['affiliate']){
      
      this.affiliateId=this.affiliate.affiliateId;
    
    }
  }


  changeStanding() {

    if (this.standingStateUtils.isApplying(this.affiliate.standingState)) {
      return;
    }

    const modalRef = this.modalService.open(EditAffiliateStandingModalComponent, { size: 'lg' });
    modalRef.componentInstance.affiliate = { ...this.affiliate };
    modalRef.result
      .then((result) => {
        this.affiliate = result;
      });
  }
  goToAffiliateSummary() {
    if (this.affiliateId) {
      this.router.navigate([this.routes.affiliateManagement, encodeURIComponent(this.affiliateId)]);
    } else {
      console.error('Affiliate ID is not available.');
    }
  }

  editAffiliate(affiliateId: string): void {
    this.router.navigate(['/affiliateManagement', affiliateId, 'edit']);
  }
  
  openEditEmailModal(currentEmail: string, affiliateDetailsId: number, affiliateId: number) {
  
    const modalRef = this.modalService.open(EditPeimaryEmailComponent, { centered: true });
    modalRef.componentInstance.currentEmail = currentEmail;
    modalRef.componentInstance.affiliateDetailsId = affiliateDetailsId; 
    modalRef.componentInstance.affiliateId = affiliateId;
    modalRef.result.then(
      (newEmail) => {
        if (newEmail) {
          this.affiliate.affiliateDetails.email = newEmail; // Update email in the parent component
          console.log('Updated Email:', newEmail);
        }
      },
      () => {}
    );
  }
  
}
