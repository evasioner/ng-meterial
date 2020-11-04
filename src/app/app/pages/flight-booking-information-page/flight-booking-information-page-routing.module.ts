import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightBookingInformationPageComponent } from './flight-booking-information-page.component';

const routes: Routes = [
  {
    path: '',
    component: FlightBookingInformationPageComponent
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
export class FlightBookingInformationPageRoutingModule { }
