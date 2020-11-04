import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyReservationListPageComponent } from './my-reservation-list-page.component';


const routes: Routes = [
    {
        path: '',
        component: MyReservationListPageComponent,
        //   children: [
        // 마이페이지 예약 리스트 전체
        //     {
        //         path: 'all-reservation-list',
        //         component: AllReservationListComponent,
        //     },
        // 마이페이지 예약 리스트 항공
        //     {
        //         path: 'flight-reservation-list',
        //         component: FlightReservationListComponent,
        //     },
        // 마이페이지 예약 리스트 호텔
        //     {
        //         path: 'hotel-reservation-list',
        //         component: HotelReservationListComponent,
        //     },
        // 마이페이지 예약 리스트 액티비티
        //     {
        //         path: 'activity-reservation-list',
        //         component: ActivityReservationListComponent,
        //     },
        // 마이페이지 예약 리스트 렌터카
        //     {
        //         path: 'rent-reservation-list',
        //         component: RentReservationListComponent,
        //     },
        // 마이페이지 예약 리스트 묶음할인
        //     {
        //         path: 'airtel-reservation-list',
        //         component: AirtelReservationListComponent,
        //     },

        // ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyReservationListRoutingModule { }
