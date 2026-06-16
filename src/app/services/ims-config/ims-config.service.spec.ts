import { TestBed } from '@angular/core/testing';

import { ImsConfigService } from './ims-config.service';

describe('ImsConfigService', () => {
  let service: ImsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImsConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
