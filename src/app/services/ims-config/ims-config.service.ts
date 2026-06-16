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
      this.imsCookieName = `${imsUrl.hostname.split('.')[0]}-ihtsdo`;
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

}
