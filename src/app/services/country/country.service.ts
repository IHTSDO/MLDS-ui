import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  
  private apiUrl = environment.apiUrl;
  private countries: any[] = [];
  private countriesByIsoCode2: { [key: string]: any } = {};
  private countriesUsingMLDS: string[] = [];

  constructor(private http:HttpClient) { }


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

  getCountriesByIsoCode2() {
    return this.countriesByIsoCode2;
  }

  getCountriesUsingMLDS() {
    return this.countriesUsingMLDS;
  }
  // New method to get country by ISO code
getCountryByISOCODE2(isoCode: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/countries/${isoCode}`);
}

// New method to create a country
createCountry(country: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/countries`, country);
}

// New method to update a country
updateCountry(isoCode: string, country: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/countries`, country);
}

// New method to delete a country
deleteCountry(isoCode: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/countries/${isoCode}`);
}
  
}
