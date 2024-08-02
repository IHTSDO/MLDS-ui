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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule, PasswordStrengthBarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  createUserForm: FormGroup;
  availableCountries: any[] = [];

  success: string | null = null;
  error: any = {};
  countryName: string | null = null;
  urlRegistration: string | null = null;
  submitted = false;

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
    }, { validator: this.passwordsMatchValidator });

    this.createUserForm.get('country')?.valueChanges.subscribe(newValue => {
      this.handleCountryChange(newValue);
    });
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
      console.log(account.initialUsagePeriod);
      this.registerService.registerAccount(account).subscribe({
        next: () => {
          this.success = 'OK';
          this.router.navigate(['/emailVerification']);
        },
        error: (httpResponse) => {
          this.success = null;
          if (httpResponse.status === 304) {
            this.error = { userExists: 'ERROR' };
          } else if (httpResponse.status === 406) {
            this.error = { onBlocklist: 'ERROR' };
          } else {
            this.error = { general: 'ERROR' };
          }
        }
      });
    }

    private passwordsMatchValidator(formGroup: FormGroup) {
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


    private handleCountryChange(newValue: any): void {
      const country = this.availableCountries.find(c => c.commonName === newValue.commonName);
      if (country && country.excludeUsage) {
        this.showExclusionModal(country);
      }
    }


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
        this.router.navigate(['/']).then(() => {
        });
      });
    }
  
}


