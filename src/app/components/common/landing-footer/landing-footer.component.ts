import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MemberService } from 'src/app/services/member/member.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { CommonModule } from '@angular/common';

/**
 * Landing Footer Component
 * 
 * This component is responsible for rendering the footer section of the landing page.
 * It displays the current year and provides a link to the member service.
 * 
 * Example:
 * <app-landing-footer></app-landing-footer>
 */
@Component({
    selector: 'app-landing-footer',
    imports: [TranslateModule, CompareTextPipe, CommonModule],
    templateUrl: './landing-footer.component.html',
    styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {

  /**
   * Current year
   * 
   * The current year is used to display the copyright information in the footer.
   */
  currentYear: number;
  isLoading: boolean = true;
  members: any[] = [];
  /**
   * Constructor
   * 
   * Initializes the component with the member service and activated route.
   * 
   * @param memberService Member service instance
   * @param route Activated route instance
   */
  constructor(private memberService: MemberService, private route: ActivatedRoute) {
    this.currentYear = new Date().getFullYear();
  }
  ngOnInit(): void {
    this.fetchMembers(); // Fetch members when component loads
  }

  fetchMembers(): void {
    this.isLoading = true;
    this.memberService.getMembers().subscribe({
      next: (data) => {
        // Filter out 'ihtsdo'
        const filteredMembers = data.filter((member: any) => member.key.toLowerCase() !== 'ihtsdo');
        this.members = this.sortMembers(filteredMembers);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching members:', error);
      }
    });
  }
  
// Function to sort members by key (alpha-2 code)
private sortMembers(members: any[]): any[] {
  return members.sort((a, b) => {
    return a.key.localeCompare(b.key);
  });
}

  getMemberLandingPage(member: any): string {
    let fullBaseUrl = `${window.location.protocol}//${window.location.host}/#/landing/${member.key}`;
    if (member.language) {
      fullBaseUrl += `?lang=${member.language}`;
    }
    return fullBaseUrl;
  }
    
}