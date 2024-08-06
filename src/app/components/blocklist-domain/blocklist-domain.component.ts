import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BolcklistDomainService } from 'src/app/services/blocklist-domain/bolcklist-domain.service';

@Component({
  selector: 'app-blocklist-domain',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './blocklist-domain.component.html',
  styleUrl: './blocklist-domain.component.scss'
})
export class BlocklistDomainComponent implements OnInit{
  domainBlacklist: any = {};
  domainForm: any = { name: '' };

  constructor(private domainBlacklistService: BolcklistDomainService) { }

  ngOnInit(): void {
    this.getDomainBlacklist();
  }

  getDomainBlacklist(): void {
    this.domainBlacklistService.getDomainBlacklist().subscribe(
      data => this.domainBlacklist = data,
      error => console.error('Error fetching domain blacklist', error)
    );
  }

  newDomainSubmit(): void {
    if (this.domainForm.name) {
      this.domainBlacklistService.addDomain(this.domainForm.name).subscribe(
        () => {
          this.domainForm.name = '';
          this.getDomainBlacklist();
        },
        error => console.error('Error adding domain', error)
      );
    }
  }

  removeDomain(domain: string): void {
    this.domainBlacklistService.removeDomain(domain).subscribe(
      () => this.getDomainBlacklist(),
      error => console.error('Error removing domain', error)
    );
  }
}


