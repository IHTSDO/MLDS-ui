import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { UserNotificationService } from 'src/app/services/user-notification/user-notification.service';

@Component({
  selector: 'app-user-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, CompareTextPipe],
  templateUrl: './user-notification.component.html',
  styleUrl: './user-notification.component.scss'
})
export class UserNotificationComponent implements OnInit {
  unsubscribed = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userNotificationService: UserNotificationService
  ) {}

  ngOnInit(): void {
    const affiliateId = this.route.snapshot.paramMap.get('affiliateId');
    const key = this.route.snapshot.paramMap.get('key');
    if (affiliateId && key) {
      this.userNotificationService.unsubscribeUser(affiliateId, key).subscribe({
        next: () => {
          this.unsubscribed = true;
        },
        error: (err) => {
          this.errorMessage = err.error || 'Unsubscribe failed or link is invalid.';
        }
      });
    } else {
      this.errorMessage = 'Invalid unsubscribe URL.';
    }
  }
}