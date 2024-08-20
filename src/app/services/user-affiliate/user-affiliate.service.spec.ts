import { TestBed } from '@angular/core/testing';

import { UserAffiliateService } from './user-affiliate.service';

describe('UserAffiliateService', () => {
  let service: UserAffiliateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAffiliateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
