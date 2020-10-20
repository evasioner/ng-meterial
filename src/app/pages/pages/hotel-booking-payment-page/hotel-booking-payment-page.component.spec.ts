import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookingPaymentPageComponent } from './hotel-booking-payment-page.component';

describe('HotelBookingPaymentPageComponent', () => {
  let component: HotelBookingPaymentPageComponent;
  let fixture: ComponentFixture<HotelBookingPaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookingPaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookingPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
