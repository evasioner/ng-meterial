import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchResultMultiPageComponent } from './flight-search-result-multi-page.component';

const routes: Routes = [
  {
    path: '',
    component: FlightSearchResultMultiPageComponent
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
export class FlightSearchResultMultiPageRoutingModule { }
