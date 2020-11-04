import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelBookingInformationPageComponent } from './hotel-booking-information-page.component';

const routes: Routes = [
  {
    path: '',
    component: HotelBookingInformationPageComponent
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
export class HotelBookingInformationPageRoutingModule { }
