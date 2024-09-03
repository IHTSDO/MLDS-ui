import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { CountryService } from 'src/app/services/country/country.service';
import { PasswordStrengthBarComponent } from "../password-strength-bar/password-strength-bar.component";
import { RegisterService } from 'src/app/services/register/register.service';
import { CommercialUsageService } from 'src/app/services/commercialUsage/commercial-usage.service';
import { Router } from '@angular/router';
import { ExclusionModalComponent } from '../exclusion-modal/exclusion-modal.component';
import { ROUTES } from 'src/app/routes-config'
import { ErrorCodes } from 'src/app/error-codes'

/**
 * Register component
 *
 * Handles user registration
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule, PasswordStrengthBarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  /**
   * Form group for creating a new user
   */
  createUserForm: FormGroup;

  /**
   * List of available countries
   */
  availableCountries: any[] = [];

  /**
   * Success message
   */
  success: string | null = null;

  /**
   * Error object
   */
  error: any = {};

  /**
   * Country name
   */
  countryName: string | null = null;

  /**
   * URL for registration
   */
  urlRegistration: string | null = null;

  /**
   * Flag indicating if the form has been submitted
   */
  submitted = false;

  /**
   * Routes configuration
   */
  routes = ROUTES;

  /**
   * Error codes
   */
  errorCodes = ErrorCodes;

  constructor(
    private fb: FormBuilder, 
    private countryService: CountryService, 
    private registerService: RegisterService, 
    private commercialUsageService: CommercialUsageService, 
    private router: Router, 
    private modalService: NgbModal
  ) 
  {  
    this.createUserForm = this.fb.group({});
  }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    this.countryService.getCountries().subscribe(countries => {
      this.availableCountries = countries;
    });

    this.createUserForm = this.fb.group({
      country: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)]],
      confirmEmail: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      tos: [false, Validators.requiredTrue]
    }, { validator: this.inputsMatchValidator });

    this.createUserForm.get('country')?.valueChanges.subscribe(newValue => {
      this.handleCountryChange(newValue);
    });
  }

  /**
   * Searches for countries based on the input text
   *
   * @param text$ - Observable of the input text
   * @returns - An observable of the filtered country list
   */
  search = (text$: Observable<string>) =>
    text$.pipe(
      startWith(''),
      map(term => (term === '' ? []
        : this.availableCountries
            .filter(country => country.commonName.toLowerCase().includes(term.toLowerCase()))
            .slice(0, 8)
      ))
    );

  /**
   * Formats a country object for display
   *
   * @param country - The country object
   * @returns - The formatted country name
   */
  formatCountry = (country: any) => country.commonName;

  /**
   * Submits the registration form
   */
  onSubmit() {
    this.submitted = true;
    if (this.createUserForm.invalid) {
      return;
    }

    const account = this.createUserForm.value;
    account.langKey = "en";
    account.login = account.email;
    const initialPeriod = this.commercialUsageService.generateRanges()[0];
    account.initialUsagePeriod = {
      startDate: initialPeriod.startDate,
      endDate: initialPeriod.endDate
    };
    this.registerService.registerAccount(account).subscribe({
      next: () => {
        this.success = 'OK';
        this.router.navigate([this.routes.emailVerification]);
      },
      error: (httpResponse) => {
        this.success = null;
          switch (httpResponse.status) {
            case this.errorCodes.UserExists:
              this.error = { userExists: 'ERROR' };
              break;
            case this.error.OnBlocklist:
              this.error = { onBlocklist: 'ERROR' };
              break;
            default:
              this.error = { general: 'ERROR' };
              break;
          }
        }
      });
    }

   /**
 * Validator function to check if password and confirm password fields match
 *
 * @param formGroup - The form group to validate
 */
private inputsMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;
  if (password !== confirmPassword) {
    formGroup.get('confirmPassword')?.setErrors({ match: true });
  } else {
    formGroup.get('confirmPassword')?.setErrors(null);
  }

  const email = formGroup.get('email')?.value;
  const confirmEmail = formGroup.get('confirmEmail')?.value;
  if (email !== confirmEmail) {
    formGroup.get('confirmEmail')?.setErrors({ match: true });
  } else {
    formGroup.get('confirmEmail')?.setErrors(null);
  }
}

/**
 * Handles country change event
 *
 * @param newValue - The new country value
 */
private handleCountryChange(newValue: any): void {
  const country = this.availableCountries.find(c => c.commonName === newValue.commonName);
  if (country && country.excludeUsage) {
    this.showExclusionModal(country);
  }
}

/**
 * Shows exclusion modal for countries with exclude usage
 *
 * @param country - The country object
 */
private showExclusionModal(country: any): void {
  const modalRef = this.modalService.open(ExclusionModalComponent, {
    size: 'lg',
    backdrop: 'static'
  });

  modalRef.componentInstance.countryName = country.commonName;
  modalRef.componentInstance.urlRegistration = country.alternateRegistrationUrl;

  modalRef.result.then((result) => {
    if (result) {
      console.log("accepted")
    }
  }, (reason) => {
    this.router.navigate([this.routes.landingPage]).then(() => {
    });
  });
}
}