import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeAlphaBetaModalComponent } from './take-alpha-beta-modal.component';

describe('TakeAlphaBetaModalComponent', () => {
  let component: TakeAlphaBetaModalComponent;
  let fixture: ComponentFixture<TakeAlphaBetaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeAlphaBetaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeAlphaBetaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
