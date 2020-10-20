import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightBookingCompletePageRoutingModule } from './flight-booking-complete-page-routing.module';
import { FlightBookingCompletePageComponent } from './flight-booking-complete-page.component';
import { RouterModule } from '@angular/router';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FlightBookingCompletePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CommonSourceModule,
    ReactiveFormsModule,
    FlightBookingCompletePageRoutingModule
  ]
})
export class FlightBookingCompletePageModule { }
