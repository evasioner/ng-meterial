import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingInformationPageComponent } from './hotel-booking-information-page.component';

describe('HotelBookingInformationPageComponent', () => {
  let component: HotelBookingInformationPageComponent;
  let fixture: ComponentFixture<HotelBookingInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookingInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
