import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterLink, NgbModule, NgbDropdown, NgbDropdownModule, TranslateModule, CompareTextPipe, RouterModule],
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent {
  routes = ROUTES;
  languages = [
    { key: 'da', name: 'Danish', flag: 'dk' },
    { key: 'en', name: 'English', flag: 'gb' },
    { key: 'fr', name: 'French', flag: 'fr' },
    { key: 'de', name: 'German', flag: 'de' },
    { key: 'de-at', name: 'German', flag: 'at' },
    { key: 'id', name: 'Indonesian', flag: 'id' },
    { key: 'pl', name: 'Polish', flag: 'pl' },
    { key: 'pt', name: 'Portuguese', flag: 'pt' },
    { key: 'es', name: 'Spanish', flag: 'es' },
    { key: 'se', name: 'Swedish', flag: 'se' },
    { key: 'th', name: 'Thai', flag: 'th' }
  ];
  
  memberReady: boolean = false;
  memberLogo: string | null = null;
  isAuthenticated: boolean = false;
  userName: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  isUser: boolean = false;
  memberDetails: any = null;
  memberKey: string | null = null;
  memberName:any;
  sessionMember: any = null;
  constructor(
    private memberService: MemberService,
    private router: Router,
    private sessionService: AuthenticationSharedService ,// Inject SessionService
    private translateService: TranslateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    const storedLang = localStorage.getItem('selectedLang');
    this.translateService.use(storedLang ?? 'en');

    this.memberService.memberLogo$.subscribe(logoUrl => {
      this.memberLogo = logoUrl;
    });

     if (this.sessionMember?.isAuthenticated) {
      this.updateFromMember(this.sessionMember);
    } else {
      this.route.params.subscribe(params => {
        this.memberKey = params['memberKey'];
        if (this.memberKey) {
          this.updateFromMemberByKey(this.memberKey);
        }
      });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUserDetails();
    });


    this.updateUserDetails();
  }
}

  private updateFromMember(sessionMember: any): void {

    if (sessionMember) {
      this.memberService.getMemberLogo(sessionMember.key).subscribe({
        next: (logoUrl: string) => {
          this.memberLogo = logoUrl; // Set memberLogo here once you get the logo URL
          this.memberService.setMemberLogo(logoUrl);
        },
        error: (error) => {
          console.error('Error fetching member logo:', error);
          this.memberLogo = ''; // Fallback in case of error
        }
      });
    } else {
      this.memberLogo = ''; // Set empty string if no logo is available
    }
    this.setMemberDetails(sessionMember);
  
  }

  private updateFromMemberByKey(memberKey: string): void {
    
    this.memberService.getMembers().subscribe(members => {
      // Filter the member using the memberKey
      const filteredMember = members.find(member => member.key === this.memberKey);

    const member = filteredMember;
    this.setMemberDetails(member);
  });
  }
  private setMemberDetails(member: any): void {
    if (member) {
      const memberKey = member.key;
    const translationKey = `global.member.${memberKey}`;
    

    // Fetch the translated member name
    this.translateService.get(translationKey).subscribe((translatedName: string) => {
      this.memberName = member.name || translatedName || '';
    });
    } else {
      this.memberName = '';
      this.memberLogo = '';
    }
  }
  

  // Method to update user authentication and details
  updateUserDetails(): void {
    
    this.isAuthenticated = this.sessionService.isAuthenticated();
    this.isUser = this.sessionService.isUser();

    if (this.isAuthenticated) {
      const userDetails = this.sessionService.getUserDetails();
      
      if (userDetails) {
        this.updateFromMember(userDetails.member);
    
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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}