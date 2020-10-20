import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponZoneComponent } from './coupon-zone.component';

describe('CouponZoneComponent', () => {
  let component: CouponZoneComponent;
  let fixture: ComponentFixture<CouponZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
