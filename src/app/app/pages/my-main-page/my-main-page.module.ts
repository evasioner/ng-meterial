import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMainPageRoutingModule } from './my-main-page-routing.module';
import { MyMainPageComponent } from './my-main-page.component';
import { MyMainContentsComponent } from './components/my-main-contents/my-main-contents.component';
import { RouterModule } from '@angular/router';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { MyMainModalComponent } from './modal-components/my-main-modal/my-main-modal.component';


@NgModule({
  declarations: [
    MyMainPageComponent,
    MyMainContentsComponent,
    MyMainModalComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    CommonSourceModule,

    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    MyMainPageRoutingModule
  ]
})
export class MyMainPageModule { }
