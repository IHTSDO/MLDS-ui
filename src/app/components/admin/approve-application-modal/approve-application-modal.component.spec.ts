import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveApplicationModalComponent } from './approve-application-modal.component';

describe('ApproveApplicationModalComponent', () => {
  let component: ApproveApplicationModalComponent;
  let fixture: ComponentFixture<ApproveApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveApplicationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
