import { TestBed } from '@angular/core/testing';

import { AuthenticationSharedService } from './authentication-shared.service';

describe('AuthenticationSharedService', () => {
  let service: AuthenticationSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
