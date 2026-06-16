import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { UserAffiliateService } from 'src/app/services/user-affiliate/user-affiliate.service';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ImsConfigService } from 'src/app/services/ims-config/ims-config.service';
import { AuthBootstrapService } from 'src/app/services/auth-bootstrap/auth-bootstrap.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CompareTextPipe,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  rememberMe: boolean = true;

  submitting: boolean = false;
  authenticationError: boolean = false;
  authenticationErrorMessageKey: string = '';

  usernameValidated: boolean = false;

  routes = ROUTES;

  constructor(
    private authenticationService: AuthenticationSharedService,
    private authBootstrapService: AuthBootstrapService,
    private router: Router,
    private applicationUtilsService: ApplicationUtilsService,
    private userAffiliateService: UserAffiliateService,
    private imsConfigService: ImsConfigService
  ) {}

  ngOnInit(): void {}

  onUsernameBlur(): void {
    const username = this.username?.trim();
    this.usernameValidated = !!username;
  }

  onUsernameChange(): void {

    if (!this.username?.trim()) {
      this.usernameValidated = false;
      this.password = '';
    }
  }

  get isImsUser(): boolean {

    if (!this.usernameValidated) {
      return false;
    }

    const username = this.username?.trim();

    return !!username && !username.includes('@');
  }

  get isEmailUser(): boolean {

    if (!this.usernameValidated) {
      return false;
    }

    return !!this.username?.includes('@');
  }

  login(): void {

    this.authenticationError = false;
    this.authenticationErrorMessageKey = '';

    const username = this.username?.trim();

    if (!username) {
      return;
    }

    if (this.isImsUser) {

      const callbackUrl = `${window.location.origin}/`;
      const imsEndpoint = this.imsConfigService.getImsEndpoint();

      const redirectUrl =
        `${imsEndpoint}/#/login?serviceReferer=${encodeURIComponent(callbackUrl)}&login=${encodeURIComponent(username)}`;

      window.location.href = redirectUrl;
      return;
    }

    this.submitting = true;

    this.authenticationService
      .login(
        this.username,
        this.password,
        this.rememberMe
      )
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({

        next: () => {
          this.authBootstrapService.navigateByRole();
        },

        error: (error) => {
          this.authenticationError = true;

          this.authenticationErrorMessageKey =
            this.authenticationService.extractErrorCode(
              error.message
            );
        }

      });
  }
}