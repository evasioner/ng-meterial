import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelBookingPaymentPageComponent } from './hotel-booking-payment-page.component';



const routes: Routes = [
  {
    path: '',
    component: HotelBookingPaymentPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelBookingPaymentPageRoutingModule { }
