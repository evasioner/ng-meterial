import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightMainPageComponent } from './flight-main-page.component';

const routes: Routes = [
  {
    path: '',
    component: FlightMainPageComponent
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
export class FlightMainPageRoutingModule { }
