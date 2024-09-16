import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVersionModalComponent } from './delete-version-modal.component';

describe('DeleteVersionModalComponent', () => {
  let component: DeleteVersionModalComponent;
  let fixture: ComponentFixture<DeleteVersionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteVersionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
