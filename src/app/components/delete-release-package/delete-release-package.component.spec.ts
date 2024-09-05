import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReleasePackageComponent } from './delete-release-package.component';

describe('DeleteReleasePackageComponent', () => {
  let component: DeleteReleasePackageComponent;
  let fixture: ComponentFixture<DeleteReleasePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteReleasePackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteReleasePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
