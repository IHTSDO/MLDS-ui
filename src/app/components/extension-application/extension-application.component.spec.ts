import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionApplicationComponent } from './extension-application.component';

describe('ExtensionApplicationComponent', () => {
  let component: ExtensionApplicationComponent;
  let fixture: ComponentFixture<ExtensionApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtensionApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtensionApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
