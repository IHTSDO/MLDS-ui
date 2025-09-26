import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import {  CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { CountryService } from 'src/app/services/country/country.service';
import { map, Observable, of, startWith } from 'rxjs';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from "../loader/loader.component";


@Component({
    selector: 'app-contact-info',
    imports: [CommonModule, ReactiveFormsModule, NgbModule, CompareTextPipe, TranslateModule, LoaderComponent, NgxIntlTelInputModule],
    templateUrl: './contact-info.component.html',
    styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent implements OnInit {

	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  separateDialCode = false;

  affiliateId: any;
  affiliate: any = null;
  approved: boolean = false;
  isAdmin: boolean = false;
  isStaffOrAdmin: boolean = false;
  isEditable: boolean = false;
  form: FormGroup;
  formSubmitted: boolean = false;
  readOnly: boolean = false;
  isSameAddress: boolean = false;
  availableCountries: any[] = [];
  includeDialCode = true;
  isLoading: boolean = true;
  agreementTypeOptions: string[] = ['AFFILIATE_NORMAL', 'AFFILIATE_RESEARCH', 'AFFILIATE_PUBLIC_GOOD'];
  countriesUsingMLDS: string[] = [];
  billingHide: boolean = false;
  addressOverride: boolean = false;
  public alerts: any[] = [];


  constructor(private applicationUtilsService: ApplicationUtilsService, private authenticationService: AuthenticationSharedService, private route: ActivatedRoute, private fb: FormBuilder, private affiliateService: AffiliateService
    , private countryService: CountryService,private router: Router
  ) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      otherText: [''],
      subType: [''],
      agreementType: ['', Validators.required],
      acceptNotifications: [false],
      countryNotificationsOnly: [{ value: false, disabled: this.readOnly }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.uniqueEmailValidator('email')]],
      alternateEmail: ['', [Validators.email], [this.uniqueEmailValidator('alternateEmail')]],
      thirdEmail: ['', [Validators.email], [this.uniqueEmailValidator('thirdEmail')]],
      landlineNumber: [''],
      landlineExtension: [''],
      mobileNumber: [''],
      addressStreetIndividual: [''],
      addressCityIndividual: [''],
      addressPostIndividual: [''],
      billingAddressStreet: [''],
      billingAddressCity: [''],
      billingAddressPost: [''],
      billingAddressCountry: [''],
      organizationName: [''],
      addressStreet: [''],
      addressCity: [''],
      addressPost: [''],
      use: [false]
    });



    this.form.get('type')?.valueChanges.subscribe(type => {
      const alternateEmailControl = this.form.get('alternateEmail');
      const otherTextControl = this.form.get('otherText');
      const mobileNumberControl = this.form.get('mobileNumber');
      const addressStreetIndividualControl = this.form.get('addressStreetIndividual');
      const addressCityIndividualControl = this.form.get('addressCityIndividual');
      const addressPostIndividualControl = this.form.get('addressPostIndividual');
      const billingAddressStreetControl = this.form.get('billingAddressStreet');
      const billingAddressCityControl = this.form.get('billingAddressCity');
      const billingAddressPostControl = this.form.get('billingAddressPost');
      const billingAddressCountryControl = this.form.get('billingAddressCountry');
      const organizationNameControl = this.form.get('organizationName');
      const addressStreetControl = this.form.get('addressStreet');
      const addressCityControl = this.form.get('addressCity');
      const addressPostControl = this.form.get('addressPost');

      if (type === 'OTHER') {
        otherTextControl?.setValidators(Validators.required);
      } else {
        otherTextControl?.clearValidators();
      }
  
      if (type === 'INDIVIDUAL') {
        alternateEmailControl?.setValidators([Validators.email]);
        addressStreetIndividualControl?.setValidators([Validators.required]);
        addressCityIndividualControl?.setValidators([Validators.required]);
        addressPostIndividualControl?.setValidators([Validators.required,Validators.pattern(/^\+?[a-zA-Z0-9\s]{1,25}$/)]);
        billingAddressStreetControl?.setValidators([Validators.required]);
        billingAddressCityControl?.setValidators([Validators.required]);
        billingAddressPostControl?.setValidators([Validators.required,Validators.pattern(/^\+?[a-zA-Z0-9\s]{1,25}$/)]);
        billingAddressCountryControl?.setValidators([Validators.required]);
        mobileNumberControl?.setValidators([this.mobileNumberValidator()]);
      } else {
        alternateEmailControl?.setValidators([Validators.email,Validators.required]);
        mobileNumberControl?.setValidators([Validators.required, this.mobileNumberValidator()]);
        addressStreetIndividualControl?.clearValidators();  
        addressCityIndividualControl?.clearValidators();
        addressPostIndividualControl?.setValidators([Validators.pattern(/^\+?[a-zA-Z0-9\s]{0,25}$/)]);
        billingAddressStreetControl?.setValidators([Validators.required]);
        billingAddressCityControl?.setValidators([Validators.required]);
        billingAddressPostControl?.setValidators([Validators.required,Validators.pattern(/^\+?[a-zA-Z0-9\s]{1,25}$/)]);
        billingAddressCountryControl?.setValidators([Validators.required]);
        organizationNameControl?.setValidators([Validators.required]);
        addressStreetControl?.setValidators([Validators.required]);
        addressCityControl?.setValidators([Validators.required]);
        addressPostControl?.setValidators([Validators.required,Validators.pattern(/^\+?[a-zA-Z0-9\s]{1,25}$/)]);
      }
  
      otherTextControl?.updateValueAndValidity();
      alternateEmailControl?.updateValueAndValidity();
      mobileNumberControl?.updateValueAndValidity();
      addressStreetIndividualControl?.updateValueAndValidity();
      addressCityIndividualControl?.updateValueAndValidity();
      addressPostIndividualControl?.updateValueAndValidity();
      billingAddressStreetControl?.updateValueAndValidity();
      billingAddressCityControl?.updateValueAndValidity();
      billingAddressPostControl?.updateValueAndValidity();
      billingAddressCountryControl?.updateValueAndValidity();
      organizationNameControl?.updateValueAndValidity();
      addressStreetControl?.updateValueAndValidity();
      addressCityControl?.updateValueAndValidity();
    });
    
  }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.isStaffOrAdmin = this.authenticationService.isStaffOrAdmin();
  
      this.countryService.getCountries().subscribe(countries => {
        this.availableCountries = countries;
      });
  
      // Attempt to get the affiliate ID from route parameters
      const routeAffiliateId = this.route.snapshot.paramMap.get('affiliateId');
      if (routeAffiliateId) {
        this.affiliateId = +routeAffiliateId; // Convert to number if needed
        this.loadAffiliate();
      } else {
        this.affiliateService.myAffiliate().subscribe({
          next: (response) => {
            
            // Assuming `response` is an array of objects
            if (response) {
              this.affiliateId = response[0].affiliateId;
              this.affiliate = response[0];
              this.approved = this.applicationUtilsService?.isApplicationApproved(this.affiliate?.application);
              this.readOnly = !this.applicationUtilsService?.isApplicationApproved(this.affiliate?.application);
              this.updateForm();
              // this.updateAddressStatus();
              this.countriesUsingMLDS = this.countryService.getCountriesUsingMLDS();
       
              if (this.affiliate?.application?.member?.key && Array.isArray(this.countriesUsingMLDS)) {
                this.billingHide = this.countriesUsingMLDS.includes(this.affiliate?.application?.member?.key);
                this.addressOverride = this.billingHide;
              }
              this.isLoading = false;
            } else {
              console.log('No affiliate data found');
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error fetching affiliate data:', err);
          }
        });
        
      }
    }
  }
  
  private loadAffiliate(): void {
    if (this.affiliateId) {
      this.fetchAffiliateById(this.affiliateId);
    }
  }

  private fetchAffiliateById(affiliateId: string): void {
    this.affiliateService?.affiliate(affiliateId).subscribe({
      next: data => {
        this.affiliate = data;
        this.approved = this.applicationUtilsService?.isApplicationApproved(this.affiliate?.application);
        const userDetails = this.authenticationService?.getUserDetails();
        this.isEditable = this.isAdmin || (userDetails?.member?.['key'] === this.affiliate?.application?.member?.key);
        this.readOnly = !this.applicationUtilsService?.isApplicationApproved(this.affiliate?.application);
        this.updateForm();
        // this.updateAddressStatus();
      }
    });

  }


  updateAddressStatus(): void {
    if (this.checkAddresses(this.affiliate?.affiliateDetails?.address, this.affiliate?.affiliateDetails?.billingAddress)) {
      this.isSameAddress = true;
    } else {
      this.isSameAddress = false;
    }
  }

  uniqueEmailValidator(currentField: string): AsyncValidatorFn {
    return (control: any): Observable<{ [key: string]: any } | null> => {
      if (!control.value) {
        return of(null); 
      }
      const currentValue = control.value;
      const email = this.form.get('email')?.value;
      const alternateEmail = this.form.get('alternateEmail')?.value;
      const thirdEmail = this.form.get('thirdEmail')?.value;
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
 
  checkAddresses(a: any, b: any): boolean {
    if (
      a && b &&
      a.street?.trim() !== '' && a.street?.trim() === b.street?.trim() &&
      a.city?.trim() !== '' && a.city?.trim() === b.city?.trim() &&
      a.country?.isoCode2?.trim() !== '' && a.country?.isoCode2 === b.country?.isoCode2
    ) {
      return true;
    }
    return false;
  }  


  updateForm(): void {
  if (!this.affiliate?.affiliateDetails) return;

  this.patchBasicDetails();
  this.patchAddressDetails();
  this.patchBillingAddressDetails();

  this.updateReadOnly();
}

private patchBasicDetails(): void {
  const details = this.affiliate?.affiliateDetails;

  this.form.patchValue({
    type: details.type || '',
    otherText: details.otherText || '',
    subType: details?.subType || '',
    agreementType: details?.agreementType || '',
    acceptNotifications: details?.acceptNotifications ?? false,
    countryNotificationsOnly: details?.countryNotificationsOnly ?? false,
    firstName: details?.firstName || '',
    lastName: details?.lastName || '',
    email: details?.email || '',
    alternateEmail: details?.alternateEmail || '',
    thirdEmail: details?.thirdEmail || '',
    landlineNumber: details?.landlineNumber || '',
    landlineExtension: details?.landlineExtension || '',
    mobileNumber: details?.mobileNumber || ''
  });

  if (this.readOnly) {
    this.form.get('firstName')?.disable();
    this.form.get('lastName')?.disable();
    this.form.get('alternateEmail')?.disable();
    this.form.get('thirdEmail')?.disable();
    this.form.get('landlineNumber')?.disable();
    this.form.get('mobileNumber')?.disable();
    this.form.get('landlineExtension')?.disable();
    this.form.get('use')?.disable();
  }
}

private patchAddressDetails(): void {
  const address = this.affiliate?.affiliateDetails?.address || {};

  this.form.patchValue({
    addressStreetIndividual: address?.street || '',
    addressCityIndividual: address?.city || '',
    addressPostIndividual: address?.post || '',
    addressStreet: address?.street || '',
    addressCity: address?.city || '',
    addressPost: address?.post || ''
  });

  if (this.readOnly) {
    this.form.get('addressStreetIndividual')?.disable();
    this.form.get('addressCityIndividual')?.disable();
    this.form.get('addressPostIndividual')?.disable();
    this.form.get('addressStreet')?.disable();
    this.form.get('addressCity')?.disable();
    this.form.get('addressPost')?.disable();
  }
}

private patchBillingAddressDetails(): void {
  const billingAddress = this.affiliate?.affiliateDetails?.billingAddress || {};

  this.form.patchValue({
    billingAddressStreet: billingAddress?.street || '',
    billingAddressCity: billingAddress?.city || '',
    billingAddressPost: billingAddress?.post || '',
    billingAddressCountry: billingAddress?.country || '',
    organizationName: this.affiliate?.affiliateDetails?.organizationName || ''
  });

  if (this.readOnly) {
    this.form.get('billingAddressStreet')?.disable();
    this.form.get('billingAddressCity')?.disable();
    this.form.get('addressPostIndividual')?.disable();
    this.form.get('billingAddressPost')?.disable();
    this.form.get('billingAddressCountry')?.disable();
    this.form.get('organizationName')?.disable();
  }
}


  updateReadOnly(){
    if (this.readOnly) {
      this.form.get('countryNotificationsOnly')?.disable();
      this.form.get('agreementType')?.disable();
      this.form.get('acceptNotifications')?.disable();
    } else {
      this.form.get('countryNotificationsOnly')?.enable();
      this.form.get('acceptNotifications')?.enable();
    }
  }

  onTypeChange(): void {
    const typeValue = this.form.get('type')?.value;
    if (typeValue !== 'OTHER') {
      this.form.get('otherText')?.setValue('');
    }
    if (typeValue === 'OTHER' && this.formSubmitted) {
      this.affiliate.affiliateDetails.subType = null;
    }
  }

  get type() {
    return this.form.get('type');
  }

  get otherText() {
    return this.form.get('otherText');
  }

  get acceptNotifications() {
    return this.form.get('acceptNotifications');
  }

  get countryNotificationsOnly() {
    return this.form.get('countryNotificationsOnly');
  }


  onSubmit(): void {
    const formValues = this.processFormValues();
    this.affiliate = this.transformFormToAffiliate(formValues);
    this.formSubmitted = true;
    this.updateAffiliateDetails(formValues);
  }

  private processFormValues(): any {
    const formValues = { ...this.form.value };
  
    formValues.landlineNumber = this.extractPhoneNumber(formValues.landlineNumber);
    formValues.mobileNumber = this.extractPhoneNumber(formValues.mobileNumber);
    this.updateAddress(formValues);
    this.updateBillingAddress(formValues);
    return formValues;
  }

  private extractPhoneNumber(phoneNumber: any): string {
    return phoneNumber && typeof phoneNumber === 'object' ? phoneNumber.number : phoneNumber;
  }

  private updateAddress(formValues: any): void {
    const address = this.affiliate.affiliateDetails.address;
  
    const addressFields = this.affiliate.type === 'INDIVIDUAL' ? {
      street: formValues.addressStreetIndividual,
      city: formValues.addressCityIndividual,
      post: formValues.addressPostIndividual
    } : {
      street: formValues.addressStreet,
      city: formValues.addressCity,
      post: formValues.addressPost
    };
  
    Object.assign(address, addressFields);
  }
  
  
  private updateBillingAddress(formValues: any): void {
    if(this.addressOverride){
      this.copyAddress();
      const billingAddress = this.affiliate.affiliateDetails.billingAddress;
      billingAddress.street = this.form.value.billingAddressStreet;
      billingAddress.city = this.form.value.billingAddressCity;
      billingAddress.post = this.form.value.billingAddressPost;
      billingAddress.country = this.affiliate?.affiliateDetails?.address?.country;
    }
    else{
    const billingAddress = this.affiliate.affiliateDetails.billingAddress;
    billingAddress.street = formValues.billingAddressStreet;
    billingAddress.city = formValues.billingAddressCity;
    billingAddress.post = formValues.billingAddressPost;
    billingAddress.country = formValues.billingAddressCountry;
    }
  }
  
  private updateAffiliateDetails(formValues: any): void {
    this.onTypeChange();
    if (this.form.valid) {
      this.affiliateService.updateAffiliateDetails(this.affiliateId, this.affiliate.affiliateDetails).subscribe({
        next: () => {
          if (this.isStaffOrAdmin) {
            this.router.navigate([`/affiliateManagement/${this.affiliateId}`]);
          }
          this.alerts = [];
          this.alerts.push({ type: 'success', msg: 'Contact information has been successfully saved.' });
        },
        error: (err) => {
          this.alerts.push({ type: 'danger', msg: 'Network request failure [29]: please try again later.' });
        }
      });
    }
  }
  

  transformFormToAffiliate(formValues: any): any {
    return {
      ...this.affiliate,
      affiliateDetails: {
        ...this.affiliate?.affiliateDetails,
        ...formValues
      }
    };
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

    cancel(){
      if(this.isStaffOrAdmin){
      this.router.navigate([`/affiliateManagement/${this.affiliateId}`]);
      }else{
        this.router.navigate([`/userDashboard`]);
      }
     
    }

    get affiliateType() {
      return this.affiliate?.type || this.affiliate?.affiliateDetails?.type;
    }

    copyAddress() {   
      this.updateAddressStatus();
      if(this.form.get('use')?.value) {
      if (this.form.value.type === 'INDIVIDUAL') {
        this.form.patchValue({
          billingAddressStreet: this.form.value.addressStreetIndividual,
          billingAddressCity: this.form.value.addressCityIndividual,
          billingAddressPost: this.form.value.addressPostIndividual,
          billingAddressCountry: this.affiliate?.affiliateDetails?.address?.country
        });
      } else {
        this.form.patchValue({
          billingAddressStreet: this.form.value.addressStreet,
          billingAddressCity: this.form.value.addressCity,
          billingAddressPost: this.form.value.addressPost,
          billingAddressCountry: this.affiliate?.affiliateDetails?.address?.country
        });
      }
    }
      this.isSameAddress = !!this.form.get('use')?.value;
    }
    
    mobileNumberValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const mobileNumber = control.value;
        if (!mobileNumber || typeof mobileNumber !== 'object') {
          const typeValue = this.form.get('type')?.value;
          if (typeValue !== 'INDIVIDUAL'){
            return { required: true };
          }
        }
    
        const phoneNumber = mobileNumber?.number;
    
        if (!phoneNumber) {
          return null;
        }

        const validPhoneNumberPattern = /^(\+|00)[1-9][0-9 \-\(\)\.]{10,32}$/;

        if (phoneNumber && !validPhoneNumberPattern.test(phoneNumber)) {
          return { mobileNumberInvalid: true };
        }
    
        return null;
      };
    }

    onCountryChange(event: any): void {
    const countryCode = event.dialCode;
    if (this.form.get('landlineNumber')) {
      this.form.controls['landlineNumber'].setValue("+"+countryCode);
    } else {
      console.error('not initialize');
    }
  }

  onCountryChangeM(event: any): void {
    const countryCode = event.dialCode;
    if (this.form.get('mobileNumber')) {
      this.form.controls['mobileNumber'].setValue("+"+countryCode);
    } else {
      console.error('not initialize');
    }
  }
    
 

}