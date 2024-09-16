import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoginModalComponent } from './create-login-modal.component';

describe('CreateLoginModalComponent', () => {
  let component: CreateLoginModalComponent;
  let fixture: ComponentFixture<CreateLoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLoginModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
