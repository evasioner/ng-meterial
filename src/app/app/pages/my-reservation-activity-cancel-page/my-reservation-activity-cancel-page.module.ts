import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReservationActivityCancelPageRoutingModule } from './my-reservation-activity-cancel-page-routing.module';
import { MyReservationActivityCancelPageComponent } from './my-reservation-activity-cancel-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyReservationActivityCancelPageComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    FormsModule,
    MyReservationActivityCancelPageRoutingModule
  ]
})
export class MyReservationActivityCancelPageModule { }
