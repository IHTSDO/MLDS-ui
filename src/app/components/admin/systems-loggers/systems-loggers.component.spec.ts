import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsLoggersComponent } from './systems-loggers.component';

describe('SystemsLoggersComponent', () => {
  let component: SystemsLoggersComponent;
  let fixture: ComponentFixture<SystemsLoggersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemsLoggersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemsLoggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
