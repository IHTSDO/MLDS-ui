import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReleaseLicenseWithDisclaimerModalComponent } from './review-release-license-with-disclaimer-modal.component';

describe('ReviewReleaseLicenseWithDisclaimerModalComponent', () => {
  let component: ReviewReleaseLicenseWithDisclaimerModalComponent;
  let fixture: ComponentFixture<ReviewReleaseLicenseWithDisclaimerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewReleaseLicenseWithDisclaimerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewReleaseLicenseWithDisclaimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
