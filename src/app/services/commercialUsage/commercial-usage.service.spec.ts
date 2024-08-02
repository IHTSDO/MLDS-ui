import { TestBed } from '@angular/core/testing';

import { CommercialUsageService } from './commercial-usage.service';

describe('CommercialUsageService', () => {
  let service: CommercialUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommercialUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
