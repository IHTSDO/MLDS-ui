import { TestBed } from '@angular/core/testing';

import { UsageReportStateUtilsService } from './usage-report-state-utils.service';

describe('UsageReportStateUtilsService', () => {
  let service: UsageReportStateUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsageReportStateUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
