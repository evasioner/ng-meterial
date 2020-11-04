import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyBasketListPageComponent } from './my-basket-list-page.component';
import { AllBasketListComponent } from './components/all-basket-list/all-basket-list.component';
import { FlightBasketListComponent } from './components/flight-basket-list/flight-basket-list.component';
import { HotelBasketListComponent } from './components/hotel-basket-list/hotel-basket-list.component';
import { ActivityBasketListComponent } from './components/activity-basket-list/activity-basket-list.component';
import { RentBasketListComponent } from './components/rent-basket-list/rent-basket-list.component';


const routes: Routes = [
    {
        path: '',
        component: MyBasketListPageComponent,
        // children: [
        //   // 마이페이지 위시 리스트 전체
        //   {
        //       path: 'all-basket-list',
        //       component: AllBasketListComponent,
        //   },
        //   // 마이페이지 위시 리스트 항공
        //   {
        //       path: 'flight-basket-list',
        //       component: FlightBasketListComponent,
        //   },
        //   // 마이페이지 위시 리스트 호텔
        //   {
        //       path: 'hotel-basket-list',
        //       component: HotelBasketListComponent,
        //   },
        //   // 마이페이지 위시 리스트 액티비티
        //   {
        //       path: 'activity-basket-list',
        //       component: ActivityBasketListComponent,
        //   },
        //   // 마이페이지 위시 리스트 렌터카
        //   {
        //       path: 'rent-basket-list',
        //       component: RentBasketListComponent,
        //   },

        // ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyBasketListPageRoutingModule { }
