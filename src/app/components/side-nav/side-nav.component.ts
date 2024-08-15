import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config'
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule ,RouterLink,],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit{

  isAdmin: boolean = false;
  isStaff: boolean = false;
  isStaffOrAdmin: boolean = false;
  isMemberOrStaffOrAdmin: boolean = false;
  routes = ROUTES;
  constructor(
    private authenticationService: AuthenticationSharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.isAdmin = this.authenticationService.isAdmin();
      this.isStaff = this.authenticationService.isStaff();
      this.isStaffOrAdmin = this.authenticationService.isStaffOrAdmin();
      this.isMemberOrStaffOrAdmin = this.authenticationService.isMemberOrStaffOrAdmin();
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']); 
  }

}
