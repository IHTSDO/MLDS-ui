import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRequestedModalComponent } from './review-requested-modal.component';

describe('ReviewRequestedModalComponent', () => {
  let component: ReviewRequestedModalComponent;
  let fixture: ComponentFixture<ReviewRequestedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewRequestedModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewRequestedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
