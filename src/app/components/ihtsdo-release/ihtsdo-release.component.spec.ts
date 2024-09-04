import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhtsdoReleaseComponent } from './ihtsdo-release.component';

describe('IhtsdoReleaseComponent', () => {
  let component: IhtsdoReleaseComponent;
  let fixture: ComponentFixture<IhtsdoReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IhtsdoReleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IhtsdoReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
