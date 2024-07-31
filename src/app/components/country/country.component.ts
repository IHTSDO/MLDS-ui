import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CountryService } from 'src/app/services/country/country.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent {
  countries: any[] = [];
  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.fetchCountries();
}

fetchCountries(): void {
  this.countryService.getCountries().subscribe({
    next: (data) => {
      this.countries = data.sort((a, b) => (a.commonName > b.commonName) ? 1 : -1);
    },
    error: (error) => {
      console.error('Error fetching members:', error);
    }
  });
}




}
