import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSummaryBlockComponent } from './application-summary-block.component';

describe('ApplicationSummaryBlockComponent', () => {
  let component: ApplicationSummaryBlockComponent;
  let fixture: ComponentFixture<ApplicationSummaryBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationSummaryBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationSummaryBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
