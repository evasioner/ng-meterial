import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirtelMainPageComponent } from './airtel-main-page.component';

const routes: Routes = [
  {
    path: '',
    component: AirtelMainPageComponent
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
export class AirtelMainPageRoutingModule { }
