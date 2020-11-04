import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TravelConvenienceMainPageComponent} from "./travel-convenience-main-page.component";

/**
 * Children | 액티비티 메인
 */
export const childrenTravelConvenienceMain: Routes = [
];

const routes: Routes = [
  {
    path: '',
    component: TravelConvenienceMainPageComponent,
    children: childrenTravelConvenienceMain
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelConvenienceMainPageRoutingModule { }
