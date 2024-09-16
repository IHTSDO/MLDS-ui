import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddableUsageLogComponent } from './embeddable-usage-log.component';

describe('EmbeddableUsageLogComponent', () => {
  let component: EmbeddableUsageLogComponent;
  let fixture: ComponentFixture<EmbeddableUsageLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbeddableUsageLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmbeddableUsageLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
