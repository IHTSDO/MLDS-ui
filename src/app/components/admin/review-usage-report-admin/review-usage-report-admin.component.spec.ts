import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUsageReportAdminComponent } from './review-usage-report-admin.component';

describe('ReviewUsageReportAdminComponent', () => {
  let component: ReviewUsageReportAdminComponent;
  let fixture: ComponentFixture<ReviewUsageReportAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewUsageReportAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewUsageReportAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
