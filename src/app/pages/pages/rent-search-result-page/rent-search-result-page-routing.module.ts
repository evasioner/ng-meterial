import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RentSearchResultPageComponent} from "./rent-search-result-page.component";

const routes: Routes = [
  {
    path: '',
    component: RentSearchResultPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentSearchResultPageRoutingModule { }
