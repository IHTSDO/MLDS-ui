import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberNotificationsComponent } from './edit-member-notifications.component';

describe('EditMemberNotificationsComponent', () => {
  let component: EditMemberNotificationsComponent;
  let fixture: ComponentFixture<EditMemberNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMemberNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMemberNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
