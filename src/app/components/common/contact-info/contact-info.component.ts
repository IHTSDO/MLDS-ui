import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';
import { ApplicationUtilsService } from 'src/app/services/application-utils/application-utils.service';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO, NgxBsTelInputComponent, PhoneNumberFormat, SearchCountryField } from 'ngx-bs-tel-input';
import { CountryService } from 'src/app/services/country/country.service';
import { map, Observable, of, startWith } from 'rxjs';
import { phoneNumberValidator } from 'src/app/validators/phone-number.validator';


@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule, NgxBsTelInputComponent],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent implements OnInit {


  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
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
  agreementTypeOptions: string[] = ['AFFILIATE_NORMAL', 'AFFILIATE_RESEARCH', 'AFFILIATE_PUBLIC_GOOD'];
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
      landlineNumber: ['', [Validators.required, phoneNumberValidator()]],
      landlineExtension: [''],
      mobileNumber: ['', phoneNumberValidator()],
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
      addressPost: ['']
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
        mobileNumberControl?.setValidators(phoneNumberValidator());
        addressStreetIndividualControl?.setValidators([Validators.required]);
        addressCityIndividualControl?.setValidators([Validators.required]);
        addressPostIndividualControl?.setValidators([Validators.required,Validators.pattern(/^\+?[a-zA-Z0-9\s]{1,25}$/)]);
        billingAddressStreetControl?.setValidators([Validators.required]);
        billingAddressCityControl?.setValidators([Validators.required]);
        billingAddressPostControl?.setValidators([Validators.required,Validators.pattern(/^\+?[a-zA-Z0-9\s]{1,25}$/)]);
        billingAddressCountryControl?.setValidators([Validators.required]);
      } else {
        alternateEmailControl?.setValidators([Validators.email,Validators.required]);
        mobileNumberControl?.setValidators([Validators.required,phoneNumberValidator()]);  
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
              
              console.log('Affiliate ID from myAccount:', this.affiliateId);
              this.approved = this.applicationUtilsService?.isApplicationApproved(this.affiliate?.application);
              this.readOnly = !this.applicationUtilsService?.isApplicationApproved(this.affiliate?.application);
              this.updateForm();
              this.updateAddressStatus();
            } else {
              console.log('No affiliate data found');
            }
          },
          error: (err) => {
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
        this.updateAddressStatus();
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
      a.street !== '' && a.street === b.street &&
      a.city !== '' && a.city === b.city &&
      a.country !== '' && a.country === b.country
    ) {
      return true;
    }
    return false;
  }


  updateForm(): void {
    this.form.patchValue({
      type: this.affiliate?.affiliateDetails.type || '',
      otherText: this.affiliate?.affiliateDetails.otherText || '',
      subType: this.affiliate?.affiliateDetails?.subType || '',
      agreementType: this.affiliate?.affiliateDetails?.agreementType || '',
      acceptNotifications: this.affiliate?.affiliateDetails?.acceptNotifications ?? false,
      countryNotificationsOnly: this.affiliate?.affiliateDetails?.countryNotificationsOnly ?? false,
      firstName: this.affiliate?.affiliateDetails?.firstName || '',
      lastName: this.affiliate?.affiliateDetails?.lastName || '',
      email: this.affiliate?.affiliateDetails?.email || '',
      alternateEmail: this.affiliate?.affiliateDetails?.alternateEmail || '',
      thirdEmail: this.affiliate?.affiliateDetails?.thirdEmail || '',
      landlineNumber: this.affiliate?.affiliateDetails?.landlineNumber || '',
      landlineExtension: this.affiliate?.affiliateDetails?.landlineExtension || '',
      mobileNumber: this.affiliate?.affiliateDetails?.mobileNumber || '',
      addressStreetIndividual: this.affiliate?.affiliateDetails?.address?.street || '',
      addressCityIndividual: this.affiliate?.affiliateDetails?.address?.city || '',
      addressPostIndividual: this.affiliate?.affiliateDetails?.address?.post || '',
      billingAddressStreet: this.affiliate?.affiliateDetails?.billingAddress?.street || '',
      billingAddressCity: this.affiliate?.affiliateDetails?.billingAddress?.city || '',
      billingAddressPost: this.affiliate?.affiliateDetails?.billingAddress?.post || '',
      billingAddressCountry: this.affiliate?.affiliateDetails?.billingAddress?.country || '',
      organizationName: this.affiliate?.affiliateDetails?.organizationName || '',
      addressStreet: this.affiliate?.affiliateDetails?.address?.street || '',
      addressCity: this.affiliate?.affiliateDetails?.address?.city || '',
      addressPost: this.affiliate?.affiliateDetails?.address?.post || ''
    });

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
    const billingAddress = this.affiliate.affiliateDetails.billingAddress;
    billingAddress.street = formValues.billingAddressStreet;
    billingAddress.city = formValues.billingAddressCity;
    billingAddress.post = formValues.billingAddressPost;
    billingAddress.country = formValues.billingAddressCountry;
  }
  
  private updateAffiliateDetails(formValues: any): void {
    if (this.form.valid) {
      this.affiliateService.updateAffiliateDetails(this.affiliateId, this.affiliate.affiliateDetails).subscribe(
        () =>{
          if(this.isStaffOrAdmin){
           this.router.navigate([`/affiliateManagement/${this.affiliateId}`])
        }
        this.alerts = [];
        this.alerts.push({ type: 'success', msg: 'Contact information has been successfully saved.' });
       },
        (error) => this.alerts.push({ type: 'danger', msg: 'Network request failure [29]: please try again later.' })
      );
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
      }
      this.router.navigate([`/userDashboard`]);
    }

 

}