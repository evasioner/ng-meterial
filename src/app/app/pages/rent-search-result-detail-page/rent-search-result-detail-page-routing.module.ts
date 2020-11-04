import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RentSearchResultDetailPageComponent} from "./rent-search-result-detail-page.component";

const routes: Routes = [
  {
    path: '',
    component: RentSearchResultDetailPageComponent
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
export class RentSearchResultDetailPageRoutingModule { }
