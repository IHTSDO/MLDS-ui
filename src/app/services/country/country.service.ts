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
  
}
