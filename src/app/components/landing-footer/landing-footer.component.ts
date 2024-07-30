import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [],
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {

  currentYear:number;

  constructor(private memberService: MemberService,private route: ActivatedRoute){
    this.currentYear = new Date().getFullYear();
  }


}

