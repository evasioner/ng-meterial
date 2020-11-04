import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RentMainPageComponent} from "./rent-main-page.component";

const routes: Routes = [
  {
    path: '',
    component: RentMainPageComponent
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
export class RentMainPageRoutingModule { }
