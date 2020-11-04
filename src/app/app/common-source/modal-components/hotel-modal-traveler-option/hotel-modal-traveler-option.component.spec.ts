import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalTravelerOptionComponent } from './hotel-modal-traveler-option.component';

describe('HotelModalTravelerOptionComponent', () => {
  let component: HotelModalTravelerOptionComponent;
  let fixture: ComponentFixture<HotelModalTravelerOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalTravelerOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalTravelerOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
