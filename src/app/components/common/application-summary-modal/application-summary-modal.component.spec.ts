import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSummaryModalComponent } from './application-summary-modal.component';

describe('ApplicationSummaryModalComponent', () => {
  let component: ApplicationSummaryModalComponent;
  let fixture: ComponentFixture<ApplicationSummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationSummaryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
