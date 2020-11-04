import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCouponListPageComponent } from './my-coupon-list-page.component';
import { PossesionCouponComponent } from './component/possesion-coupon/possesion-coupon.component';
import { CouponZoneComponent } from './component/coupon-zone/coupon-zone.component';

const routes: Routes = [
  {
    path: '',
    component: MyCouponListPageComponent,
    children: [
      // 마이페이지 고객문의 예약문의
      {
          path: 'possesion-coupon',
          component: PossesionCouponComponent,
      },
      // 마이페이지 고객문의 상품문의
      {
          path: 'coupon-zone',
          component: CouponZoneComponent,
      },
      
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCouponListPageRoutingModule { }
