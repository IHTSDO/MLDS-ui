import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestedModalComponent } from './change-requested-modal.component';

describe('ChangeRequestedModalComponent', () => {
  let component: ChangeRequestedModalComponent;
  let fixture: ComponentFixture<ChangeRequestedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeRequestedModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRequestedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
