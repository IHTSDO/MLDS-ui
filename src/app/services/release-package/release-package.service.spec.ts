import { TestBed } from '@angular/core/testing';

import { ReleasePackageService } from './release-package.service';

describe('ReleasePackageService', () => {
  let service: ReleasePackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleasePackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
