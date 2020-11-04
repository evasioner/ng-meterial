import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotelSearchResultPageComponent } from './hotel-search-result-page.component';

const routes: Routes = [
    {
        path: '',
        component: HotelSearchResultPageComponent
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
export class HotelSearchResultPageRoutingModule { }
