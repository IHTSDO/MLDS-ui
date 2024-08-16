import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Country service that provides methods to retrieve, create, update and delete countries.
 */
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  
  private apiUrl = environment.apiUrl;
  private countries: any[] = [];
  private countriesByIsoCode2: { [key: string]: any } = {};
  private countriesUsingMLDS: string[] = [];

  constructor(private http: HttpClient) { }

  /**
   * Retrieves a list of all countries.
   *
   * @returns An observable that emits an array of country objects.
   * @example
   * this.countryService.getCountries().subscribe(countries => console.log(countries));
   */
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/countries`).pipe(
      map((countries) => {
        const tempCountriesUsingMLDS: string[] = [];
        countries.forEach((country) => {
          if (country.member && country.member.key !== 'IHTSDO') {
            tempCountriesUsingMLDS.push(country.isoCode2);
          }
        });

        this.countries = countries;
        this.countriesUsingMLDS = tempCountriesUsingMLDS;

        this.countries.sort((a, b) => a.commonName!.toLowerCase().localeCompare(b.commonName!.toLowerCase()));

        this.countries.forEach((c) => {
          this.countriesByIsoCode2[c.isoCode2] = c;
        });

        return this.countries;
      })
    );
  }

  /**
   * Retrieves a dictionary of countries by ISO code 2.
   *
   * @returns An object with ISO code 2 as keys and country objects as values.
   * @example
   * const countriesByIsoCode2 = this.countryService.getCountriesByIsoCode2();
   * console.log(countriesByIsoCode2['US']); // Output: Country object with ISO code 2 'US'
   */
  getCountriesByIsoCode2() {
    return this.countriesByIsoCode2;
  }

  /**
   * Retrieves a list of countries that use MLDS.
   *
   * @returns An array of ISO code 2 strings of countries that use MLDS.
   * @example
   * const countriesUsingMLDS = this.countryService.getCountriesUsingMLDS();
   * console.log(countriesUsingMLDS); // Output: ['US', 'CA', ...]
   */
  getCountriesUsingMLDS() {
    return this.countriesUsingMLDS;
  }

  /**
   * Retrieves a country by its ISO code 2.
   *
   * @param isoCode The ISO code 2 of the country to retrieve.
   * @returns An observable that emits the country object.
   * @example
   * this.countryService.getCountryByISOCODE2('US').subscribe(country => console.log(country));
   */
  getCountryByISOCODE2(isoCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/countries/${isoCode}`);
  }

  /**
   * Creates a new country.
   *
   * @param country The country object to create.
   * @returns An observable that emits the created country object.
   * @example
   * const country = { commonName: 'New Country', isoCode2: 'NC' };
   * this.countryService.createCountry(country).subscribe(createdCountry => console.log(createdCountry));
   */
  createCountry(country: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/countries`, country);
  }

  /**
   * Updates a country.
   *
   * @param isoCode The ISO code 2 of the country to update.
   * @param country The updated country object.
   * @returns An observable that emits the updated country object.
   * @example
   * const country = { commonName: 'Updated Country', isoCode2: 'US' };
   * this.countryService.updateCountry('US', country).subscribe(updatedCountry => console.log(updatedCountry));
   */
  updateCountry(isoCode: string, country: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/countries`, country);
  }

  /**
   * Deletes a country.
   *
   * @param isoCode The ISO code 2 of the country to delete.
   * @returns An observable that emits a success response.
   * @example
   * this.countryService.deleteCountry('US').subscribe(() => console.log('Country deleted'));
   */
  deleteCountry(isoCode: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/countries/${isoCode}`);
  }
}