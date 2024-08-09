import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeedDataComponent } from './edit-feed-data.component';

describe('EditFeedDataComponent', () => {
  let component: EditFeedDataComponent;
  let fixture: ComponentFixture<EditFeedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeedDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFeedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
