import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationRentDetailPageComponent } from './my-reservation-rent-detail-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationRentDetailPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationRentDetailPageRoutingModule { }
