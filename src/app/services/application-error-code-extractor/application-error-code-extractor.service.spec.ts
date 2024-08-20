import { TestBed } from '@angular/core/testing';

import { ApplicationErrorCodeExtractorService } from './application-error-code-extractor.service';

describe('ApplicationErrorCodeExtractorService', () => {
  let service: ApplicationErrorCodeExtractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationErrorCodeExtractorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
