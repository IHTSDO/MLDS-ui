import { Component } from '@angular/core';
import { MemberService } from 'src/app/services/member/member.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditMemberModalComponent } from '../edit-member-modal/edit-member-modal.component';
import { EditMemberNotificationsComponent } from '../edit-member-notifications/edit-member-notifications.component';
import { EditLicenseComponent } from '../edit-license/edit-license.component';
import { EditFeedDataComponent } from '../edit-feed-data/edit-feed-data.component';
import { ROUTES } from 'src/app/routes-config';
import { API_ROUTES } from 'src/app/routes-config-api';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';

/**
 * Member Management Component
 * 
 * This component is responsible for managing members, including fetching, editing, and viewing member data.
 * 
 * @example
 * <app-member-management></app-member-management>
 */
@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.scss'
})
export class MemberManagementComponent {
  /**
   * Array of member objects
   */
  members: any[] = [];

  /**
   * API URL
   */
  private apiUrl = API_ROUTES.apiUrl;

  /**
   * Routes configuration
   */
  routes = ROUTES;

  isLoading: boolean = true;

  /**
   * Constructor
   * 
   * @param memberService Member service
   * @param modalService Modal service
   * @param router Router
   */
  constructor(
    private memberService: MemberService,
    private modalService: NgbModal,
    private router: Router,
    private session: AuthenticationSharedService
  ) { }

  /**
   * On init lifecycle hook
   * 
   * Fetches members data
   */
  ngOnInit(): void {
    this.fetchMembers();
  }

  canAccess(member: any): boolean {
    return this.session.isAdmin() || member.key === this.session.getUserDetails()?.member?.['key'];
  }

  /**
   * Fetches members data
   * 
   * @example
   * this.fetchMembers();
   */
  fetchMembers(): void {
    this.isLoading = true;
    this.memberService.getMembers().subscribe({
      next: (data) => {
        this.members = data.sort((a, b) => (a.key > b.key) ? 1 : -1);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching members:', error);
      }
    });
  }

  /**
   * Gets member landing page URL
   * 
   * @param member Member object
   * @returns Member landing page URL
   * 
   * @example
   * const url = this.getMemberLandingPage(member);
   */
  getMemberLandingPage(member: any): string {
    let fullBaseUrl = `${window.location.protocol}//${window.location.host}/#`;
    fullBaseUrl += '/landing/' + member.key;
    return fullBaseUrl;
  }

  /**
   * Views member branding
   * 
   * @param member Member object
   * 
   * @example
   * this.viewBranding(member);
   */
  viewBranding(member: any): void {
    this.router.navigate([this.routes.memberManagement, member.key, 'branding']);
  }

  /**
   * Opens edit member modal
   * 
   * @param member Member object
   * 
   * @example
   * this.openEditMemberModal(member);
   */
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

  /**
   * Edits staff notifications email
   * 
   * @param member Member object
   * 
   * @example
   * this.editStaffNotificationsEmail(member);
   */
  editStaffNotificationsEmail(member: any): void {
    const modalRef = this.modalService.open(EditMemberNotificationsComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.member = member;
    modalRef.result.then(() => {
      this.fetchMembers();
    });
  }

  /**
   * Views member license
   * 
   * @param memberKey Member key
   * 
   * @example
   * this.viewLicense(memberKey);
   */
  viewLicense(memberKey: string): void {
    this.memberService.getMemberLicense(memberKey).subscribe({
      next: (licenseUrl: string) => {
        window.open(licenseUrl, '_blank');
      },
      error: (error) => {
        console.error('Error fetching member license:', error);
      }
    });
  }

  /**
 * Edits member license
 * 
 * Opens a modal to edit the member's license
 * 
 * @param member Member object
 * 
 * @example
 * this.editLicense({ key: 'member-key' });
 */
editLicense(member: any): void {
  const modalRef = this.modalService.open(EditLicenseComponent, {
    size: 'lg',
    backdrop: 'static'
  });
  modalRef.componentInstance.member = member;
  modalRef.result.then(() => {
    this.fetchMembers();
  }).catch(error => {
    console.error('Modal dismissed or error occurred', error);
  }).finally(() => {
    this.fetchMembers();
  });
}

/**
 * Edits member feed data
 * 
 * Opens a modal to edit the member's feed data
 * 
 * @param member Member object
 * 
 * @example
 * this.editFeedData({ key: 'member-key' });
 */
editFeedData(member: any): void {
  const modalRef = this.modalService.open(EditFeedDataComponent, {
    size: 'lg',
    backdrop: 'static'
  });
  modalRef.componentInstance.member = member;
  modalRef.result.then(() => {
    this.fetchMembers();
  });
}
}
