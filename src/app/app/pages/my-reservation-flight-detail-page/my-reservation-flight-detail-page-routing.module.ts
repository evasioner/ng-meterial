import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationFlightDetailPageComponent } from './my-reservation-flight-detail-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationFlightDetailPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationFlightDetailPageRoutingModule { }
