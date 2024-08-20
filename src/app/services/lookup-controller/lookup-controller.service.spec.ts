import { TestBed } from '@angular/core/testing';

import { LookupControllerService } from './lookup-controller.service';

describe('LookupControllerService', () => {
  let service: LookupControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
