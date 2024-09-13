import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInstitutionModalComponent } from './delete-institution-modal.component';

describe('DeleteInstitutionModalComponent', () => {
  let component: DeleteInstitutionModalComponent;
  let fixture: ComponentFixture<DeleteInstitutionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInstitutionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInstitutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
