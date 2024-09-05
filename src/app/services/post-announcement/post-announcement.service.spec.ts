import { TestBed } from '@angular/core/testing';

import { PostAnnouncementService } from './post-announcement.service';

describe('PostAnnouncementService', () => {
  let service: PostAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
