import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public readonly newUser = 'ihtsdo.mlds.newUser';
  public readonly registrationError = 'ihtsdo.mlds.registrationError';
  public readonly commercialUsageUpdated = 'ihtsdo.mlds.commercialUsageUpdated';
  public readonly affiliateTypeUpdated = 'ihtsdo.mlds.affiliateTypeUpdated';

}
