import { TestBed } from '@angular/core/testing';

import { DateFilterUtilsService } from './date-filter-utils.service';

describe('DateFilterUtilsService', () => {
  let service: DateFilterUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFilterUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
