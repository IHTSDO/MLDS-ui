import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";
import { EnumPipe } from "../../../pipes/enum/enum.pipe";
import { SideBarService } from 'src/app/services/side-bar/side-bar.service';

/**
 * Side navigation component that displays links based on user roles.
 *
 * @example
 * <app-side-nav></app-side-nav>
 */
@Component({
    selector: 'app-side-nav',
    imports: [CommonModule, RouterLink, TranslateModule, CompareTextPipe, EnumPipe],
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  /**
   * Whether the user is an administrator.
   */
  isAdmin: boolean = false;

  /**
   * Whether the user is a staff member.
   */
  isStaff: boolean = false;

  /**
   * Whether the user is a staff member or an administrator.
   */
  isStaffOrAdmin: boolean = false;

  /**
   * Whether the user is a member, staff member, or administrator.
   */
  isMemberOrStaffOrAdmin: boolean = false;

  /**
   * Routes configuration.
   */
  routes = ROUTES;
  selectedItem: number | null = null; // Track the selected item
  hoverItem: number | null = null; // Track the hovered item
  /**
   * Constructor.
   *
   * @param authenticationService Authentication service.
   * @param router Router.
   */
  constructor(
    private authenticationService: AuthenticationSharedService,
    private router: Router,
    private sidebarService: SideBarService
  ) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.isAdmin = this.authenticationService.isAdmin();
      this.isStaff = this.authenticationService.isStaff();
      this.isStaffOrAdmin = this.authenticationService.isStaffOrAdmin();
      this.isMemberOrStaffOrAdmin = this.authenticationService.isMemberOrStaffOrAdmin();
    }
    this.sidebarService.selectedItem$.subscribe((index) => {
      this.selectedItem = index;
    });

    // Optionally, set the selectedItem from the service if needed on initialization
    this.selectedItem = this.sidebarService.getSelectedItem();
    
  }
 // This method should trigger a change in selectedItem
 selectItem(index: number): void {
  this.sidebarService.selectItem(index);  // Update the BehaviorSubject in the service
}

// Hover logic if needed
hoverItemChange(index: number | null): void {
  this.hoverItem = index;
}

  // HostListener to detect clicks outside the sidebar
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const sidebar = document.getElementById('sideNav');
    // Check if the click is outside the sidebar
    if (sidebar && !sidebar.contains(target)) {
      this.hoverItem = null; // Deselect the hover when clicking outside
    }
  }

  checkUrl(route: string): boolean {
    return this.router.url.includes(route);
  }
}