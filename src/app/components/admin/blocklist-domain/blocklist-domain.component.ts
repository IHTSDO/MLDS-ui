import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BolcklistDomainService } from 'src/app/services/blocklist-domain/bolcklist-domain.service';

/**
 * Component for managing blocklisted domains.
 */
@Component({
    selector: 'app-blocklist-domain',
    imports: [CommonModule, FormsModule],
    templateUrl: './blocklist-domain.component.html',
    styleUrls: ['./blocklist-domain.component.scss']
})
export class BlocklistDomainComponent implements OnInit {
  /**
   * Array containing the blocklisted domains.
   */
  domainBlacklist: any[] = [];  // Initialize as an empty array

  /**
   * Form data for adding a new domain to the blocklist.
   */
  domainForm: any = { name: '' };

  constructor(private domainBlacklistService: BolcklistDomainService) { }

  ngOnInit(): void {
    this.getDomainBlacklist();
  }

  getDomainBlacklist(): void {
    this.domainBlacklistService.getDomainBlacklist().subscribe({
      next: data => this.domainBlacklist = data || [],  // Ensure data is an array
      error: (error: any) => {
        console.error('Error fetching domain blacklist', error);
      }
    });
  }

  newDomainSubmit(): void {
    if (this.domainForm.name) {
      this.domainBlacklistService.addDomain(this.domainForm.name).subscribe({
        next: () => {
          this.domainForm.name = '';
          this.getDomainBlacklist();
        },
        error: (error: any) => {
          console.error('Error adding domain', error);
        }
      });
    }
  }

  removeDomain(domain: string): void {
    this.domainBlacklistService.removeDomain(domain).subscribe({
      next: () => this.getDomainBlacklist(),
      error: (error: any) => {
        console.error('Error removing domain', error);
      }
    });
  }
}
