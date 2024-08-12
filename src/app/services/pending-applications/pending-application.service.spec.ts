import { TestBed } from '@angular/core/testing';

import { PendingApplicationService } from './pending-application.service';

describe('PendingApplicationService', () => {
  let service: PendingApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
