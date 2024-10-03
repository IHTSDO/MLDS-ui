import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { ROUTES } from 'src/app/routes-config';
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

/**
 * Component to display member branding information
 */
@Component({
  selector: 'app-show-member-branding',
  standalone: true,
  imports: [CommonModule, RouterLink, EnumPipe, TranslateModule, CompareTextPipe],
  templateUrl: './show-member-branding.component.html',
  styleUrl: './show-member-branding.component.scss'
})
export class ShowMemberBrandingComponent implements OnInit {
  /**
   * Member key from route parameter
   */
  memberKey: string = '';

  /**
   * Member object from API response
   */
  member: any = null;

  /**
   * Observable to fetch member logo
   */
  memberLogo$: Observable<string | null> = of(null);

  /**
   * Member name from API response
   */
  memberName: string = '';

  /**
   * Flag to indicate loading state
   */
  isLoading: boolean = true;

  /**
   * User first name from authentication service
   */
  userFirstName: string = '';

  /**
   * User last name from authentication service
   */
  userLastName: string = '';

  /**
   * Routes configuration
   */
  routes = ROUTES;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private authenticationService: AuthenticationSharedService
  ) {}

  /**
   * Initialize component
   */
  ngOnInit(): void {
    this.memberKey = this.route.snapshot.paramMap.get('memberKey') ?? '';
    this.loadMemberDetails();
    const userDetails = this.authenticationService.getUserDetails();
    this.userFirstName = userDetails?.firstName ?? '';
    this.userLastName = userDetails?.lastName ?? ''; 
  }

  /**
   * Load member details from API
   * 
   * @example
   * this.loadMemberDetails();
   */
  private loadMemberDetails(): void {
    this.memberService.getMembers().pipe(
      switchMap(members => {
        this.member = members.find(member => member.key === this.memberKey) || null;
        if (this.member) {
          this.memberName = this.member.name || '';
          this.memberLogo$ = this.memberService.getMemberLogo(this.memberKey).pipe(
            catchError(error => {
              console.error('Error fetching member logo', error);
              return of(null); // Return null if there's an error
            })
          );
        } else {
          this.memberLogo$ = of(null); // Return null if member is not found
        }
        this.isLoading = false; // Set loading to false once data is loaded
        return of(this.member);
      }),
      catchError(error => {
        console.error('Error loading member details', error);
        this.isLoading = false; // Set loading to false in case of error
        return of(null);
      })
    ).subscribe();
  }
}