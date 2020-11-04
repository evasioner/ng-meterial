import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingInformationPageComponent } from './flight-booking-information-page.component';

describe('FlightBookingInformationPageComponent', () => {
  let component: FlightBookingInformationPageComponent;
  let fixture: ComponentFixture<FlightBookingInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBookingInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBookingInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
