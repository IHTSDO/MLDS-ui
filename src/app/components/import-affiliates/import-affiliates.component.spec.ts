import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAffiliatesComponent } from './import-affiliates.component';

describe('ImportAffiliatesComponent', () => {
  let component: ImportAffiliatesComponent;
  let fixture: ComponentFixture<ImportAffiliatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportAffiliatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
