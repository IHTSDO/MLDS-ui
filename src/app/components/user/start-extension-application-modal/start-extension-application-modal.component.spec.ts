import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartExtensionApplicationModalComponent } from './start-extension-application-modal.component';

describe('StartExtensionApplicationModalComponent', () => {
  let component: StartExtensionApplicationModalComponent;
  let fixture: ComponentFixture<StartExtensionApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartExtensionApplicationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartExtensionApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
