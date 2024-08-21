import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StandingStateUtilsService } from 'src/app/services/standing-state-utils/standing-state-utils.service';
import { EditAffiliateStandingModalComponent } from '../edit-affiliate-standing-modal/edit-affiliate-standing-modal.component';

@Component({
  selector: 'app-affiliate-details-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './affiliate-details-summary.component.html',
  styleUrl: './affiliate-details-summary.component.scss'
})
export class AffiliateDetailsSummaryComponent implements OnInit {


  @Input() affiliate: any;
  @Input() isEditable: boolean = false;

  constructor(public standingStateUtils: StandingStateUtilsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log("changestanding component")
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
}
