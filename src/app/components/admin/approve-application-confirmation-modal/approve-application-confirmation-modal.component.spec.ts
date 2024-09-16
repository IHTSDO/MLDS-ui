import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveApplicationConfirmationModalComponent } from './approve-application-confirmation-modal.component';

describe('ApproveApplicationConfirmationModalComponent', () => {
  let component: ApproveApplicationConfirmationModalComponent;
  let fixture: ComponentFixture<ApproveApplicationConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveApplicationConfirmationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveApplicationConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
