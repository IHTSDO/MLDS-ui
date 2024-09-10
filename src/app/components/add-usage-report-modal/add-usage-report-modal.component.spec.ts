import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsageReportModalComponent } from './add-usage-report-modal.component';

describe('AddUsageReportModalComponent', () => {
  let component: AddUsageReportModalComponent;
  let fixture: ComponentFixture<AddUsageReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUsageReportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUsageReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
