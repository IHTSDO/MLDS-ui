import { TestBed } from '@angular/core/testing';

import { BolcklistDomainService } from './bolcklist-domain.service';

describe('BolcklistDomainService', () => {
  let service: BolcklistDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BolcklistDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
