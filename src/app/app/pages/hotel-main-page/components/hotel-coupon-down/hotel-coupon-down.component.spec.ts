import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCouponDownComponent } from './hotel-coupon-down.component';

describe('HotelCouponDownComponent', () => {
  let component: HotelCouponDownComponent;
  let fixture: ComponentFixture<HotelCouponDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCouponDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCouponDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
