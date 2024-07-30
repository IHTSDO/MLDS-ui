import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.scss'
})
export class LandingHeaderComponent {

  memberLogo: string | null = null;

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.memberService.memberLogo$.subscribe(logoUrl => {
      this.memberLogo = logoUrl;
    });
  }

}
