import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightBookingPaymentPageComponent } from './flight-booking-payment-page.component';


const routes: Routes = [
    {
        path: '',
        component: FlightBookingPaymentPageComponent
    }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class FlightBookingPaymentPageRouting { }
