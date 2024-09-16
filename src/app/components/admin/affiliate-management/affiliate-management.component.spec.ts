import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateManagementComponent } from './affiliate-management.component';

describe('AffiliateManagementComponent', () => {
  let component: AffiliateManagementComponent;
  let fixture: ComponentFixture<AffiliateManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
