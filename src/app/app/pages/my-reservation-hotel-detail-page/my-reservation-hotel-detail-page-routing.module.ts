import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationHotelDetailPageComponent } from './my-reservation-hotel-detail-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationHotelDetailPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationHotelDetailPageRoutingModule { }
