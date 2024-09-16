import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { EditAffiliateStandingModalComponent } from '../../admin/edit-affiliate-standing-modal/edit-affiliate-standing-modal.component';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from 'src/app/routes-config';


@Component({
  selector: 'app-affiliate-details-summary',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './affiliate-details-summary.component.html',
  styleUrl: './affiliate-details-summary.component.scss'
})
export class AffiliateDetailsSummaryComponent implements OnInit,OnChanges {

  @Input() showEdit: boolean = true;
  @Input() affiliate: any;
  @Input() isEditable: boolean = false;
  affiliateId :any;
  routes = ROUTES;
  constructor(public standingStateUtils: StandingStateUtilsService, private modalService: NgbModal,private router: Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['affiliate']){
      
      this.affiliateId=this.affiliate.affiliateId;
    
    }
  }

  ngOnInit(): void {
  
    
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
}
