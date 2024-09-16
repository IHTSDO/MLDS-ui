import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveVersionsComponent } from './archive-versions.component';

describe('ArchiveVersionsComponent', () => {
  let component: ArchiveVersionsComponent;
  let fixture: ComponentFixture<ArchiveVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveVersionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
