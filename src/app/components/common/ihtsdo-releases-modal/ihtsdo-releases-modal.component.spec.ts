import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhtsdoReleasesModalComponent } from './ihtsdo-releases-modal.component';

describe('IhtsdoReleasesModalComponent', () => {
  let component: IhtsdoReleasesModalComponent;
  let fixture: ComponentFixture<IhtsdoReleasesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IhtsdoReleasesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IhtsdoReleasesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
