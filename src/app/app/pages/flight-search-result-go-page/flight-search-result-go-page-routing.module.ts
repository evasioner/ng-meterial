import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchResultGoPageComponent } from './flight-search-result-go-page.component';

const routes: Routes = [
  {
    path: '',
    component: FlightSearchResultGoPageComponent
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
export class FlightSearchResultGoPageRoutingModule { }
