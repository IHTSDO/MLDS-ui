import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ContactInfoComponent } from '../contact-info/contact-info.component';



@Component({
  selector: 'app-edit-affiliate',
  standalone: true,
  imports: [CommonModule, ContactInfoComponent],
  templateUrl: './edit-affiliate.component.html',
  styleUrl: './edit-affiliate.component.scss'
})
export class EditAffiliateComponent implements OnInit {

  affiliateId: any;
  isAdmin: boolean = false;
  affiliate: any = null;
  loading: boolean = true;
  isEditable: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationSharedService,private affiliateService: AffiliateService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.affiliateId = params.get('affiliateId');
    });
    if (this.authenticationService.isLoggedIn()) {
      this.isAdmin = this.authenticationService.isAdmin();
    }
    this.loadAffiliate();
  }

  private loadAffiliate(): void {
      if (this.affiliateId) {
        this.fetchAffiliateById(this.affiliateId);
      }
  }

  private fetchAffiliateById(affiliateId: string): void {
    this.affiliateService.affiliate(affiliateId).subscribe({
      next: data => {
        this.affiliate = data;
        this.loading = false;
        const userDetails = this.authenticationService.getUserDetails();
        this.isEditable = this.isAdmin || (userDetails?.member?.['key'] === this.affiliate.application.member.key);
        console.log(this.affiliate);
      },
      error: error => {
        this.loading = true;
      }
    });

  }

  cancel(): void {
    this.router.navigate(['/affiliateManagement',this.affiliateId]);
  }

}
