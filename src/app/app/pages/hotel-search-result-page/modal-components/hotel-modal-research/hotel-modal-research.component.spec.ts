import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalResearchComponent } from './hotel-modal-research.component';

describe('HotelModalResearchComponent', () => {
  let component: HotelModalResearchComponent;
  let fixture: ComponentFixture<HotelModalResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
