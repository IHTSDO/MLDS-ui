import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAutoDeactivateConfigComponent } from './open-auto-deactivate-config.component';

describe('OpenAutoDeactivateConfigComponent', () => {
  let component: OpenAutoDeactivateConfigComponent;
  let fixture: ComponentFixture<OpenAutoDeactivateConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenAutoDeactivateConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenAutoDeactivateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
