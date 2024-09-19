import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { ROUTES } from 'src/app/routes-config';
import { NgbDropdown, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
/**
 * Landing header component
 *
 * Displays the member logo in the landing page header
 */
@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbModule, NgbDropdown, NgbDropdownModule, TranslateModule, CompareTextPipe],
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent {
  routes = ROUTES;
  languages = [
    { key: 'en', name: 'English', flag: 'gb' },
    { key: 'fr', name: 'French', flag: 'fr' },
    { key: 'de', name: 'German', flag: 'de' },
    { key: 'de-at', name: 'German (Austria)', flag: 'at' },
    { key: 'id', name: 'Indonesian', flag: 'id' },
    { key: 'pl', name: 'Polish', flag: 'pl' },
    { key: 'pt', name: 'Portuguese', flag: 'pt' },
    { key: 'es', name: 'Spanish', flag: 'es' },
    { key: 'se', name: 'Swedish', flag: 'se' },
    { key: 'th', name: 'Thai', flag: 'th' }
  ];
  
 
  memberLogo: string | null = null;
  isAuthenticated: boolean = false;
  userName: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  isUser: boolean = false;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private sessionService: AuthenticationSharedService ,// Inject SessionService
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {

    const storedLang = localStorage.getItem('selectedLang');
    this.translateService.use(storedLang ?? 'en');

    this.memberService.memberLogo$.subscribe(logoUrl => {
      this.memberLogo = logoUrl;
    });


    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUserDetails();
    });


    this.updateUserDetails();
  }

  // Method to update user authentication and details
  updateUserDetails(): void {
    this.isAuthenticated = this.sessionService.isAuthenticated();
    this.isUser = this.sessionService.isUser();

    if (this.isAuthenticated) {
      const userDetails = this.sessionService.getUserDetails();
      if (userDetails) {
        this.firstName = userDetails.firstName;
        this.lastName = userDetails.lastName;
        this.userName = `${this.firstName} ${this.lastName}`;
      }
    }
  }
  changeLanguage(lang: any) {
    this.translateService.use(lang);
    localStorage.setItem('selectedLang', lang);
  }

}