import { Component } from '@angular/core';
import { LandingHeaderComponent } from "../landing-header/landing-header.component";
import { LandingFooterComponent } from "../landing-footer/landing-footer.component";
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MemberService } from 'src/app/services/member/member.service';
import { ROUTES } from 'src/app/routes-config';
import { CommonModule } from '@angular/common';
/**
 * Landing page component that displays the landing page with header, content, and footer.
 * It also handles member key parameter from the route and sets the member logo accordingly.
 */
@Component({
    selector: 'app-landing-page',
    imports: [LandingHeaderComponent, LandingFooterComponent, RouterOutlet, CommonModule],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  routes = ROUTES;
  /**
   * Constructor that injects the member service and activated route.
   * @param memberService - The member service instance.
   * @param route - The activated route instance.
   */
  constructor(private memberService: MemberService, private route: ActivatedRoute, private router: Router) {}

  /**
   * Initializes the component by subscribing to the route parameters and setting the member key if present.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const memberKey = params['memberKey'];
      if (memberKey) {
        this.setMemberKey(memberKey);
      }
    });
    this.getLandingPageStyle();
  }

  /**
   * Sets the member key and fetches the member logo from the member service.
   * @param memberKey - The member key to set.
   * @example
   * this.setMemberKey('member-123');
   */
  setMemberKey(memberKey: string): void {
    this.memberService.setMemberKey(memberKey);
    this.memberService.getMemberLogo(memberKey).subscribe({
      next: (logoUrl: string) => {
        this.memberService.setMemberLogo(logoUrl);
      },
      error: (error) => {
        console.error('Error fetching member logo:', error);
      }
    });
  }

  getLandingPageStyle() {
    return (this.router.url.startsWith('/landing') || this.router.url.startsWith('/viewReleases'))  ? { 'margin-bottom': '10rem' } : {'margin-bottom':'5rem'};
  }
}

