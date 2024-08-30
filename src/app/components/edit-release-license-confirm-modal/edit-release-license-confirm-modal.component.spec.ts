import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReleaseLicenseConfirmModalComponent } from './edit-release-license-confirm-modal.component';

describe('EditReleaseLicenseConfirmModalComponent', () => {
  let component: EditReleaseLicenseConfirmModalComponent;
  let fixture: ComponentFixture<EditReleaseLicenseConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReleaseLicenseConfirmModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReleaseLicenseConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
