import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseManagementComponent } from './release-management.component';

describe('ReleaseManagementComponent', () => {
  let component: ReleaseManagementComponent;
  let fixture: ComponentFixture<ReleaseManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
