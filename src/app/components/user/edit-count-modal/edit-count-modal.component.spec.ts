import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCountModalComponent } from './edit-count-modal.component';

describe('EditCountModalComponent', () => {
  let component: EditCountModalComponent;
  let fixture: ComponentFixture<EditCountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
