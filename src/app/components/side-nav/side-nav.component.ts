import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config';

/**
 * Side navigation component that displays links based on user roles.
 *
 * @example
 * <app-side-nav></app-side-nav>
 */
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  /**
   * Constructor.
   *
   * @param authenticationService Authentication service.
   * @param router Router.
   */
  constructor(
    private authenticationService: AuthenticationSharedService,
    private router: Router
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
  }

  /**
   * Logs out the user and navigates to the login page.
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate([this.routes.login]);
  }

}