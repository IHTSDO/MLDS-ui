import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePermissionRemoveAlertModelComponent } from './release-permission-remove-alert-model.component';

describe('RelesePermissionRemoveAlertModelComponent', () => {
  let component: ReleasePermissionRemoveAlertModelComponent;
  let fixture: ComponentFixture<ReleasePermissionRemoveAlertModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasePermissionRemoveAlertModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleasePermissionRemoveAlertModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
