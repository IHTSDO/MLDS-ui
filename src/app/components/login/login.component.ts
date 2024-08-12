import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  rememberMe: boolean = true;
  submitting: boolean = false;
  authenticationError: boolean = false;
  authenticationErrorMessageKey: string = '';

  constructor(
    private authenticationService: AuthenticationSharedService,
    private router: Router
  ) {}

  login() {
    this.submitting = true;
    this.authenticationService.login(this.username, this.password, this.rememberMe)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (data) => {
          if(this.authenticationService.isStaffOrAdmin()){
          this.router.navigate(['/member']);
          }
          else{
            this.router.navigate(['/userDashboard'])
          }
        },
        error: (error) => {
          this.authenticationError = true;
          this.authenticationErrorMessageKey = this.authenticationService.extractErrorCode(error.message);
        }
      });
  }

}

 

