import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightBookedDetailPageRoutingModule } from './flight-booked-detail-page-routing.module';
import { FlightBookedDetailPageComponent } from './flight-booked-detail-page.component';
import { RouterModule } from '@angular/router';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { AccordionModule } from 'ngx-bootstrap/accordion';


@NgModule({
  declarations: [
    FlightBookedDetailPageComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    RouterModule,
    ReactiveFormsModule,
    FlightBookedDetailPageRoutingModule,
    MomentModule,
    FormsModule,

    AccordionModule.forRoot()
  ]
})
export class FlightBookedDetailPageModule { }
