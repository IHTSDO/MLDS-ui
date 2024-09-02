import { TestBed } from '@angular/core/testing';

import { MemberPckageService } from './member-pckage.service';

describe('MemberPckageService', () => {
  let service: MemberPckageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberPckageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
