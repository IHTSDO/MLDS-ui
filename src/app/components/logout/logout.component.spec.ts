import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogotComponent } from './logout.component';

describe('LogotComponent', () => {
  let component: LogotComponent;
  let fixture: ComponentFixture<LogotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
