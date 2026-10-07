import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImsConfigService {

  private loaded = false;
  private imsEndpoint = '';
  private imsCookieName = '';

  /**
   * Fetch IMS configuration from the authoring-services endpoint.
   * Subsequent calls are no-ops once loaded (cached in-memory).
   */
  async load(): Promise<void> {

    if (this.loaded) {
      return;
    }

    try {

      const response = await fetch(`${window.location.origin}/authoring-services/ui-configuration`);
      const config = await response.json();

      const imsUrl = new URL(config?.endpoints?.imsEndpoint);

      this.imsEndpoint = imsUrl.origin;
      let cookiePrefix = imsUrl.hostname.split('.')[0];
      if (cookiePrefix === 'prod-ims' || cookiePrefix === 'ims') {
        cookiePrefix = 'ims';
      }
      this.imsCookieName = `${cookiePrefix}-ihtsdo`;
      this.loaded = true;

    } catch (error) {

      console.error('Failed to load IMS config:', error);

    }

  }

  getImsEndpoint(): string {
    return this.imsEndpoint;
  }

  getImsCookieName(): string {
    return this.imsCookieName;
  }

  getKeycloakEndpoint(): string {
    if (!this.imsEndpoint) {
      return '';
    }
    try {
      const imsUrl = new URL(this.imsEndpoint);
      let keycloakHost = imsUrl.hostname;
      if (keycloakHost.includes('prod-ims.') || keycloakHost.startsWith('ims.')) {
        keycloakHost = keycloakHost.replace('prod-ims.', 'snoauth.').replace('ims.', 'snoauth.');
      } else if (keycloakHost.includes('-ims.')) {
        keycloakHost = keycloakHost.replace('-ims.', '-snoauth.');
      }
      return `${imsUrl.protocol}//${keycloakHost}`;
    } catch {
      return '';
    }
  }

}
