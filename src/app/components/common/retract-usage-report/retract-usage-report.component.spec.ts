import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetractUsageReportComponent } from './retract-usage-report.component';

describe('RetractUsageReportComponent', () => {
  let component: RetractUsageReportComponent;
  let fixture: ComponentFixture<RetractUsageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetractUsageReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetractUsageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
