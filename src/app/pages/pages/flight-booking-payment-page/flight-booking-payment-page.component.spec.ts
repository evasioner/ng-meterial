import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingPaymentPageComponent } from './flight-booking-payment-page.component';

describe('FlightBookingPaymentComponent', () => {
  let component: FlightBookingPaymentPageComponent;
  let fixture: ComponentFixture<FlightBookingPaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBookingPaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBookingPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
