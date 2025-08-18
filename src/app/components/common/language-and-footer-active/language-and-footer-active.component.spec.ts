import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageAndFooterActiveComponent } from './language-and-footer-active.component';

describe('LanguageAndFooterActiveComponent', () => {
  let component: LanguageAndFooterActiveComponent;
  let fixture: ComponentFixture<LanguageAndFooterActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageAndFooterActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageAndFooterActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
