import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CountryService } from 'src/app/services/country/country.service';
import { CountryModalComponent } from '../country-modal/country-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Country component that displays a list of countries and allows CRUD operations.
 */
@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent {
  /**
   * Array of country objects.
   */
  countries: any[] = [];

  constructor(private countryService: CountryService, private modalService: NgbModal) { }

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
    this.countryService.getCountries().subscribe({
      next: (data) => {
        this.countries = data.sort((a, b) => (a.commonName > b.commonName) ? 1 : -1);
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
      }
    });
  }

  /**
   * Deletes a country by its ISO code.
   * @param isoCode - The ISO code of the country to delete.
   */
  delete(isoCode: string): void {
    console.log("delete Method Clicked");
    this.countryService.deleteCountry(isoCode).subscribe(
      () => {
        this.fetchCountries(); // Reload countries after deletion
      },
      (error: any) => console.error('Error deleting country', error)
    );
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
    console.log(isoCode);
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