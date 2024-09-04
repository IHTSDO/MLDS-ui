import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReleaseFileModalComponent } from './add-release-file-modal.component';

describe('AddReleaseFileModalComponent', () => {
  let component: AddReleaseFileModalComponent;
  let fixture: ComponentFixture<AddReleaseFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReleaseFileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReleaseFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
