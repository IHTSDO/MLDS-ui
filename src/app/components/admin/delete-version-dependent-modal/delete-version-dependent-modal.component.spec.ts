import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVersionDependentModalComponent } from './delete-version-dependent-modal.component';

describe('DeleteVersionDependentModalComponent', () => {
  let component: DeleteVersionDependentModalComponent;
  let fixture: ComponentFixture<DeleteVersionDependentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteVersionDependentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteVersionDependentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
