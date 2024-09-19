/**
 * Staff Top Navigation Component
 *
 * This component renders the top navigation bar for staff members.
 *
 * Example:
 * ```
 * <app-staff-top-nav></app-staff-top-nav>
 * ```
 *
 * @component
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { EnumPipe } from 'src/app/pipes/enum/enum.pipe';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { ROUTES } from 'src/app/routes-config';
@Component({
  selector: 'app-staff-top-nav',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule,ReactiveFormsModule,NgbCollapseModule,TranslateModule,NgbDropdownModule,NgbDropdown,EnumPipe,CompareTextPipe],
  templateUrl: './staff-top-nav.component.html',
  styleUrls: ['./staff-top-nav.component.scss'] // note: styleUrl is deprecated, use styleUrls instead
})
export class StaffTopNavComponent implements OnInit {
  homePageUrl: string | null = null;

  session: any;
  isNavbarCollapsed: boolean = true;
routes= ROUTES;
langkey: string | undefined;


 

  constructor(private sessionService: AuthenticationSharedService, private translate: TranslateService) {
    const storedLang = localStorage.getItem('selectedLang') ?? this.sessionService.getUserDetails()?.langKey ?? 'en';
    this.translate.use(storedLang);
   }

  ngOnInit(): void {
    this.updateHomePageUrl();
    this.session = this.sessionService.getUserDetails();
    console.log(this.sessionService.getUserDetails()?.langKey);
 
  }

  private updateHomePageUrl(): void {
    if (this.sessionService.isMember()) {
      this.homePageUrl = '/ihtsdoReleases';
    } else {
      this.homePageUrl = '/pendingApplications';
    }
  }

  toggleDropdown(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('selectedLang', lang);
  }
}