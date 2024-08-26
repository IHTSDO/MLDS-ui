import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { ROUTES } from 'src/app/routes-config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * Landing header component
 *
 * Displays the member logo in the landing page header
 */
@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule,RouterLink,NgbModule],
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent {
routes= ROUTES;
languages: any;
changeLanguage(arg0: any) {
throw new Error('Method not implemented.');
}
  memberLogo: string | null = null;
  isAuthenticated: boolean = false;
  userName: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  isUser: boolean = false;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private sessionService: AuthenticationSharedService // Inject SessionService
  ) {}

  ngOnInit(): void {
    this.memberService.memberLogo$.subscribe(logoUrl => {
      this.memberLogo = logoUrl;
    });

    // Check if the user is authenticated and get user details
    this.isAuthenticated = this.sessionService.isAuthenticated();
    if (this.isAuthenticated) {
      const userDetails = this.sessionService.getUserDetails();
      this.userName = `${userDetails?.firstName} ${userDetails?.lastName}`;
    }
     // Check if the user is authenticated and get user details
     this.isUser = this.sessionService.isUser();
     if (this.isUser) {
       const userDetails = this.sessionService.getUserDetails();
       this.userName = `${userDetails?.firstName} ${userDetails?.lastName}`;
     }
    const userDetails = this.sessionService.getUserDetails();
    if (userDetails) {
      this.firstName = userDetails.firstName;
      this.lastName = userDetails.lastName;
    }
  }


}