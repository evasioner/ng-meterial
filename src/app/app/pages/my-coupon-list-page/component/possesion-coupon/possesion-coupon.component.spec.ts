import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PossesionCouponComponent } from './possesion-coupon.component';

describe('PossesionCouponComponent', () => {
  let component: PossesionCouponComponent;
  let fixture: ComponentFixture<PossesionCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PossesionCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PossesionCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
