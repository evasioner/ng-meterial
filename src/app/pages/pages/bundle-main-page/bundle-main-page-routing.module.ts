import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BundleMainPageComponent} from "./bundle-main-page.component";



const routes: Routes = [
  {
    path: '',
    component: BundleMainPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BundleMainPageRoutingModule { }
