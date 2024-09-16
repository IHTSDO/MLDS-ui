import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReleaseComponent } from './view-release.component';

describe('ViewReleaseComponent', () => {
  let component: ViewReleaseComponent;
  let fixture: ComponentFixture<ViewReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
