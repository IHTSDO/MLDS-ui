import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseConfigWarningModalComponent } from './release-config-warning-modal.component';

describe('ReleaseConfigWarningModalComponent', () => {
  let component: ReleaseConfigWarningModalComponent;
  let fixture: ComponentFixture<ReleaseConfigWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseConfigWarningModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseConfigWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
