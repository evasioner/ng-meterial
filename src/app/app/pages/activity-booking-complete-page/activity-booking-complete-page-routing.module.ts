import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityBookingCompletePageComponent } from './activity-booking-complete-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivityBookingCompletePageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityBookingCompletePageRoutingModule { }
