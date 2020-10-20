import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingCompletePageComponent } from './hotel-booking-complete-page.component';

describe('HotelBookingCompletePageComponent', () => {
  let component: HotelBookingCompletePageComponent;
  let fixture: ComponentFixture<HotelBookingCompletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookingCompletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
