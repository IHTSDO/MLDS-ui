import { Injectable } from '@angular/core';

/**
 * Environment service that provides environment-specific settings.
 *
 * @example
 * import { EnvService } from './env.service';
 *
 * const envService = new EnvService();
 * console.log(envService.environment.apiUrl); // outputs: http://localhost:8080/api
 */
@Injectable({
  providedIn: 'root'
})
export class EnvService {

  /**
   * Environment type: local, dev, uat, prod
   */
  public env = '';

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Environment settings
   */
  environment = {
    /**
     * Whether the environment is production
     */
    production: false,
    /**
     * API URL
     */
    apiUrl: 'http://localhost:8080/api',
  };

}