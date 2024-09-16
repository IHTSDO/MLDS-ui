import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateSummaryComponent } from './affiliate-summary.component';

describe('AffiliateSummaryComponent', () => {
  let component: AffiliateSummaryComponent;
  let fixture: ComponentFixture<AffiliateSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
