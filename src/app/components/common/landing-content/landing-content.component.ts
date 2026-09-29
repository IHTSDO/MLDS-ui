import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { CountryService } from 'src/app/services/country/country.service';
import { MemberService } from 'src/app/services/member/member.service';

/**
 * Landing Content Component
 * 
 * This component is responsible for displaying the landing content of the application.
 * It retrieves the member key from the route parameters and uses it to fetch the member data.
 * If no member key is provided, it defaults to 'IHTSDO'.
 * 
 * @example
 * <app-landing-content></app-landing-content>
 */
@Component({
    selector: 'app-landing-content',
    imports: [RouterLink, TranslateModule, CompareTextPipe],
    templateUrl: './landing-content.component.html',
    styleUrl: './landing-content.component.scss'
})
export class LandingContentComponent implements OnInit, OnDestroy {
  /**
   * Member key retrieved from route parameters or default value
   */
  memberKey: string | null = null;

  /**
   * Default member key to use if none is provided
   */
  defaultMemberKey = 'IHTSDO';
  landingText: string = '';
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private countryService: CountryService,
    private translateService: TranslateService
  ) {}

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.subscriptions.add(
      this.memberService.memberKey$.subscribe(key => {
        this.memberKey = key || this.defaultMemberKey;
        this.setLandingText();
      })
    );

    this.subscriptions.add(
      this.route.queryParamMap.subscribe(params => {
        const langISO = params.get('lang');
        if (langISO) {
          this.translateService.use(langISO);
        }
      })
    );

    this.subscriptions.add(
      this.translateService.onLangChange.subscribe(() => {
        this.setLandingText();
      })
    );

    this.setLandingText();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

private setLandingText(): void {
  if (this.memberKey) {
    // Load country data
    this.subscriptions.add(
      this.countryService.getCountries().subscribe(countries => {
        const country = this.countryService.countriesByIsoCode2[this.memberKey ?? ''];
        if (country) {
          this.landingText = `
            ${this.translateService.instant('views.landingPage.member.purpose1')}
            ${this.translateService.instant('global.country.' + this.memberKey)}
            ${this.translateService.instant('views.landingPage.member.purpose2')}
            ${this.translateService.instant('global.country.' + this.memberKey)}
            ${this.translateService.instant('views.landingPage.member.purpose3')}
            
            
          `;
        } else {
          this.landingText = this.translateService.instant('views.landingPage.purpose');
        }
      })
    );
  } else {
    this.landingText = this.translateService.instant('views.landingPage.purpose');
  }
}

}