import { TestBed } from '@angular/core/testing';

import { PackagesService } from './packages.service';

describe('PackagesServiceService', () => {
  let service: PackagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
