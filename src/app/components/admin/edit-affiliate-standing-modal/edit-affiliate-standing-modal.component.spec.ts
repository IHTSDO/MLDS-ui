import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAffiliateStandingModalComponent } from './edit-affiliate-standing-modal.component';

describe('EditAffiliateStandingModalComponent', () => {
  let component: EditAffiliateStandingModalComponent;
  let fixture: ComponentFixture<EditAffiliateStandingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAffiliateStandingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAffiliateStandingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
