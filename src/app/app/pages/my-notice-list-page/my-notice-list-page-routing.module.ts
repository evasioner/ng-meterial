import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyNoticeListPageComponent } from './my-notice-list-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyNoticeListPageComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MyNoticeListPageRoutingModule { }
