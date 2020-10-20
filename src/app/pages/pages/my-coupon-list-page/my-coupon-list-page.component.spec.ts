import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCouponListPageComponent } from './my-coupon-list-page.component';

describe('MyCouponListPageComponent', () => {
  let component: MyCouponListPageComponent;
  let fixture: ComponentFixture<MyCouponListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCouponListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCouponListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
