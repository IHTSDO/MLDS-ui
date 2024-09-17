import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReleaseLicenseModalComponent } from './review-release-license-modal.component';

describe('ReviewReleaseLicenseModalComponent', () => {
  let component: ReviewReleaseLicenseModalComponent;
  let fixture: ComponentFixture<ReviewReleaseLicenseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewReleaseLicenseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewReleaseLicenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
