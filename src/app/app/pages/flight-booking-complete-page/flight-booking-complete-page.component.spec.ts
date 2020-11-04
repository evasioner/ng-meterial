import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingCompletePageComponent } from './flight-booking-complete-page.component';

describe('FlightBookingCompletePageComponent', () => {
  let component: FlightBookingCompletePageComponent;
  let fixture: ComponentFixture<FlightBookingCompletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBookingCompletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBookingCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
