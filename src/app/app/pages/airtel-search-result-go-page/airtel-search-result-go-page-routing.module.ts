import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirtelSearchResultGoPageComponent } from './airtel-search-result-go-page.component';

const routes: Routes = [
  {
    path: '',
    component: AirtelSearchResultGoPageComponent
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
export class AirtelSearchResultGoPageRoutingModule { }
