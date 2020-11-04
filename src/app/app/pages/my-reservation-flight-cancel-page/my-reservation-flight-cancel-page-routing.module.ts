import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationFlightCancelPageComponent } from './my-reservation-flight-cancel-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationFlightCancelPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationFlightCancelPageRoutingModule { }
