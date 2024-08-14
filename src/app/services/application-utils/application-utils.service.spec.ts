import { TestBed } from '@angular/core/testing';

import { ApplicationUtilsService } from './application-utils.service';

describe('ApplicationUtilsService', () => {
  let service: ApplicationUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
