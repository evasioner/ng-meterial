import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationRentCancelPageComponent } from './my-reservation-rent-cancel-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationRentCancelPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationRentCancelPageRoutingModule { }
