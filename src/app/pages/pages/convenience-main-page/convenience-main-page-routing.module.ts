import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConvenienceMainPageComponent} from "./convenience-main-page.component";


const routes: Routes = [
  {
    path: '',
    component: ConvenienceMainPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvenienceMainPageRoutingModule { }
