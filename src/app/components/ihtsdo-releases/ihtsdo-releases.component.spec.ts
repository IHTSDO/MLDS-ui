import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhtsdoReleasesComponent } from './ihtsdo-releases.component';

describe('IhtsdoReleasesComponent', () => {
  let component: IhtsdoReleasesComponent;
  let fixture: ComponentFixture<IhtsdoReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IhtsdoReleasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IhtsdoReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
