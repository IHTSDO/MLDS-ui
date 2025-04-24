import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCountryConfirmationModalComponent } from './delete-country-confirmation-modal.component';

describe('DeleteCountryConfirmationModalComponent', () => {
  let component: DeleteCountryConfirmationModalComponent;
  let fixture: ComponentFixture<DeleteCountryConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCountryConfirmationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCountryConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
