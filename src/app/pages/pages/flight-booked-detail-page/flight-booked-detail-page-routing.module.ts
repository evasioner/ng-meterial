import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightBookedDetailPageComponent } from './flight-booked-detail-page.component';


const routes: Routes = [
  {
    path: '',
    component: FlightBookedDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightBookedDetailPageRoutingModule { }
