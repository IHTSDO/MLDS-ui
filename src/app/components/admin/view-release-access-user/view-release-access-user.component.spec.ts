import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReleaseAccessUserComponent } from './view-release-access-user.component';

describe('ViewReleaseAccessUserComponent', () => {
  let component: ViewReleaseAccessUserComponent;
  let fixture: ComponentFixture<ViewReleaseAccessUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReleaseAccessUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReleaseAccessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
