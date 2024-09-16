import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAnnouncementComponent } from './post-announcement.component';

describe('PostAnnouncementComponent', () => {
  let component: PostAnnouncementComponent;
  let fixture: ComponentFixture<PostAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostAnnouncementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
