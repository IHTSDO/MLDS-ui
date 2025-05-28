import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseViewPermissionComponent } from './release-view-permission.component';

describe('ReleaseViewPermissionComponent', () => {
  let component: ReleaseViewPermissionComponent;
  let fixture: ComponentFixture<ReleaseViewPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseViewPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseViewPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
