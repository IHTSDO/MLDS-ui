import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemberService } from 'src/app/services/member/member.service';

/**
 * Landing Content Component
 * 
 * This component is responsible for displaying the landing content of the application.
 * It retrieves the member key from the route parameters and uses it to fetch the member data.
 * If no member key is provided, it defaults to 'IHTSDO'.
 * 
 * @example
 * <app-landing-content></app-landing-content>
 */
@Component({
  selector: 'app-landing-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-content.component.html',
  styleUrl: './landing-content.component.scss'
})
export class LandingContentComponent {

  /**
   * Member key retrieved from route parameters or default value
   */
  memberKey: string | null = null;

  /**
   * Default member key to use if none is provided
   */
  defaultMemberKey = 'IHTSDO';

  /**
   * Constructor
   * 
   * @param route ActivatedRoute instance
   * @param memberService MemberService instance
   */
  constructor(private route: ActivatedRoute, private memberService: MemberService) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    /**
     * Subscribes to route parameters changes
     */
    this.route.params.subscribe(params => {
      /**
       * Retrieves the member key from route parameters or uses the default value
       */
      this.memberKey = params['memberKey'] || this.defaultMemberKey;
    });
  }
}