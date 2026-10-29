import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CountryService } from 'src/app/services/country/country.service';
import { CountryModalComponent } from '../country-modal/country-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCountryConfirmationModalComponent } from '../../common/delete-country-confirmation-modal/delete-country-confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { API_ROUTES } from 'src/app/routes-config-api';

@Component({
  selector: 'app-country',
  imports: [CommonModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit {
  countries: any[] = [];
  isLoading: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private countryService: CountryService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchCountries();
  }

  private sortCountries(list: any[]): any[] {
    return [...list].sort((a, b) =>
      (a.commonName ?? '').localeCompare(b.commonName ?? '')
    );
  }

  /** Normal load: uses the service (and its cache), same as before. */
  fetchCountries(): void {
    this.isLoading = true;
    this.countryService.getCountries().subscribe({
      next: (data) => {
        this.countries = this.sortCountries(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching countries:', error);
      }
    });
  }

  /**
   * After create/update/delete: fetch fresh data straight from the API
   * (bypassing the service cache) and refresh the service's cached copy
   * in place, so other screens also see the latest data.
   */
  private refreshFromServer(): void {
    this.http.get<any[]>(`${API_ROUTES.apiUrl}/countries`).subscribe({
      next: (fresh) => {
        // Update the service's cache in place (no service code change needed)
        this.countryService.countries = fresh;
        this.countryService.countriesByIsoCode2 = {};
        fresh.forEach(c => (this.countryService.countriesByIsoCode2[c.isoCode2] = c));

        this.countries = this.sortCountries(fresh);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error refreshing countries:', error);
      }
    });
  }

  openDeleteConfirmation(isoCode: string): void {
    const modalRef = this.modalService.open(DeleteCountryConfirmationModalComponent);
    modalRef.componentInstance.isoCode = isoCode;

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.delete(isoCode);
        }
      })
      .catch(() => {});
  }

  delete(isoCode: string): void {
    this.countryService.deleteCountry(isoCode).subscribe({
      next: () => {
        this.refreshFromServer();
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

  openCreate(): void {
    const modalRef = this.modalService.open(CountryModalComponent);
    modalRef.componentInstance.country = null;

    modalRef.result
      .then((newCountry) => {
        if (!newCountry) return;

        this.countryService.createCountry(newCountry).subscribe({
          next: () => {
            this.refreshFromServer();
            this.toastr.success('Country created successfully.', 'Success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error creating country', error);
            this.toastr.error(error.error?.message ?? 'Failed to create country.', 'Error');
          }
        });
      })
      .catch(() => {});
  }

  update(isoCode: string): void {
    this.openUpdateModal(isoCode);
  }

  openUpdateModal(isoCode2: string): void {
    const country = this.countries.find(c => c.isoCode2 === isoCode2);
    const modalRef = this.modalService.open(CountryModalComponent);
    modalRef.componentInstance.country = country;

    modalRef.result
      .then((updatedCountry) => {
        if (!updatedCountry) return;

        this.countryService.updateCountry(isoCode2, updatedCountry).subscribe({
          next: () => {
            this.refreshFromServer();
            this.toastr.success('Country updated successfully.', 'Success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating country', error);
            this.toastr.error(error.error?.message ?? 'Failed to update country.', 'Error');
          }
        });
      })
      .catch(() => {});
  }
}