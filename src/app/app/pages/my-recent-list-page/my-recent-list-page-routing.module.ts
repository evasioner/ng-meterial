import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyRecentListPageComponent } from './my-recent-list-page.component';
import { AllRecentListComponent } from './components/all-recent-list/all-recent-list.component';
import { FlightRecentListComponent } from './components/flight-recent-list/flight-recent-list.component';
import { HotelRecentListComponent } from './components/hotel-recent-list/hotel-recent-list.component';
import { ActivityRecentListComponent } from './components/activity-recent-list/activity-recent-list.component';
import { RentRecentListComponent } from './components/rent-recent-list/rent-recent-list.component';


const routes: Routes = [
  {
    path: '',
    component: MyRecentListPageComponent,
    //   children: [
    //     // 마이페이지 최근 본 상품 리스트 전체
    //     {
    //         path: 'all-recent-list',
    //         component: AllRecentListComponent,
    //     },
    //     // 마이페이지 최근 본 상품 리스트 항공
    //     {
    //         path: 'flight-recent-list',
    //         component: FlightRecentListComponent,
    //     },
    //     // 마이페이지 최근 본 상품 리스트 호텔
    //     {
    //         path: 'hotel-recent-list',
    //         component: HotelRecentListComponent,
    //     },
    //     // 마이페이지 최근 본 상품 리스트 액티비티
    //     {
    //         path: 'activity-recent-list',
    //         component: ActivityRecentListComponent,
    //     },
    //     // 마이페이지 최근 본 상품 리스트 렌터카
    //     {
    //         path: 'rent-recent-list',
    //         component: RentRecentListComponent,
    //     },

    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRecentListPageRoutingModule { }
