import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityBookingInformationPageComponent } from './activity-booking-information-page.component';

const routes: Routes = [
    {
        path: '',
        component: ActivityBookingInformationPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityBookingInformationPageRouting { }
