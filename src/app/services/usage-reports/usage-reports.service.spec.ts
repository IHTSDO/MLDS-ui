import { TestBed } from '@angular/core/testing';

import { UsageReportsService } from './usage-reports.service';

describe('UsageReportsService', () => {
  let service: UsageReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsageReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
