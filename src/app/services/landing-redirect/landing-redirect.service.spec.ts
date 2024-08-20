import { TestBed } from '@angular/core/testing';

import { LandingRedirectService } from './landing-redirect.service';

describe('LandingRedirectService', () => {
  let service: LandingRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingRedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
