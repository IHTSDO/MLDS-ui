import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReleasePackageModalComponent } from './edit-release-package-modal.component';

describe('EditReleasePackageModalComponent', () => {
  let component: EditReleasePackageModalComponent;
  let fixture: ComponentFixture<EditReleasePackageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReleasePackageModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReleasePackageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
