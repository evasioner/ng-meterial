import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceCouponListComponent } from './travel-convenience-coupon-list.component';

describe('TravelConvenienceCouponListComponent', () => {
  let component: TravelConvenienceCouponListComponent;
  let fixture: ComponentFixture<TravelConvenienceCouponListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceCouponListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceCouponListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
