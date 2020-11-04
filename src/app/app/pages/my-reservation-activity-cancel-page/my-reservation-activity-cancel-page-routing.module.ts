import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationActivityCancelPageComponent } from './my-reservation-activity-cancel-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationActivityCancelPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationActivityCancelPageRoutingModule { }
