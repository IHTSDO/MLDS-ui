import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityLogsService } from 'src/app/services/activity-logs/activity-logs.service';
import { ImportAffiliatesService } from 'src/app/services/import-affiliates/import-affiliates.service';
import { AuditsEmbedComponent } from "../../common/audits-embed/audits-embed.component";

@Component({
  selector: 'app-import-affiliates',
  standalone: true,
  imports: [CommonModule, FormsModule, AuditsEmbedComponent],
  templateUrl: './import-affiliates.component.html',
  styleUrl: './import-affiliates.component.scss'
})
export class ImportAffiliatesComponent implements OnInit {
  submitting = false;
  alerts: Array<{ type: string, msg: string }> = [];
  importResult: string | null = null;
  importSpec: any = {};
  affiliatesFile: File | null = null;
  audits: any[] = [];
  exportAffiliatesUrl: string;

  constructor(
    private importAffiliatesService: ImportAffiliatesService,
    private auditsService: ActivityLogsService
  ) {
    this.exportAffiliatesUrl = this.importAffiliatesService.exportAffiliatesUrl;
  }

  ngOnInit(): void {
    this.loadAudits();
    this.loadImportSpec();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.affiliatesFile = file;
    }
  }

  uploadFile(): void {
    this.alerts = [];
    this.importResult = null;
    if (this.affiliatesFile) {
      this.submitting = true;
      const formData = new FormData();
      formData.append('file', this.affiliatesFile, this.affiliatesFile.name);

      this.importAffiliatesService.importAffiliates(formData).subscribe({
        next: (result) => {
          this.importResult = JSON.stringify(result.body, undefined, 2);
          this.alerts.push({ type: 'success', msg: 'Import completed.' });
          this.submitting = false;
          this.loadAudits();
        },
        error: (message) => {
          console.log(message);
          this.importResult = JSON.stringify(message.error, undefined, 2);
          this.alerts.push({ type: 'danger', msg: 'Network request failure [14]: please try again later.' });
          this.submitting = false;
          this.loadAudits();
        }
      });
    }
  }

  private loadAudits(): void {
    this.auditsService.findByAuditEventType('AFFILIATE_IMPORT').subscribe({
      next: (result) => {
        this.audits = result;
      },
      error: (message) => {
        console.log('Failed to update audit list: ' + message);
      }
    });
  }

  private loadImportSpec(): void {
    this.importAffiliatesService.importSpec().subscribe({
      next: (result) => {
        this.importSpec = result;
      },
      error: (message) => {
        console.log('Failed to load import spec: ' + message);
      }
    });
  }

  closeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }
}