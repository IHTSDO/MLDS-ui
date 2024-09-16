import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePackageLicenseModalComponent } from './release-package-license-modal.component';

describe('ReleasePackageLicenseModalComponent', () => {
  let component: ReleasePackageLicenseModalComponent;
  let fixture: ComponentFixture<ReleasePackageLicenseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasePackageLicenseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleasePackageLicenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
