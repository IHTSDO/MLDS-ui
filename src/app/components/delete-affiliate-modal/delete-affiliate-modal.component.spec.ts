import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAffiliateModalComponent } from './delete-affiliate-modal.component';

describe('DeleteAffiliateModalComponent', () => {
  let component: DeleteAffiliateModalComponent;
  let fixture: ComponentFixture<DeleteAffiliateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAffiliateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAffiliateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
