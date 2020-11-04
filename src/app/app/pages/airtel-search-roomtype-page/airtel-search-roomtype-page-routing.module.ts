import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AirtelSearchRoomtypePageComponent } from './airtel-search-roomtype-page.component';

const routes: Routes = [
  {
    path: '',
    component: AirtelSearchRoomtypePageComponent,
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
export class AirtelSearchRoomtypePageRoutingModule { }
