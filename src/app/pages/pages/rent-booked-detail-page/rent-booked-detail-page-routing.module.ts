import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RentBookedDetailPageComponent} from "./rent-booked-detail-page.component";


const routes: Routes = [
  {
    path: '',
    component: RentBookedDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentBookedDetailPageRoutingModule { }
