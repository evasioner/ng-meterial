import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyFaqListPageComponent } from './my-faq-list-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyFaqListPageComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MyFaqListPageRoutingModule { }
