import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightCouponDownComponent } from './flight-coupon-down.component';

describe('FlightCouponDownComponent', () => {
  let component: FlightCouponDownComponent;
  let fixture: ComponentFixture<FlightCouponDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightCouponDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightCouponDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
