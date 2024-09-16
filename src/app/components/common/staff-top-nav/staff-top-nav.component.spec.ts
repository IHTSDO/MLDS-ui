import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTopNavComponent } from './staff-top-nav.component';

describe('StaffTopNavComponent', () => {
  let component: StaffTopNavComponent;
  let fixture: ComponentFixture<StaffTopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffTopNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
