import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReleaseModalComponent } from './add-release-modal.component';

describe('AddReleaseModalComponent', () => {
  let component: AddReleaseModalComponent;
  let fixture: ComponentFixture<AddReleaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReleaseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReleaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
