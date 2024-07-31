import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StaffTopNavComponent } from "../staff-top-nav/staff-top-nav.component";
import { SideNavComponent } from "../side-nav/side-nav.component";
import { AdminFooterComponent } from "../admin-footer/admin-footer.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, StaffTopNavComponent, SideNavComponent, AdminFooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor() { }
}
