import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RentSearchResultPageComponent} from "./rent-search-result-page.component";


const routes: Routes = [
  {
    path: '',
    component: RentSearchResultPageComponent
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
export class RentSearchResultPageRoutingModule { }
