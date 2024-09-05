import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReleaseVersionModalComponent } from './add-edit-release-version-modal.component';

describe('AddEditReleaseVersionModalComponent', () => {
  let component: AddEditReleaseVersionModalComponent;
  let fixture: ComponentFixture<AddEditReleaseVersionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditReleaseVersionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditReleaseVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
