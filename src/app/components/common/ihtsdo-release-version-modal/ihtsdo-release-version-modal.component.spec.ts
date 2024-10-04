import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhtsdoReleaseVersionModalComponent } from './ihtsdo-release-version-modal.component';

describe('IhtsdoReleaseVersionModalComponent', () => {
  let component: IhtsdoReleaseVersionModalComponent;
  let fixture: ComponentFixture<IhtsdoReleaseVersionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IhtsdoReleaseVersionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IhtsdoReleaseVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
