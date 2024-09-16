import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUsageReportsComponent } from './review-usage-reports.component';

describe('ReviewUsageReportsComponent', () => {
  let component: ReviewUsageReportsComponent;
  let fixture: ComponentFixture<ReviewUsageReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewUsageReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewUsageReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
