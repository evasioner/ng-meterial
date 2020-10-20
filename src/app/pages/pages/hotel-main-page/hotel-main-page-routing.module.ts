import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelMainPageComponent } from './hotel-main-page.component';


const routes: Routes = [
    {
        path: '',
        component: HotelMainPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HotelMainPageRoutingModule { }
