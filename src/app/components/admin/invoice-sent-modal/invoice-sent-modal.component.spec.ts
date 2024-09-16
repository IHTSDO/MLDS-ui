import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSentModalComponent } from './invoice-sent-modal.component';

describe('InvoiceSentModalComponent', () => {
  let component: InvoiceSentModalComponent;
  let fixture: ComponentFixture<InvoiceSentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceSentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceSentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
