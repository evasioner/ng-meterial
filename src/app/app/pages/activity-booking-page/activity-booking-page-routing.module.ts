import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityBookingPageComponent } from './activity-booking-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivityBookingPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityBookingPageRoutingModule { }
