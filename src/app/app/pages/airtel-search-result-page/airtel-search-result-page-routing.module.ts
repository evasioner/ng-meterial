import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AirtelSearchResultPageComponent } from './airtel-search-result-page.component';

const routes: Routes = [
  {
    component: AirtelSearchResultPageComponent,
    path: '',
  },
];

@NgModule({
  declarations: [],
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class AirtelSearchResultPageRoutingModule { }
