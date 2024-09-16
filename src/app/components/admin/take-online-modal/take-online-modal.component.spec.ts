import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeOnlineModalComponent } from './take-online-modal.component';

describe('TakeOnlineModalComponent', () => {
  let component: TakeOnlineModalComponent;
  let fixture: ComponentFixture<TakeOnlineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeOnlineModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeOnlineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
