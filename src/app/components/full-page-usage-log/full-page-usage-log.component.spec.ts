import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPageUsageLogComponent } from './full-page-usage-log.component';

describe('FullPageUsageLogComponent', () => {
  let component: FullPageUsageLogComponent;
  let fixture: ComponentFixture<FullPageUsageLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullPageUsageLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullPageUsageLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
