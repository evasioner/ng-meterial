import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelSearchResultMapPageComponent } from './hotel-search-result-map-page.component';


const routes: Routes = [
  {
    path: '',
    component: HotelSearchResultMapPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelSearchResultMapPageRoutingModule { }
