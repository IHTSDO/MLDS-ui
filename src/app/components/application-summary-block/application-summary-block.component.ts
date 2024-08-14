import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuditsService } from 'src/app/services/audits/audits.service';
import { ActivatedRoute } from '@angular/router';
import { AuditsEmbedComponent } from '../audits-embed/audits-embed.component';

@Component({
  selector: 'app-application-summary-block',
  standalone: true,
  imports: [CommonModule, AuditsEmbedComponent],
  templateUrl: './application-summary-block.component.html',
  styleUrl: './application-summary-block.component.scss'
})
export class ApplicationSummaryBlockComponent implements OnInit{

  @Input() application: any;
  @Input() commercialUsageInstitutionsByCountry: { [key: string]: any[] } = {};
  @Input() usageCountryCountslist: any[] = [];
  @Input() showAuditPanel: boolean = true;
  audits: any[] = [];
  errorMessage: string | null = null;

  constructor(private auditsService: AuditsService, private route: ActivatedRoute)
  {}

  ngOnInit(): void {
    this.loadApplication();
  }

  private loadApplication(): void {
    this.route.paramMap.subscribe(params => {
      const applicationId = params.get('applicationId');
      if (applicationId) {
        this.loadApplicationAudits(applicationId);
      }
    });
  }

  // get audit data
  private loadApplicationAudits(applicationId: any): void {
    this.auditsService.findByApplicationId(applicationId).subscribe(
      result => {
        this.audits = result;
      },
      error => {
        this.errorMessage = 'Error retrieving application data';
        console.error(error);
      }
    );
  }
}
