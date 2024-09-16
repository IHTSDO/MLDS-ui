import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCountDataAnalysisComponent } from './edit-count-data-analysis.component';

describe('EditCountDataAnalysisComponent', () => {
  let component: EditCountDataAnalysisComponent;
  let fixture: ComponentFixture<EditCountDataAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCountDataAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCountDataAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
