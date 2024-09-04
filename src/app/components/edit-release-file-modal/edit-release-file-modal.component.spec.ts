import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReleaseFileModalComponent } from './edit-release-file-modal.component';

describe('EditReleaseFileModalComponent', () => {
  let component: EditReleaseFileModalComponent;
  let fixture: ComponentFixture<EditReleaseFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReleaseFileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReleaseFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
