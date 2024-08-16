import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuditsService } from 'src/app/services/audits/audits.service';
import { ActivatedRoute } from '@angular/router';
import { AuditsEmbedComponent } from '../audits-embed/audits-embed.component';

/**
 * Application Summary Block Component
 * 
 * This component displays a summary of an application, including its audits.
 * 
 * @example
 * <app-application-summary-block [application]="application" [commercialUsageInstitutionsByCountry]="commercialUsageInstitutionsByCountry" [usageCountryCountslist]="usageCountryCountslist" [showAuditPanel]="true"></app-application-summary-block>
 */
@Component({
  selector: 'app-application-summary-block',
  standalone: true,
  imports: [CommonModule, AuditsEmbedComponent],
  templateUrl: './application-summary-block.component.html',
  styleUrl: './application-summary-block.component.scss'
})
export class ApplicationSummaryBlockComponent implements OnInit {

  /**
   * The application to display a summary for.
   */
  @Input() application: any;

  /**
   * A dictionary of commercial usage institutions by country.
   */
  @Input() commercialUsageInstitutionsByCountry: { [key: string]: any[] } = {};

  /**
   * A list of usage country counts.
   */
  @Input() usageCountryCountslist: any[] = [];

  /**
   * Whether to show the audit panel.
   */
  @Input() showAuditPanel: boolean = true;

  /**
   * The audits for the application.
   */
  audits: any[] = [];

  /**
   * An error message to display if there is an error retrieving application data.
   */
  errorMessage: string | null = null;

  /**
   * Constructor.
   * 
   * @param auditsService The audits service.
   * @param route The activated route.
   */
  constructor(private auditsService: AuditsService, private route: ActivatedRoute) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.loadApplication();
  }

  /**
   * Loads the application data.
   */
  private loadApplication(): void {
    this.route.paramMap.subscribe(params => {
      const applicationId = params.get('applicationId');
      if (applicationId) {
        this.loadApplicationAudits(applicationId);
      }
    });
  }

  /**
   * Loads the audits for the application.
   * 
   * @param applicationId The ID of the application.
   */
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