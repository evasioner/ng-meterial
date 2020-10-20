import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightBookingCompletePageComponent } from './flight-booking-complete-page.component';


const routes: Routes = [
  {
    path: '',
    component: FlightBookingCompletePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightBookingCompletePageRoutingModule { }
