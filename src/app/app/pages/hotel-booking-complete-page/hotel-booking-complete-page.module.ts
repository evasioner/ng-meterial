import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelBookingCompletePageRoutingModule } from './hotel-booking-complete-page-routing.module';
import { CommonSourceModule } from '@/app/common-source/common-source.module';

import { HotelBookingCompletePageComponent } from './hotel-booking-complete-page.component';

@NgModule({
    declarations: [HotelBookingCompletePageComponent],
    imports: [
        CommonModule,
        HotelBookingCompletePageRoutingModule,
        CommonSourceModule
    ]
})
export class HotelBookingCompletePageModule { }
