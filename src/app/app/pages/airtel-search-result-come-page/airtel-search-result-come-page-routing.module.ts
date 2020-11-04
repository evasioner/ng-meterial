import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirtelSearchResultComePageComponent } from './airtel-search-result-come-page.component';

const routes: Routes = [
  {
    path: '',
    component: AirtelSearchResultComePageComponent
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
export class AirtelSearchResultComePageRoutingModule { }
