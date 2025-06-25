import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StaffTopNavComponent } from "../staff-top-nav/staff-top-nav.component";
import { SideNavComponent } from "../side-nav/side-nav.component";
import { AdminFooterComponent } from "../admin-footer/admin-footer.component";

/**
 * Dashboard component that serves as the main entry point for the application.
 * It imports and renders the StaffTopNavComponent, SideNavComponent, and AdminFooterComponent.
 *
 * @example
 * <app-dashboard></app-dashboard>
 */
@Component({
    selector: 'app-dashboard',
    imports: [RouterOutlet, StaffTopNavComponent, SideNavComponent, AdminFooterComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  /**
   * Constructor for the DashboardComponent.
   */
  constructor() { }
}