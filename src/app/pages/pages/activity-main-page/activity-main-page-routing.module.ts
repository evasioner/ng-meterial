import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActivityMainPageComponent} from "./activity-main-page.component";


const routes: Routes = [
  {
    path: '',
    component: ActivityMainPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityMainPageRoutingModule { }
