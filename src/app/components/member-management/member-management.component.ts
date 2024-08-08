import { Component } from '@angular/core';
import { MemberService } from 'src/app/services/member/member.service';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditMemberModalComponent } from '../edit-member-modal/edit-member-modal.component';

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

  constructor(
    private memberService: MemberService,
    private modalService: NgbModal,
    private router: Router
  ) { }

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

  viewBranding(member: any): void {
    this.router.navigate(['/member/memberManagement', member.key, 'branding']);
  }

  openEditMemberModal(member: any): void {
    const modalRef = this.modalService.open(EditMemberModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.member = member;
    modalRef.result.then(() => {
      this.fetchMembers();
    });
  }
  
}
