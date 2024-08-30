import { TestBed } from '@angular/core/testing';

import { ReleaseVersionsService } from './release-versions.service';

describe('ReleaseVersionsService', () => {
  let service: ReleaseVersionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseVersionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
