import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseFileDownloadCountComponent } from './release-file-download-count.component';

describe('ReleaseFileDownloadCountComponent', () => {
  let component: ReleaseFileDownloadCountComponent;
  let fixture: ComponentFixture<ReleaseFileDownloadCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseFileDownloadCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseFileDownloadCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
