import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCouponListComponent } from './activity-coupon-list.component';

describe('ActivityCouponListComponent', () => {
  let component: ActivityCouponListComponent;
  let fixture: ComponentFixture<ActivityCouponListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCouponListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCouponListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
