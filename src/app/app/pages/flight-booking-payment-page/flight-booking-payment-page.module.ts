import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';

import { FlightBookingPaymentPageRouting } from './flight-booking-payment-page.routing';

import { FlightBookingPaymentPageComponent } from './flight-booking-payment-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommonSourceModule,
        ReactiveFormsModule,
        FlightBookingPaymentPageRouting,

        ModalModule.forRoot()
    ],
    declarations: [FlightBookingPaymentPageComponent]
})
export class FlightBookingPaymentPageModule { }
