import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemberService } from 'src/app/services/member/member.service';


@Component({
  selector: 'app-landing-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-content.component.html',
  styleUrl: './landing-content.component.scss'
})
export class LandingContentComponent {

  memberKey: string | null = null;
  defaultMemberKey = 'IHTSDO';

  constructor(private route: ActivatedRoute, private memberService: MemberService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.memberKey = params['memberKey'] || this.defaultMemberKey;
    });
  }
}
