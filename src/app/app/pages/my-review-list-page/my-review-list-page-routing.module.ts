import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyReviewListPageComponent } from './my-review-list-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyReviewListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReviewListPageRoutingModule { }
