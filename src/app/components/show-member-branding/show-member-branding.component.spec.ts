import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMemberBrandingComponent } from './show-member-branding.component';

describe('ShowMemberBrandingComponent', () => {
  let component: ShowMemberBrandingComponent;
  let fixture: ComponentFixture<ShowMemberBrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMemberBrandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMemberBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
