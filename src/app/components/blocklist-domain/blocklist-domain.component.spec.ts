import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocklistDomainComponent } from './blocklist-domain.component';

describe('BlocklistDomainComponent', () => {
  let component: BlocklistDomainComponent;
  let fixture: ComponentFixture<BlocklistDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocklistDomainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocklistDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
