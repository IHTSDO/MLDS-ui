import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { groupBy, sortBy } from 'lodash';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';

@Component({
  selector: 'app-affiliate-registration-review',
  standalone: true,
  imports: [CommonModule,TranslateModule,CompareTextPipe],
  templateUrl: './affiliate-registration-review.component.html',
  styleUrl: './affiliate-registration-review.component.scss'
})
export class AffiliateRegistrationReviewComponent implements OnInit {

  @Input() affiliateform: any;
  @Input() affiliate: any;
  @Input() billingHide: boolean = false;
  commercialUsageInstitutionsByCountry: { [key: string]: any[] } = {};
  usageCountryCountsPairs: any[] = [];
  context: any;

  constructor(private commercialUsageService: CommercialUsageService, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.loadUsageReport(this.affiliate?.commercialUsage?.commercialUsageId);
  }

  private loadUsageReport(reportId: string): void {

    this.commercialUsageService.getUsageReport(reportId).subscribe({
      next: (data) => this.processData(data),
      error: (error) => console.error('Error loading usage report:', error),
    });
  }

  private processData(data: any): void {

    this.context = data.context;

    this.commercialUsageInstitutionsByCountry = groupBy(data.entries, (entry: any) => entry.country.isoCode2);


    for (const [key, list] of Object.entries(this.commercialUsageInstitutionsByCountry)) {
      this.commercialUsageInstitutionsByCountry[key] = sortBy(list, (entry: any) => entry.name.toLowerCase());
    }


    const usageCountryCountslist = sortBy(data.countries, (count: any) => count.country.commonName.toLowerCase());


    this.usageCountryCountsPairs = [];
    let tempPair: any[] = [];
    for (const entry of usageCountryCountslist) {
      tempPair.push(entry);
      if (tempPair.length >= 2) {
        this.usageCountryCountsPairs.push(tempPair);
        tempPair = [];
      }
    }
    if (tempPair.length >= 1) {
      this.usageCountryCountsPairs.push(tempPair);
    }
  }

  submit(): void {
    this.activeModal.close(this.context);
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }


}
