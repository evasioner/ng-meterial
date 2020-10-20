import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelBookedDetailPageComponent } from './hotel-booked-detail-page.component';


const routes: Routes = [
  {
    path: '',
    component: HotelBookedDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelBookedDetailPageRoutingModule { }
