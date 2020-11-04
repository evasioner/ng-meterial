import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationHotelCancelPageComponent } from './my-reservation-hotel-cancel-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationHotelCancelPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationHotelCancelPageRoutingModule { }
