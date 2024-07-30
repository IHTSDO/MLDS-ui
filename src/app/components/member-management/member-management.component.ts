import { Component } from '@angular/core';
import { MemberService } from 'src/app/services/member/member.service';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.scss'
})
export class MemberManagementComponent {
  members: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
      this.fetchMembers();
  }

  fetchMembers(): void {
    this.memberService.getMembers().subscribe({
      next: (data) => {
        this.members = data.sort((a, b) => (a.key > b.key) ? 1 : -1);
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      }
    });
  }

  getMemberLandingPage(member: any): string {
    let url = this.apiUrl;
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex);
    }
    url += '/landing/' + member.key;
    return url;
  }
  
}
