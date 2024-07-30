import { Component } from '@angular/core';
import { MemberManagementComponent } from "../member-management/member-management.component";
import { AdminFooterComponent } from "../admin-footer/admin-footer.component";
import { SideNavComponent } from "../side-nav/side-nav.component";
import { StaffTopNavComponent } from "../staff-top-nav/staff-top-nav.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MemberManagementComponent, AdminFooterComponent, SideNavComponent, StaffTopNavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
