import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  // Environment: local, dev, uat, prod
  public env = '';

  constructor() {
  }

  environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api',
  };

}
