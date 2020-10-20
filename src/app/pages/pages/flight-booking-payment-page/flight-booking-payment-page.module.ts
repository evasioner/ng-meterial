import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';

import { FlightBookingPaymentPageRoutingModule } from './flight-booking-payment-page-routing.module';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';


import { FlightBookingPaymentPageComponent } from './flight-booking-payment-page.component';

@NgModule({
    declarations: [
        FlightBookingPaymentPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        CommonSourceModule,
        ReactiveFormsModule,
        FlightBookingPaymentPageRoutingModule,
        MomentModule
    ]
})
export class FlightBookingPaymentPageModule { }
