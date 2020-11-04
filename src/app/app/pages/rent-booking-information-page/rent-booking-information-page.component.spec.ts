import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentBookingInformationPageComponent } from './rent-booking-information-page.component';

describe('RentBookingInformationPageComponent', () => {
  let component: RentBookingInformationPageComponent;
  let fixture: ComponentFixture<RentBookingInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentBookingInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentBookingInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
