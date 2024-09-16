import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateRegistrationComponent } from './affiliate-registration.component';

describe('AffiliateRegistrationComponent', () => {
  let component: AffiliateRegistrationComponent;
  let fixture: ComponentFixture<AffiliateRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliateRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
