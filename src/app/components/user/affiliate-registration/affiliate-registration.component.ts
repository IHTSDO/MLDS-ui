import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {  CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
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
import { phoneRequiredValidator } from 'src/app/validators/phone-number.validator';

@Component({
    selector: 'app-affiliate-registration',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, EmbeddableUsageLogComponent, TranslateModule, CompareTextPipe, NgxIntlTelInputModule],
    templateUrl: './affiliate-registration.component.html',
    styleUrl: './affiliate-registration.component.scss'
})
export class AffiliateRegistrationComponent implements OnInit {

  @ViewChild(EmbeddableUsageLogComponent) usageLogComponent!: EmbeddableUsageLogComponent;

  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  separateDialCode = false;
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
    if (this.commercialUsageReport && !this.commercialUsageReport.type) {
      this.commercialUsageReport.type = data.type || data.affiliateDetails?.type || '';
    }
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
      alternateEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100), this.uniqueEmailValidator('alternateEmail')]],
      thirdEmail: ['', [Validators.email, Validators.maxLength(100), this.uniqueEmailValidator('thirdEmail')]],
      contactPhone: ['', [phoneRequiredValidator(), Validators.maxLength(25)]],
      contactExtension: ['', Validators.maxLength(255)],
      mobilePhone: ['', [phoneRequiredValidator(), Validators.maxLength(25)]],
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
      organizationTypeOther: ['', [Validators.maxLength(255)]],
      otherTextArea: [''],
      snoMedTC: [false, Validators.requiredTrue]
    })
  }

  private setupTypeChangeSubscription(): void {
    const typeSub = this.affiliateApplicationForm.get('type')?.valueChanges.subscribe(newValue => {
      if (this.commercialUsageReport && newValue) {
        this.commercialUsageReport = {
          ...this.commercialUsageReport,
          type: newValue
        };
      }
      this.onTypeChange(newValue);
    });
    const orgTypeSub = this.affiliateApplicationForm.get('organizationType')?.valueChanges.subscribe(() => {
      this.updateValidations();
    });
    if (typeSub) this.typeSubscription.add(typeSub);
    if (orgTypeSub) this.typeSubscription.add(orgTypeSub);
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
    const orgType = this.affiliateApplicationForm.get('organizationType')?.value;
    const subTypeControl = this.affiliateApplicationForm?.get('subType');
    const otherTextControl = this.affiliateApplicationForm?.get('otherText');
    const alternateEmailControl = this.affiliateApplicationForm?.get('alternateEmail');
    const thirdEmailControl = this.affiliateApplicationForm?.get('thirdEmail');
    const contactPhoneControl = this.affiliateApplicationForm?.get('contactPhone');
    const mobilePhoneControl = this.affiliateApplicationForm?.get('mobilePhone');
    const organizationNameControl = this.affiliateApplicationForm?.get('organizationName');
    const organizationTypeControl = this.affiliateApplicationForm?.get('organizationType');
    const organizationTypeOtherControl = this.affiliateApplicationForm?.get('organizationTypeOther');

    contactPhoneControl?.setValidators([phoneRequiredValidator(), Validators.maxLength(25)]);

    alternateEmailControl?.setValidators([Validators.required, Validators.email, Validators.maxLength(100), this.uniqueEmailValidator('alternateEmail')]);
    alternateEmailControl?.clearAsyncValidators();

    thirdEmailControl?.setValidators([Validators.email, Validators.maxLength(100), this.uniqueEmailValidator('thirdEmail')]);
    thirdEmailControl?.clearAsyncValidators();

    if (affiliateType == 'INDIVIDUAL') {
      mobilePhoneControl?.setValidators([Validators.maxLength(25)]);
      organizationNameControl?.setValidators([Validators.maxLength(255)]);
      organizationTypeControl?.clearValidators();
      otherTextControl?.clearValidators();
      organizationTypeOtherControl?.clearValidators();
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
      mobilePhoneControl?.setValidators([phoneRequiredValidator(), Validators.maxLength(25)]);
      organizationNameControl?.setValidators([Validators.required, Validators.maxLength(255)]);
      organizationTypeControl?.setValidators([Validators.required]);
      if (orgType === 'OTHER') {
        organizationTypeOtherControl?.setValidators([Validators.required, Validators.maxLength(255)]);
      } else {
        organizationTypeOtherControl?.clearValidators();
      }
    }

    subTypeControl?.updateValueAndValidity();
    otherTextControl?.updateValueAndValidity();
    contactPhoneControl?.updateValueAndValidity();
    mobilePhoneControl?.updateValueAndValidity();
    alternateEmailControl?.updateValueAndValidity();
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
      type: this.applicationData?.type || this.applicationData?.commercialUsage?.type || affiliateDetails.type || '',
      subType: this.applicationData?.subType || affiliateDetails.subType || '',
      otherText: this.applicationData?.otherText || affiliateDetails.otherText || '',
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
    if (!this.applicationData.other) {
      this.applicationData.other = {};
    }
    this.applicationData.other.textArea = this.affiliateApplicationForm.get('otherTextArea')?.value;
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
    this.affiliateApplicationForm.markAllAsTouched();
    if (this.usageLogComponent?.usageForm) {
      this.usageLogComponent.usageForm.markAllAsTouched();
      this.usageLogComponent.autoSubmit();
      if (this.usageLogComponent.usageForm.value) {
        this.updateUsageContext(this.usageLogComponent.usageForm.value);
      }
    }
    this.saveApplication();

    const isUsageValid = !this.usageLogComponent?.usageForm || this.usageLogComponent.usageForm.valid;
    if (!this.affiliateApplicationForm.valid || !isUsageValid) {
      console.warn('Form submission prevented due to validation errors:');
      console.warn('affiliateApplicationForm valid:', this.affiliateApplicationForm.valid, 'status:', this.affiliateApplicationForm.status);
      console.warn('isUsageValid:', isUsageValid);
      Object.keys(this.affiliateApplicationForm.controls).forEach(key => {
        const ctrl = this.affiliateApplicationForm.get(key);
        if (ctrl && !ctrl.valid) {
          console.warn(`Invalid control "${key}":`, 'status:', ctrl.status, 'errors:', ctrl.errors, 'value:', ctrl.value);
        }
      });
      return;
    }

    const modalRef = this.modalService.open(AffiliateRegistrationReviewComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.affiliateform = this.affiliateApplicationForm.getRawValue();
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


  uniqueEmailValidator(currentField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val = control.value;
      if (!val || (typeof val === 'string' && !val.trim())) {
        return null;
      }
      const currentValue = val.toString().trim().toLowerCase();
      const email = this.applicationData?.affiliateDetails?.email?.trim().toLowerCase();
      const alternateEmail = this.affiliateApplicationForm?.get('alternateEmail')?.value?.toString().trim().toLowerCase();
      const thirdEmail = this.affiliateApplicationForm?.get('thirdEmail')?.value?.toString().trim().toLowerCase();
      let existingEmails: string[] = [];
      if (currentField === 'email') {
        existingEmails = [alternateEmail, thirdEmail].filter(e => !!e);
      } else if (currentField === 'alternateEmail') {
        existingEmails = [email, thirdEmail].filter(e => !!e);
      } else if (currentField === 'thirdEmail') {
        existingEmails = [email, alternateEmail].filter(e => !!e);
      }
      const isUnique = !existingEmails.includes(currentValue);
      return isUnique ? null : { notUnique: true };
    };
  }

  private extractPhoneNumber(phoneNumber: any): string {
    if (!phoneNumber) {
      return '';
    }
    if (typeof phoneNumber === 'object') {
      const nationalDigits = (phoneNumber.nationalNumber || '').toString().replace(/\D/g, '');
      if (nationalDigits.length > 0) {
        return phoneNumber.internationalNumber || phoneNumber.number || '';
      }
      const num = (phoneNumber.internationalNumber || phoneNumber.number || '').toString();
      const digitsOnly = num.replace(/\D/g, '');
      const dialCodeDigits = (phoneNumber.dialCode || '').toString().replace(/\D/g, '');
      if (!digitsOnly || (dialCodeDigits && digitsOnly === dialCodeDigits) || (num.trim().startsWith('+') && digitsOnly.length <= 4)) {
        return '';
      }
      return num;
    }
    if (typeof phoneNumber === 'string') {
      const trimmed = phoneNumber.trim();
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (!digitsOnly || (trimmed.startsWith('+') && digitsOnly.length <= 4)) {
        return '';
      }
      return trimmed;
    }
    return phoneNumber;
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
    const latestContext = this.applicationData.commercialUsage?.context;
    this.applicationData.commercialUsage = result;
    this.applicationData.commercialUsage.type = this.affiliateApplicationForm.get('type')?.value;
    if (latestContext) {
      this.applicationData.commercialUsage.context = {
        ...(result.context || {}),
        ...latestContext
      };
    }
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
    const updatedCommercialUsageReport = { ...this.commercialUsageReport, type: newType };
    this.commercialUsageReport = updatedCommercialUsageReport;
  
    if (this.commercialUsageReport?.commercialUsageId && newType) {
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

  onCountryChange(event: any): void {
  }

  onCountryChangeM(event: any): void {
  }
  

}
