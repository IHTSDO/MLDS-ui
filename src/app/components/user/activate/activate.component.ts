import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivateService } from 'src/app/services/activate/activate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

@Component({
    selector: 'app-activate',
    imports: [CommonModule, TranslateModule, CompareTextPipe],
    templateUrl: './activate.component.html',
    styleUrl: './activate.component.scss'
})
export class ActivateComponent implements OnInit {
  success: string | null = null;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activateService: ActivateService,
    private sessionService: AuthenticationSharedService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const key = this.route.snapshot.queryParamMap.get('key');
    if (key) {
      this.activateService.get({ key }).subscribe({next:
        (response: string) => {
          this.success = 'OK';
          localStorage.setItem('isLoggedIn', 'true');
          this.handleAccountDetails();
          this.setSuccessMessage(); // Set the success message after activation
        },
        error:(error: any) => {
          console.error('Activation error', error);
          this.success = null;
          this.error = 'ERROR';
        }
    });
    }
  }

  handleAccountDetails(): void {
    this.sessionService.AccountFromActivate().subscribe({
      next: () => {
        setTimeout(() => {this.router.navigate(['/affiliateRegistration']);}, 2000);
      },
      error: (err) => {
        console.error('Error fetching account details:', err);
      }
    });
  }

  setSuccessMessage(): void {
    this.translateService.get('views.activate.messages.success.body', { linkbegin: '<a href="#/usageReports">', linkend: '</a>' })
      .subscribe((translated: string) => {
        this.successMessage = translated;
      });
  }
}