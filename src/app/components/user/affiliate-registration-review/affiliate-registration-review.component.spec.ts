import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateRegistrationReviewComponent } from './affiliate-registration-review.component';

describe('AffiliateRegistrationReviewComponent', () => {
  let component: AffiliateRegistrationReviewComponent;
  let fixture: ComponentFixture<AffiliateRegistrationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateRegistrationReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliateRegistrationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
