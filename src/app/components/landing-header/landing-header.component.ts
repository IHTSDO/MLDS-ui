import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from 'src/app/services/member/member.service';

/**
 * Landing header component
 *
 * Displays the member logo in the landing page header
 */
@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent {
  /**
   * Member logo URL
   *
   * Initially set to null, updated with the actual logo URL when the component is initialized
   */
  memberLogo: string | null = null;

  /**
   * Constructor
   *
   * Injects the MemberService instance
   * @param memberService - MemberService instance
   */
  constructor(private memberService: MemberService) {}

  /**
   * OnInit lifecycle hook
   *
   * Subscribes to the memberLogo$ observable and updates the memberLogo property with the received logo URL
   */
  ngOnInit(): void {
    /**
     * Example: memberLogo$ observable emits a logo URL
     * memberService.memberLogo$.subscribe(logoUrl => {
     *   this.memberLogo = 'https://example.com/logo.png';
     * });
     */
    this.memberService.memberLogo$.subscribe(logoUrl => {
      this.memberLogo = logoUrl;
    });
  }
}