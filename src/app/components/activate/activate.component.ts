import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivateService } from 'src/app/services/activate/activate.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent implements OnInit {
  success: string | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activateService: ActivateService,
    private sessionService: AuthenticationSharedService
  ) {}

  ngOnInit(): void {
    
    const key = this.route.snapshot.queryParamMap.get('key');
    if (key) {
      this.activateService.get({ key }).subscribe(
        (response: string) => {
          console.log('Activation successful:', response);
          this.success = 'OK';
          setTimeout(() => this.router.navigate(['/affiliateRegistration']), 2000);
        },
        (error: any) => {
          console.error('Activation error', error);
          this.success = null;
          this.error = 'ERROR';
        }
      );
    }
  }
  
}
  