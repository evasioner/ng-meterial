import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';


import { StoreModule } from '@ngrx/store';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MomentModule } from 'ngx-moment';

import { MyReservationListPageRoutingModule } from './my-reservation-list-page-routing.module';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';

import * as storeMyReservationListPage from 'src/app/store/my-reservation-list-page';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/mypage-reservation-list/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/mypage-reservation-list/en.json';

// import { DateSearchComponent } from './components/date-search/date-search.component';
import { MyReservationListPageComponent } from './my-reservation-list-page.component';
import { AllReservationListComponent } from './components/all-reservation-list/all-reservation-list.component';
import { FlightReservationListComponent } from './components/flight-reservation-list/flight-reservation-list.component';
import { HotelReservationListComponent } from './components/hotel-reservation-list/hotel-reservation-list.component';
import { ActivityReservationListComponent } from './components/activity-reservation-list/activity-reservation-list.component';
import { RentReservationListComponent } from './components/rent-reservation-list/rent-reservation-list.component';
import { AirtelReservationListComponent } from './components/airtel-reservation-list/airtel-reservation-list.component';

// ------------------------------------[다국어]
/**
 * 다국어 처리
 * 서버와 클라이언트에서의 분기 처리 추가
 */
const TRANSLATIONS = {
    ko: translationKo,
    en: translationEn
};

export class JSONModuleLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(TRANSLATIONS[lang]);
    }
}

export function JSONModuleLoaderFactory(http: HttpClient, platform) {
    if (isPlatformBrowser(platform)) {
        return new TranslateHttpLoader(http, 'assets/i18n/mypage-reservation-list/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        MyReservationListPageComponent,
        AllReservationListComponent,
        FlightReservationListComponent,
        HotelReservationListComponent,
        ActivityReservationListComponent,
        RentReservationListComponent,
        AirtelReservationListComponent,
        // DateSearchComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        InfiniteScrollModule,

        MyReservationListPageRoutingModule,

        // 다국어
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        // store-page
        StoreModule.forFeature(storeMyReservationListPage.myReservationListPageFeatureKey, storeMyReservationListPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ]
})
export class MyReservationListPageModule { }



