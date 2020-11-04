import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReservationQnaListPageComponent } from './my-reservation-qna-list-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReservationQnaListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReservationQnaListPageRoutingModule { }
