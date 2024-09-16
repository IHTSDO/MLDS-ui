import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectApplicationModalComponent } from './reject-application-modal.component';

describe('RejectApplicationModalComponent', () => {
  let component: RejectApplicationModalComponent;
  let fixture: ComponentFixture<RejectApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectApplicationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
