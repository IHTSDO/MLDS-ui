import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBsTelInputComponent } from 'ngx-bs-tel-input';
import { catchError, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { CountryService } from 'src/app/services/country/country.service';
import { UserRegistrationService } from 'src/app/services/user-registration/user-registration.service';
import { MemberService } from 'src/app/services/member/member.service';
import { EmbeddableUsageLogComponent } from "../../common/embeddable-usage-log/embeddable-usage-log.component";
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { AffiliateRegistrationReviewComponent } from '../affiliate-registration-review/affiliate-registration-review.component';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';

@Component({
  selector: 'app-affiliate-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxBsTelInputComponent, NgbModule, EmbeddableUsageLogComponent,TranslateModule,CompareTextPipe],
  templateUrl: './affiliate-registration.component.html',
  styleUrl: './affiliate-registration.component.scss'
})
export class AffiliateRegistrationComponent implements OnInit {

  applicationData: any;
  approvalState: string | null = null;
  applicationId: string | null = null;
  memberKey: string | null = null;
  affiliateApplicationForm!: FormGroup;
  countriesUsingMLDS: string[] = [];
  availableCountries: any[] = [];
  agreementTypeOptions = ['AFFILIATE_NORMAL', 'AFFILIATE_RESEARCH', 'AFFILIATE_PUBLIC_GOOD'];
  organizationTypes: string[] = [];
  billingHide: boolean = false;
  typeSubscription: Subscription = new Subscription();
  isSameAddress: boolean = false;
  addressOverride: boolean = false;
  isAffiliateLoaded: boolean = false;
  submitAttempted: boolean = false;
  commercialUsageReport: any = {};

  constructor(private userRegistrationService: UserRegistrationService,
    private applicationUtilsService: ApplicationUtilsService,
    private router: Router,
    private fb: FormBuilder,
    private countryService: CountryService,
    private memberService: MemberService,
    private modalService: NgbModal,
    private authenticationSharedService: AuthenticationSharedService,
    private commercialUsageService: CommercialUsageService
  ) { }


  ngOnInit(): void {
    this.authenticationSharedService.getAccountDetails();
    this.loadApplication();
    this.initForm();
  }

  private loadApplication(): void {
    this.userRegistrationService.getApplication()
      .pipe(
        catchError(error => {
          this.handleError(error);
          return of(null);
        })
      )
      .subscribe({
        next: (data: any) => this.handleApplicationData(data),
        error: (error: any) => this.handleError(error)
      });
  }

  private handleApplicationData(data: any): void {
    this.applicationData = data;
    this.commercialUsageReport = data.commercialUsage;
    this.approvalState = data.approvalState;
    this.applicationId = data.applicationId;
    this.memberKey = data.member.key;
    this.loadCountries();
    this.organizationTypes = this.applicationUtilsService.getOrganizationTypes();
    this.setupTypeChangeSubscription();
    this.updateForm();
    this.isSameAddress = this.checkAddresses(
      this.applicationData.affiliateDetails.address,
      this.applicationData.affiliateDetails.billingAddress
    );
    this.isAffiliateLoaded = true;
    if (!this.applicationUtilsService.isApplicationWaitingForApplicant(data)) {
      this.router.navigate(['/userDashboard']);
    }
  }

  checkAddresses(a: { street?: string; city?: string; country?: any }, b: { street?: string; city?: string; country?: any }): boolean {
    if (!a || !b) return false;

    return (
      (a.street?.trim() === b.street?.trim()) &&
      (a.city?.trim() === b.city?.trim()) &&
      (a.country?.commonName?.trim() === b.country?.commonName?.trim())
    );
  }

  loadCountries() {
    this.countryService.getCountries()
      .pipe(
        catchError(error => {
          this.handleError(error);
          return of([]);
        })
      )
      .subscribe({
        next: (data: any) => {
          this.availableCountries = data;
          this.copyAddressMember();
        },
        error: (error: any) => this.handleError(error)
      });
  }

  copyAddressMember(): void {
    this.countriesUsingMLDS = this.countryService.getCountriesUsingMLDS();
    if (this.memberKey && Array.isArray(this.countriesUsingMLDS)) {
      this.billingHide = this.countriesUsingMLDS.includes(this.memberKey);
      this.addressOverride = this.billingHide;
    }
    if (this.billingHide) {
      this.setAgreementType('AFFILIATE_NORMAL');
    }
  }

  initForm() {
    this.affiliateApplicationForm = this.fb.group({
      type: ['', Validators.required],
      subType: ['', Validators.required],
      otherText: ['', Validators.maxLength(255)],
      agreementType: ['', Validators.required],
      alternateEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)], [this.uniqueEmailValidator('alternateEmail')]],
      thirdEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)], [this.uniqueEmailValidator('thirdEmail')]],
      contactPhone: ['', [Validators.required, Validators.maxLength(25)]],
      contactExtension: ['', Validators.maxLength(255)],
      mobilePhone: ['', [Validators.required, Validators.maxLength(25)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(255)]],
      postalCode: ['', [Validators.required, Validators.maxLength(25)]],
      isSameAddress: [false],
      billingAddress: ['', [Validators.required, Validators.maxLength(255)]],
      billingCity: ['', [Validators.required, Validators.maxLength(255)]],
      billingPostCode: ['', [Validators.required, Validators.maxLength(25)]],
      billingCountry: ['', Validators.required],
      organizationName: ['', [Validators.required, Validators.maxLength(255)]],
      organizationType: ['', Validators.required],
      organizationTypeOther: ['', [Validators.required]],
      otherTextArea: [''],
      snoMedTC: [false, Validators.requiredTrue]
    })
  }

  private setupTypeChangeSubscription(): void {
    this.typeSubscription = this.affiliateApplicationForm.get('type')?.valueChanges.subscribe(newValue => {
      this.onTypeChange(newValue);
    }) ?? new Subscription();
  }

  private onTypeChange(newValue: string): void {
    const oldValue = this.affiliateApplicationForm.get('type')?.value;

    if (oldValue && this.isAffiliateLoaded) {
      this.affiliateApplicationForm.patchValue({
        subType: '',
        otherText: ''
      }, { emitEvent: false });
      this.updateValidations();
      this.saveApplication();
    }
  }


  updateValidations() {
    const affiliateType = this.affiliateApplicationForm.get('type')?.value;
    const subTypeControl = this.affiliateApplicationForm?.get('subType');
    const otherTextControl = this.affiliateApplicationForm?.get('otherText');
    const thirdEmailControl = this.affiliateApplicationForm?.get('thirdEmail');
    const mobilePhoneControl = this.affiliateApplicationForm?.get('mobilePhone');
    const organizationNameControl = this.affiliateApplicationForm?.get('organizationName');
    const organizationTypeControl = this.affiliateApplicationForm?.get('organizationType');
    const organizationTypeOtherControl = this.affiliateApplicationForm?.get('organizationTypeOther');

    if (affiliateType == 'INDIVIDUAL') {
      thirdEmailControl?.setValidators([Validators.email, Validators.maxLength(100)]);
      mobilePhoneControl?.setValidators([Validators.maxLength(25)]);
      organizationNameControl?.setValidators([Validators.maxLength(255)]);
      organizationTypeControl?.clearValidators();
      otherTextControl?.clearValidators();
      organizationTypeOtherControl?.setValidators([Validators.maxLength(255)]);
    }
    else {
      if (affiliateType === 'OTHER') {
        subTypeControl?.clearValidators();
        otherTextControl?.setValidators([Validators.required, Validators.maxLength(255)]);
      }
      else {
        otherTextControl?.clearValidators();
        subTypeControl?.setValidators([Validators.required]);
      }
      thirdEmailControl?.setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
      mobilePhoneControl?.setValidators([Validators.required, Validators.maxLength(25)]);
      organizationNameControl?.setValidators([Validators.required, Validators.maxLength(255)]);
      organizationTypeControl?.setValidators([Validators.required]);
      organizationTypeOtherControl?.setValidators([Validators.maxLength(255)]);
    }

    subTypeControl?.updateValueAndValidity();
    otherTextControl?.updateValueAndValidity();
    mobilePhoneControl?.updateValueAndValidity();
    thirdEmailControl?.updateValueAndValidity();
    organizationNameControl?.updateValueAndValidity();
    organizationTypeControl?.updateValueAndValidity();
    organizationTypeOtherControl?.updateValueAndValidity();
  }


  updateForm(): void {
    const affiliateDetails = this.getAffiliateDetails();
    const billingAddress = this.getBillingAddress(affiliateDetails);
    const address = this.getAddress(affiliateDetails);
    const otherData = this.getOtherData();
  
    this.affiliateApplicationForm.patchValue({
      ...affiliateDetails,
      ...this.mapAddress(address),
      isSameAddress: this.isSameAddress,
      ...this.mapBillingAddress(billingAddress),
      ...otherData,
    });
  
    this.updateValidations();
  }
  
  private getAffiliateDetails(): any {
    const affiliateDetails = this.applicationData?.affiliateDetails || {};
    return {
      type: affiliateDetails.type || '',
      subType: affiliateDetails.subType || '',
      otherText: affiliateDetails.otherText || '',
      agreementType: affiliateDetails.agreementType || '',
      alternateEmail: affiliateDetails.alternateEmail || '',
      thirdEmail: affiliateDetails.thirdEmail || '',
      contactPhone: affiliateDetails.landlineNumber || '',
      contactExtension: affiliateDetails.landlineExtension || '',
      mobilePhone: affiliateDetails.mobileNumber || '',
      organizationName: affiliateDetails.organizationName || '',
      organizationType: affiliateDetails.organizationType || '',
      organizationTypeOther: affiliateDetails.organizationTypeOther || '',
    };
  }
  
  private getBillingAddress(affiliateDetails: any): any {
    return affiliateDetails?.billingAddress || {};
  }
  
  private getAddress(affiliateDetails: any): any {
    return affiliateDetails?.address || {};
  }
  
  private getOtherData(): any {
    const otherData = this.applicationData?.other || {};
    return {
      otherTextArea: otherData.textArea || '',
    };
  }
  
  
  private mapAddress(address: any): any {
    return {
      address: address.street || '',
      city: address.city || '',
      postalCode: address.post || '',
    };
  }
  
  private mapBillingAddress(billingAddress: any): any {
    return {
      billingAddress: billingAddress.street || '',
      billingCity: billingAddress.city || '',
      billingPostCode: billingAddress.post || '',
      billingCountry: billingAddress.country || '',
    };
  }
  

  autoSubmit() {
    this.saveApplication();
  }

  private saveApplication(): void {
    this.applicationData.type = this.affiliateApplicationForm.get('type')?.value;
    this.applicationData.subType = this.affiliateApplicationForm.get('subType')?.value;
    this.applicationData.otherText = this.affiliateApplicationForm.get('otherText')?.value;
    this.applicationData.affiliateDetails.agreementType = this.affiliateApplicationForm.get('agreementType')?.value;
    this.applicationData.affiliateDetails.alternateEmail = this.affiliateApplicationForm.get('alternateEmail')?.value;
    this.applicationData.affiliateDetails.thirdEmail = this.affiliateApplicationForm.get('thirdEmail')?.value;
    this.applicationData.affiliateDetails.landlineNumber = this.extractPhoneNumber(this.affiliateApplicationForm.get('contactPhone')?.value);
    this.applicationData.affiliateDetails.landlineExtension = this.affiliateApplicationForm.get('contactExtension')?.value;
    this.applicationData.affiliateDetails.mobileNumber = this.extractPhoneNumber(this.affiliateApplicationForm.get('mobilePhone')?.value);
    if (this.applicationData.affiliateDetails.address) {
      this.applicationData.affiliateDetails.address.street = this.affiliateApplicationForm.get('address')?.value;
      this.applicationData.affiliateDetails.address.city = this.affiliateApplicationForm.get('city')?.value;
      this.applicationData.affiliateDetails.address.post = this.affiliateApplicationForm.get('postalCode')?.value;
    }
    if (!this.applicationData.affiliateDetails.billingAddress) {
      this.applicationData.affiliateDetails.billingAddress = {
        street: '',
        city: '',
        post: '',
        country: ''
      };
    }
    if (this.applicationData.affiliateDetails.billingAddress) {
      this.applicationData.affiliateDetails.billingAddress.street = this.affiliateApplicationForm.get('billingAddress')?.value;
      this.applicationData.affiliateDetails.billingAddress.city = this.affiliateApplicationForm.get('billingCity')?.value;
      this.applicationData.affiliateDetails.billingAddress.post = this.affiliateApplicationForm.get('billingPostCode')?.value;
      this.applicationData.affiliateDetails.billingAddress.country = this.affiliateApplicationForm.get('billingCountry')?.value;
    }

    this.applicationData.affiliateDetails.organizationName = this.affiliateApplicationForm.get('organizationName')?.value;
    this.applicationData.affiliateDetails.organizationType = this.affiliateApplicationForm.get('organizationType')?.value;
    this.applicationData.affiliateDetails.organizationTypeOther = this.affiliateApplicationForm.get('organizationTypeOther')?.value;
    this.applicationData.commercialUsage.type = this.affiliateApplicationForm.get('type')?.value;
    this.copyAddress();
    this.userRegistrationService.saveApplication(this.applicationData, this.applicationId)
      .pipe(
        catchError(error => {
          this.handleError(error);
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
        },
        error: (error: any) => {
          this.handleError(error);
        }
      });
  }

  updateUsageContext(result: any) {
    if (!this.applicationData.commercialUsage.context) {
      this.applicationData.commercialUsage.context = {};
    }
    this.applicationData.commercialUsage.context.currentUsage = result.currentUsage;
    this.applicationData.commercialUsage.context.plannedUsage = result.plannedUsage;
    this.applicationData.commercialUsage.context.purpose = result.purpose;
    this.applicationData.commercialUsage.context.otherActivities = result.otherActivities;
    this.applicationData.commercialUsage.context.implementationStatus = result.implementationStatus;
  }

  private handleError(error: any): void {
    console.error('Error fetching application data', error);
  }

  submit() {
    this.submitAttempted = true;
    this.saveApplication();
    if (!this.affiliateApplicationForm.valid) {
      return;
    }

    const modalRef = this.modalService.open(AffiliateRegistrationReviewComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.affiliateform = this.affiliateApplicationForm.value;
    modalRef.componentInstance.affiliate = this.applicationData;
    modalRef.componentInstance.billingHide = this.billingHide;

    modalRef.result.then(
      (result) => {
        if (result !== 'submit') {
          this.updateUsageContext(result);
          this.finalSubmission();
        }
      },
      (reason) => {
       
      }
    );
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      startWith(''),
      map(term => (term === '' ? []
        : this.availableCountries
          .filter(country => country.commonName.toLowerCase().includes(term.toLowerCase()))
          .slice(0, 8)
      ))
    );

  formatCountry = (country: any) => country.commonName;


  uniqueEmailValidator(currentField: string): AsyncValidatorFn {
    return (control: any): Observable<{ [key: string]: any } | null> => {
      if (!control.value) {
        return of(null);
      }
      const currentValue = control.value;
      const email = this.applicationData.affiliateDetails.email;
      const alternateEmail = this.affiliateApplicationForm.get('alternateEmail')?.value;
      const thirdEmail = this.affiliateApplicationForm.get('thirdEmail')?.value;
      let existingEmails: string[] = [];
      if (currentField === 'email') {
        existingEmails = [alternateEmail, thirdEmail];
      } else if (currentField === 'alternateEmail') {
        existingEmails = [email, thirdEmail];
      } else if (currentField === 'thirdEmail') {
        existingEmails = [email, alternateEmail];
      }
      const isUnique = !existingEmails.includes(currentValue);
      return of(isUnique ? null : { notUnique: true });
    };
  }

  private extractPhoneNumber(phoneNumber: any): string {
    return phoneNumber && typeof phoneNumber === 'object' ? phoneNumber.internationalNumber : phoneNumber;
  }

  ngOnDestroy(): void {
    this.typeSubscription.unsubscribe();
  }




  copyAddress(): void {
    const isSameAddress = this.affiliateApplicationForm.get('isSameAddress')?.value || this.addressOverride;


    if (isSameAddress) {
      this.affiliateApplicationForm.patchValue({
        billingAddress: this.affiliateApplicationForm.get('address')?.value,
        billingCity: this.affiliateApplicationForm.get('city')?.value,
        billingPostCode: this.affiliateApplicationForm.get('postalCode')?.value,
        billingCountry: this.applicationData.affiliateDetails.address.country,
      });

      this.setBillingFieldsDisabled(true);
    } else {
      this.setBillingFieldsDisabled(false);
    }
  }

  private setBillingFieldsDisabled(disabled: boolean): void {
    const action = disabled ? 'disable' : 'enable';
    this.affiliateApplicationForm.get('billingAddress')?.[action]();
    this.affiliateApplicationForm.get('billingCity')?.[action]();
    this.affiliateApplicationForm.get('billingPostCode')?.[action]();
    this.affiliateApplicationForm.get('billingCountry')?.[action]();
  }

  private setAgreementType(type: string): void {
    this.affiliateApplicationForm.get('agreementType')?.setValue(type);
  }

  viewLicense(): void {
    const countryMemberKey = this.applicationData.affiliateDetails.address.country.member.key;
    this.memberService.getMemberLicense(countryMemberKey).subscribe({
      next: (response: string) => {
        window.open(response, '_blank', 'noopener');
      },
      error: (error: any) => {
        console.error('Error fetching license:', error);
      }
    });
  }

  private finalSubmission(): void {
    const commercialUsageId = this.applicationData.commercialUsage?.commercialUsageId;
    this.fetchReportAndSubmit(commercialUsageId);
  }

  private fetchReportAndSubmit(commercialUsageId: string): void {
    this.commercialUsageService.getUsageReport(commercialUsageId).subscribe({
      next: (result) => this.updateReportAndSubmit(result),
      error: (error) => console.error('Error fetching usage report:', error)
    });
  }

  private updateReportAndSubmit(result: any): void {
    this.applicationData.commercialUsage = result;
    this.applicationData.commercialUsage.type = this.affiliateApplicationForm.get('type')?.value;
    const finalFormData = this.applicationData;
    this.userRegistrationService.submitApplication(finalFormData, finalFormData.applicationId).subscribe({
      next: () => this.handleSuccess(),
      error: (error) => this.handleSubmitError(error)
    });
  }

  private handleSuccess(): void {
    this.router.navigate(['/userDashboard']);
  }

  private handleSubmitError(error: any): void {
    console.error('Error submitting application:', error);
  }
  onAffiliateTypeUpdated(event: any) {
    const newType = event.target.value;
    const updatedCommercialUsageReport = { ...this.commercialUsageReport };
    updatedCommercialUsageReport.type = newType;
    this.commercialUsageReport = updatedCommercialUsageReport;
  
    this.commercialUsageService.updateUsageReportType(this.commercialUsageReport)
      .subscribe({next:
        (response: any) => {
          
        },
        error:(error: any) => {
          console.error('Failed to update usage type', error);
        }
  });
  }
  

}
