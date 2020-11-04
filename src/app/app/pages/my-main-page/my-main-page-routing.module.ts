import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMainPageComponent } from '../my-main-page/my-main-page.component';
import { MyMainModalComponent } from './modal-components/my-main-modal/my-main-modal.component';


const routes: Routes = [
  {
    path: '',
    component: MyMainPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyMainPageRoutingModule { }
