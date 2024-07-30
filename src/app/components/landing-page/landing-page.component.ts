import { Component } from '@angular/core';
import { LandingHeaderComponent } from "../landing-header/landing-header.component";
import { LandingContentComponent } from "../landing-content/landing-content.component";
import { LandingFooterComponent } from "../landing-footer/landing-footer.component";
import { LoginComponent } from "../login/login.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MemberService } from 'src/app/services/member/member.service';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [LandingHeaderComponent, LandingContentComponent, LandingFooterComponent, LoginComponent,RouterOutlet],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

    constructor(private memberService: MemberService,private route: ActivatedRoute){

    }


    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const memberKey = params['memberKey'];
        if (memberKey) {
          this.setMemberKey(memberKey);
        }
      });
    }
  
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

}
