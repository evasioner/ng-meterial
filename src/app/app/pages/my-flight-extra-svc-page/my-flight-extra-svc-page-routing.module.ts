import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyFlightExtraSvcPageComponent } from './my-flight-extra-svc-page.component';


const routes: Routes = [
  {
    path: '',
    component: MyFlightExtraSvcPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyFlightExtraSvcPageRoutingModule { }
