import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLicenseComponent } from './edit-license.component';

describe('EditLicenseComponent', () => {
  let component: EditLicenseComponent;
  let fixture: ComponentFixture<EditLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLicenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
