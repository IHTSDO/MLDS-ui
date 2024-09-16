import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitUsageReportModalComponent } from './submit-usage-report-modal.component';

describe('SubmitUsageReportModalComponent', () => {
  let component: SubmitUsageReportModalComponent;
  let fixture: ComponentFixture<SubmitUsageReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitUsageReportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitUsageReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
