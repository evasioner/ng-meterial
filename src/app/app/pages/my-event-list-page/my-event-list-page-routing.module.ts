import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyEventListPageComponent } from './my-event-list-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyEventListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyEventListPageRoutingModule { }
