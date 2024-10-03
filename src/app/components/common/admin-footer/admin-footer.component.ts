/**
 * Admin Footer Component
 *
 * This component displays the footer section of the admin dashboard.
 *
 * Example:
 * ```
 * <app-admin-footer></app-admin-footer>
 * ```
 *
 * @component
 */
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.scss']
})
export class AdminFooterComponent implements OnInit{

  copyright!: string; 


  ngOnInit(): void {
     this.updateCopyright();
    this.loadIubendaScript();
  }

  updateCopyright(): void {
    this.copyright = 'Copyright © ' + new Date().getFullYear() + ' SNOMED International';
  }

  loadIubendaScript(): void {
    const script = document.createElement('script');
    script.src = '//cdn.iubenda.com/iubenda.js';
    document.body.appendChild(script);
  }
}