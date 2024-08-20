import { TestBed } from '@angular/core/testing';

import { SystemsLoggersService } from './systems-loggers.service';

describe('SystemsLoggersService', () => {
  let service: SystemsLoggersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemsLoggersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
