import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BolcklistDomainService } from 'src/app/services/blocklist-domain/bolcklist-domain.service';

/**
 * Component for managing blocklisted domains.
 */
@Component({
  selector: 'app-blocklist-domain',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blocklist-domain.component.html',
  styleUrls: ['./blocklist-domain.component.scss']
})
export class BlocklistDomainComponent implements OnInit {
  /**
   * Object containing the blocklisted domains.
   */
  domainBlacklist: any = {};

  /**
   * Form data for adding a new domain to the blocklist.
   */
  domainForm: any = { name: '' };

  constructor(private domainBlacklistService: BolcklistDomainService) { }

  /**
   * Initializes the component by fetching the blocklisted domains.
   */
  ngOnInit(): void {
    this.getDomainBlacklist();
  }

  /**
   * Fetches the blocklisted domains from the service.
   */
  getDomainBlacklist(): void {
    this.domainBlacklistService.getDomainBlacklist().subscribe({
     next: data => this.domainBlacklist = data,
     error: (error: any) => {
         console.error('Error fetching domain blacklist', error)
     },
   });
  }

  /**
   * Submits a new domain to be added to the blocklist.
   *
   * @example
   * <button (click)="newDomainSubmit()">Add Domain</button>
   */
  newDomainSubmit(): void {
    if (this.domainForm.name) {
      this.domainBlacklistService.addDomain(this.domainForm.name).subscribe({
        next:() => {
          this.domainForm.name = '';
          this.getDomainBlacklist();
        },
        error: (error: any) => {
           console.error('Error adding domain', error)
        },
    });
    }
  }

  /**
   * Removes a domain from the blocklist.
   *
   * @param domain - The domain to be removed.
   * @example
   * <button (click)="removeDomain('example.com')">Remove Domain</button>
   */
  removeDomain(domain: string): void {
    this.domainBlacklistService.removeDomain(domain).subscribe({
      next:() => this.getDomainBlacklist(),
      error: (error: any) => {
        console.error('Error removing domain', error)
    },});
  }
}