import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyReservationListPageComponent } from './my-reservation-list-page.component';

const routes: Routes = [
    {
        path: '',
        component: MyReservationListPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyReservationListPageRoutingModule { }
