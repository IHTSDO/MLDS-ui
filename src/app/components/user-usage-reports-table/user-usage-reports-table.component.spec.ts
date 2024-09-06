import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUsageReportsTableComponent } from './user-usage-reports-table.component';

describe('UserUsageReportsTableComponent', () => {
  let component: UserUsageReportsTableComponent;
  let fixture: ComponentFixture<UserUsageReportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUsageReportsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUsageReportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
