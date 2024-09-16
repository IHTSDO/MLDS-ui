import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReleasesComponent } from './view-releases.component';

describe('ViewReleasesComponent', () => {
  let component: ViewReleasesComponent;
  let fixture: ComponentFixture<ViewReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReleasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
