import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CountryService } from 'src/app/services/country/country.service';
import { CountryModalComponent } from '../country-modal/country-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCountryConfirmationModalComponent } from '../../common/delete-country-confirmation-modal/delete-country-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Country component that displays a list of countries and allows CRUD operations.
 */
@Component({
    selector: 'app-country',
    imports: [CommonModule],
    templateUrl: './country.component.html',
    styleUrl: './country.component.scss'
})
export class CountryComponent {
  /**
   * Array of country objects.
   */
  countries: any[] = [];
  isLoading: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  constructor(private countryService: CountryService, private modalService: NgbModal,private toastr: ToastrService) { }

  /**
   * Initializes the component by fetching the list of countries.
   */
  ngOnInit(): void {
    this.fetchCountries();
  }

  /**
   * Fetches the list of countries from the country service.
   */
  fetchCountries(): void {
    this.isLoading = true;
    this.countryService.getCountries().subscribe({
      next: (data) => {
        this.countries = [...data].sort((a, b) => a.commonName.localeCompare(b.commonName));
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching countries:', error);
      }
    });
  }

  openDeleteConfirmation(isoCode: string): void {
    const modalRef = this.modalService.open(DeleteCountryConfirmationModalComponent);
    modalRef.componentInstance.isoCode = isoCode;
  
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.delete(isoCode);
      }
    }).catch(() => {});
  }
  
  delete(isoCode: string): void {
    this.countryService.deleteCountry(isoCode).subscribe({
      next: () => {
        this.fetchCountries();
        this.toastr.success(`Country with ISO code ${isoCode} deleted successfully.`, 'Success');
      },
      error: (error: HttpErrorResponse) => {
        let message = `Failed to delete country ${isoCode}. As this country is mapped with affiliates`;
  
        if (error.error?.message) {
          message = error.error.message;
        }
  
        this.toastr.error(message, 'Delete Failed');
      }
    });
  }
  /**
   * Opens the create country modal.
   */
  openCreate(): void {
    const modalRef = this.modalService.open(CountryModalComponent);
    modalRef.componentInstance.country = null; // Set country to null for creation

    modalRef.result.then((newCountry) => {
      if (newCountry) {
        this.countryService.createCountry(newCountry).subscribe(
          response => {
            this.fetchCountries();
          },
          error => {
            console.error('Error creating country', error);
          }
        );
      }
    }).catch(error => {
    });
  }

  /**
   * Opens the update country modal for the specified ISO code.
   * @param isoCode - The ISO code of the country to update.
   */
  update(isoCode: string): void {
    this.openUpdateModal(isoCode);
  }

  /**
   * Opens the update country modal for the specified ISO code.
   * @param isoCode2 - The ISO code of the country to update.
   */
  openUpdateModal(isoCode2: string) {
    const country = this.countries.find(c => c.isoCode2 === isoCode2);
    const modalRef = this.modalService.open(CountryModalComponent);
    modalRef.componentInstance.country = country;

    modalRef.result.then((updatedCountry) => {
      this.countryService.updateCountry(isoCode2, updatedCountry).subscribe(
        response => {
          this.fetchCountries();
        },
        error => {
        }
      );
    }).catch(error => {
    });
  }
}