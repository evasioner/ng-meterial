import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';

import { HotelBookingPaymentPageRouting } from './hotel-booking-payment-page.routing';

import { CommonSourceModule } from '@/app/common-source/common-source.module';

import { HotelBookingPaymentPageComponent } from './hotel-booking-payment-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        HotelBookingPaymentPageRouting,

        CommonSourceModule
    ],
    declarations: [HotelBookingPaymentPageComponent]
})
export class HotelBookingPaymentPageModule { }
