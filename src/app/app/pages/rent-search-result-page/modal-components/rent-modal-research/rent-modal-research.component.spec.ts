import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalResearchComponent } from './rent-modal-research.component';

describe('RentModalResearchComponent', () => {
  let component: RentModalResearchComponent;
  let fixture: ComponentFixture<RentModalResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
