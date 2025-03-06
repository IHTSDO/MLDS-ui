import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserDetailsComponent } from './show-user-details.component';

describe('ShowUserDetailsComponent', () => {
  let component: ShowUserDetailsComponent;
  let fixture: ComponentFixture<ShowUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUserDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
