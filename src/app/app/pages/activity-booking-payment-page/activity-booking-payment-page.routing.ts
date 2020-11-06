import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityBookingPaymentPageComponent } from './activity-booking-payment-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivityBookingPaymentPageComponent
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityBookingPaymentPageRoutes { }
