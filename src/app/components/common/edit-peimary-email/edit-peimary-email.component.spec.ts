import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPeimaryEmailComponent } from './edit-peimary-email.component';

describe('EditPeimaryEmailComponent', () => {
  let component: EditPeimaryEmailComponent;
  let fixture: ComponentFixture<EditPeimaryEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPeimaryEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPeimaryEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
