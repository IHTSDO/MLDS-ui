import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeOfflineModalComponent } from './take-offline-modal.component';

describe('TakeOfflineModalComponent', () => {
  let component: TakeOfflineModalComponent;
  let fixture: ComponentFixture<TakeOfflineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeOfflineModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeOfflineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
