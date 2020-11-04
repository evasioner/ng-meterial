import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMileageListPageComponent } from './my-mileage-list-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyMileageListPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyMileageListPageRoutingModule { }
