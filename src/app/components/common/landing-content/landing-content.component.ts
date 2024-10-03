import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  standalone: true,
  imports: [RouterLink,TranslateModule,CompareTextPipe],
  templateUrl: './landing-content.component.html',
  styleUrl: './landing-content.component.scss'
})
export class LandingContentComponent implements OnInit{
 /**
   * Member key retrieved from route parameters or default value
   */
 memberKey: string | null = null;

 /**
  * Default member key to use if none is provided
  */
 defaultMemberKey = 'IHTSDO';
 translatedDetails: SafeHtml = '';
  landingText: string = '';
  private langISO: string | null = null;
  private subscriptions = new Subscription();
 /**
  * Subscription to language change events
  */
 

 /**
  * Constructor
  * 
  * @param route ActivatedRoute instance
  * @param memberService MemberService instance
  * @param sanitizer DomSanitizer instance
  * @param translateService TranslateService instance
  */
 constructor(
   private route: ActivatedRoute,
   private memberService: MemberService,
   private sanitizer: DomSanitizer,
   private countryService: CountryService,
   private translateService: TranslateService
 ) {
  this.setTranslatedDetails();
  this.translateService.onLangChange.subscribe(() => {
    this.setTranslatedDetails();
  });
}

 /**
  * Initializes the component
  */
 ngOnInit(): void {
   /**
    * Subscribes to route parameters changes
    */
   this.setLandingText();
   this.route.params.subscribe(params => {
     /**
      * Retrieves the member key from route parameters or uses the default value
      */
     this.memberKey = params['memberKey'] || this.defaultMemberKey;
   });
   this.subscriptions.add(
    this.route.params.subscribe(params => {
      this.memberKey = params['memberKey'];
      this.langISO = this.route.snapshot.queryParamMap.get('lang');
      if (this.langISO) {
        this.translateService.use(this.langISO);
      }
      this.loadMemberData();
    })
  );

  this.subscriptions.add(
    this.translateService.onLangChange.subscribe(() => {
      this.setLandingText();
    })
  );

  this.loadMemberData();

 }
 private loadMemberData(): void {
  // Load member data
  this.subscriptions.add(
    this.memberService.getMembers().subscribe(members => {
      const member = this.memberService.membersByKey[this.memberKey ?? ''];
      if (member) {
        this.setLandingText();
      }
    })
  );
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

 setTranslatedDetails(): void {
  this.translateService.get('views.landingPage.furtherDetails').subscribe((translation: string) => {
    this.translatedDetails = this.sanitizer.bypassSecurityTrustHtml(translation);
  });
}
}