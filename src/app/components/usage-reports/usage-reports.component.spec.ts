import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageReportsComponent } from './usage-reports.component';

describe('UsageReportsComponent', () => {
  let component: UsageReportsComponent;
  let fixture: ComponentFixture<UsageReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
