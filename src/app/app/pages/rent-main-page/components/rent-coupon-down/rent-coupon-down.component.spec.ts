import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCouponDownComponent } from './rent-coupon-down.component';

describe('RentCouponDownComponent', () => {
  let component: RentCouponDownComponent;
  let fixture: ComponentFixture<RentCouponDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentCouponDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentCouponDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
