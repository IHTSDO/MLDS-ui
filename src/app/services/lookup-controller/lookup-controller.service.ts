import { Injectable } from '@angular/core';
import { AuthenticationSharedService } from '../authentication/authentication-shared.service';
import { Observable, forkJoin } from 'rxjs';
import { CountryService } from '../country/country.service';

@Injectable({
  providedIn: 'root'
})
export class LookupControllerService {

  constructor(
    private authService: AuthenticationSharedService,
    private countryService: CountryService
  ) {}

  
}