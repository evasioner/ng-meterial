import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReservationRentCancelPageRoutingModule } from './my-reservation-rent-cancel-page-routing.module';
import { MyReservationRentCancelPageComponent } from './my-reservation-rent-cancel-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyReservationRentCancelPageComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    FormsModule,
    MyReservationRentCancelPageRoutingModule
  ]
})
export class MyReservationRentCancelPageModule { }
