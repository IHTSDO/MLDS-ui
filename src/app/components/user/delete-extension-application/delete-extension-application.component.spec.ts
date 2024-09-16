import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExtensionApplicationComponent } from './delete-extension-application.component';

describe('DeleteExtensionApplicationComponent', () => {
  let component: DeleteExtensionApplicationComponent;
  let fixture: ComponentFixture<DeleteExtensionApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteExtensionApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteExtensionApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
