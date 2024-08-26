import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit{
  routes = ROUTES;
  constructor(
    private router: Router,
    private authenticationSharedService: AuthenticationSharedService
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.authenticationSharedService.logout();
  }
}