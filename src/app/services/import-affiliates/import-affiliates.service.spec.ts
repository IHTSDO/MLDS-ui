import { TestBed } from '@angular/core/testing';

import { ImportAffiliatesService } from './import-affiliates.service';

describe('ImportAffiliatesService', () => {
  let service: ImportAffiliatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportAffiliatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
