import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationActivityDetailPageComponent } from './my-reservation-activity-detail-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationActivityDetailPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationActivityDetailPageRoutingModule { }
