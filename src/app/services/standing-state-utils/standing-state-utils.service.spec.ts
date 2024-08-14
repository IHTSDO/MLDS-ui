import { TestBed } from '@angular/core/testing';

import { StandingStateUtilsService } from './standing-state-utils.service';

describe('StandingStateUtilsService', () => {
  let service: StandingStateUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandingStateUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
