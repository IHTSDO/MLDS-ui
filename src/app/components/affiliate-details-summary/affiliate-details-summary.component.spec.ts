import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateDetailsSummaryComponent } from './affiliate-details-summary.component';

describe('AffiliateDetailsSummaryComponent', () => {
  let component: AffiliateDetailsSummaryComponent;
  let fixture: ComponentFixture<AffiliateDetailsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateDetailsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliateDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
