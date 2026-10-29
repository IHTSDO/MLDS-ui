
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterModule
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MemberService } from 'src/app/services/member/member.service';
import { CountryService } from 'src/app/services/country/country.service';
import { CompareTextPipe } from '../../../pipes/compare-text/compare-text.pipe';

/**
 * Footer flag configuration.
 *
 * externalUrl:
 * null   -> Internal MLDS landing page
 * string -> External alternate registration URL
 */
interface FooterFlag {
  key: string;
  language: string;
  title: string;
  externalUrl: string | null;
}

/**
 * Landing Footer Component
 *
 * MLDS-1350
 *
 * Rules:
 *
 * 1. memberActive === false -> Hide flag
 * 2. footerActive === false -> Hide flag
 * 3. Both true + excludeUsage === false
 *    -> Internal MLDS landing page
 * 4. Both true + excludeUsage === true
 *    -> Alternate registration URL
 *
 * IHTSDO is excluded because its logo is
 * rendered separately in the footer template.
 */
@Component({
  selector: 'app-landing-footer',
  imports: [
    TranslateModule,
    CompareTextPipe,
    CommonModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent implements OnInit {

  currentYear: number;
  isLoading: boolean = true;
  flags: FooterFlag[] = [];

  constructor(
    private memberService: MemberService,
    private countryService: CountryService,
    private route: ActivatedRoute
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.fetchFlags();
  }

  /**
   * Fetch members and countries during initial loading.
   */
  private fetchFlags(): void {
    this.isLoading = true;

    forkJoin({
      members: this.memberService.getMembers(),
      countries: this.countryService.getCountries()
    }).subscribe({
      next: ({ members, countries }) => {
        this.flags = this.buildFlags(
          members ?? [],
          countries ?? []
        );

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.flags = [];

        console.error(
          'Error fetching footer flags:',
          error
        );
      }
    });
  }

  /**
   * Build footer flags based on member status,
   * footer status, and country usage configuration.
   */
  private buildFlags(
    members: any[],
    countries: any[]
  ): FooterFlag[] {

    // Map countries using ISO alpha-2 codes.
    const countryByIso = new Map<string, any>(
      countries
        .filter((country: any) => country?.isoCode2)
        .map((country: any) => [
          String(country.isoCode2).trim().toUpperCase(),
          country
        ])
    );

    const flags: FooterFlag[] = [];

    for (const member of members) {

      const key = String(member?.key ?? '')
        .trim()
        .toUpperCase();

      if (!key) {
        continue;
      }

      // IHTSDO logo is rendered separately.
      if (key === 'IHTSDO') {
        continue;
      }

      // Condition 1: Member must be active.
      if (member.memberActive !== true) {
        continue;
      }

      // Condition 2: Footer must be active.
      if (member.footerActive !== true) {
        continue;
      }

      // Find matching country using ISO code.
      const country = countryByIso.get(key);

      // Condition 3: Check excludeUsage.
      if (country?.excludeUsage === true) {

        const alternateUrl = this.normaliseUrl(
          country.alternateRegistrationUrl
        );

        // Avoid displaying flags with missing URLs.
        if (!alternateUrl) {
          console.warn(
            `Alternate registration URL missing for ${key}`
          );
          continue;
        }

        // External registration URL.
        flags.push({
          key,
          language: member.language || 'en',
          title: country.commonName ?? member.name ?? key,
          externalUrl: alternateUrl
        });

      } else {

        // Existing internal MLDS landing page.
        flags.push({
          key,
          language: member.language || 'en',
          title: member.name ?? country?.commonName ?? key,
          externalUrl: null
        });
      }
    }

    // Sort flags alphabetically by member key.
    return flags.sort(
      (a, b) => a.key.localeCompare(b.key)
    );
  }

  /**
   * Normalize alternate registration URL.
   *
   * Supports:
   * https://example.com
   * http://example.com
   * www.example.com
   */
  private normaliseUrl(
    url: string | null | undefined
  ): string | null {

    const trimmed = (url ?? '').trim();

    if (!trimmed) {
      return null;
    }

    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      const parsedUrl = new URL(normalized);

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return null;
      }

      return parsedUrl.toString();
    } catch {
      return null;
    }
  }
}
