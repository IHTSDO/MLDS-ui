import { TestBed } from '@angular/core/testing';

import { ReleaseFileDownloadCountService } from './release-file-download-count.service';

describe('ReleaseFileDownloadCountService', () => {
  let service: ReleaseFileDownloadCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseFileDownloadCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
