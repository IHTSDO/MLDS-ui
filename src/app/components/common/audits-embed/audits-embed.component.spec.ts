import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditsEmbedComponent } from './audits-embed.component';

describe('AuditsEmbedComponent', () => {
  let component: AuditsEmbedComponent;
  let fixture: ComponentFixture<AuditsEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditsEmbedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditsEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
