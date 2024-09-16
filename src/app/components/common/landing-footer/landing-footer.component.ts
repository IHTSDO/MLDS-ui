import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MemberService } from 'src/app/services/member/member.service';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

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
  standalone: true,
  imports: [TranslateModule, CompareTextPipe],
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

}