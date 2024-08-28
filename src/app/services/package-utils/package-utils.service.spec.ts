import { TestBed } from '@angular/core/testing';

import { PackageUtilsService } from './package-utils.service';

describe('PackageUtilsService', () => {
  let service: PackageUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
