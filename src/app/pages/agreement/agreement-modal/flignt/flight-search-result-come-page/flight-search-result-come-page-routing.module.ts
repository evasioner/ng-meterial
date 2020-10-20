import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchResultComePageComponent } from './flight-search-result-come-page.component';

const routes: Routes = [
  {
    path: '',
    component: FlightSearchResultComePageComponent
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
export class FlightSearchResultComePageRoutingModule { }
