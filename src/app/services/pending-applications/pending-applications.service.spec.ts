import { TestBed } from '@angular/core/testing';

import { PendingApplicationsService } from './pending-applications.service';

describe('PendingApplicationsService', () => {
  let service: PendingApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
