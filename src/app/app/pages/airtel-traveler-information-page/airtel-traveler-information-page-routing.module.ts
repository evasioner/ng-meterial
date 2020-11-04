import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AirtelTravelerInformationPageComponent } from './airtel-traveler-information-page.component';

const routes: Routes = [
  {
    path: '',
    component: AirtelTravelerInformationPageComponent,
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
export class AirtelTravelerInformationPageRoutingModule { }
