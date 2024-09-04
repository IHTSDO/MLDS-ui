import { TestBed } from '@angular/core/testing';

import { RleaseFileService } from './release-file.service';

describe('RleaseFileService', () => {
  let service: RleaseFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RleaseFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
