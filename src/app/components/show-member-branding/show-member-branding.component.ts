import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { MemberService } from 'src/app/services/member/member.service';
import { ROUTES } from 'src/app/routes-config';
@Component({
  selector: 'app-show-member-branding',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './show-member-branding.component.html',
  styleUrl: './show-member-branding.component.scss'
})
export class ShowMemberBrandingComponent implements OnInit {
  memberKey: string = '';
  member: any = null;
  memberLogo$: Observable<string | null> = of(null);
  memberName: string = '';
  isLoading: boolean = true;
  userFirstName: string = '';
  userLastName: string = '';
  routes = ROUTES;
  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private authenticationService: AuthenticationSharedService
  ) {}

  ngOnInit(): void {
    this.memberKey = this.route.snapshot.paramMap.get('memberKey') || '';
    this.loadMemberDetails();
    const userDetails = this.authenticationService.getUserDetails();
    this.userFirstName = userDetails?.firstName ?? '';
    this.userLastName = userDetails?.lastName ?? ''; 
  }

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