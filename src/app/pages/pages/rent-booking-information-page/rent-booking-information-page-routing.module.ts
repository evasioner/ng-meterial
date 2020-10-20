import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RentBookingInformationPageComponent} from "./rent-booking-information-page.component";


const routes: Routes = [
  {
    path: '',
    component: RentBookingInformationPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentBookingInformationPageRoutingModule { }
