import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelBookingCompletePageComponent } from './hotel-booking-complete-page.component';

const routes: Routes = [
  {
    path: '',
    component: HotelBookingCompletePageComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HotelBookingCompletePageRoutingModule { }
