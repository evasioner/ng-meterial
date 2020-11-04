import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelSearchRoomtypePageComponent } from './hotel-search-roomtype-page.component';

const routes: Routes = [
  {
    path: '',
    component: HotelSearchRoomtypePageComponent
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
export class HotelSearchRoomtypePageRoutingModule { }
