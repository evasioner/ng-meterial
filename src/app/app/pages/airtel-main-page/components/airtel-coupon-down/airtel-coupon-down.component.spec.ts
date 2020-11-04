import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelCouponDownComponent } from './airtel-coupon-down.component';

describe('AirtelCouponDownComponent', () => {
  let component: AirtelCouponDownComponent;
  let fixture: ComponentFixture<AirtelCouponDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelCouponDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelCouponDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
