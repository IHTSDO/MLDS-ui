import { TestBed } from '@angular/core/testing';

import { ApprovalStateUtilsService } from './approval-state-utils.service';

describe('ApprovalStateUtilsService', () => {
  let service: ApprovalStateUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovalStateUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
