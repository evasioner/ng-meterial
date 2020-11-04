import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActivityPageComponent} from "./activity-page.component";


const routes: Routes = [
  {
    path: '',
    component: ActivityPageComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ActivityMainPageRoutingModule { }
