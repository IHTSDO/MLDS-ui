import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageReportsTableComponent } from './usage-reports-table.component';

describe('UsageReportsTableComponent', () => {
  let component: UsageReportsTableComponent;
  let fixture: ComponentFixture<UsageReportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageReportsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageReportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
