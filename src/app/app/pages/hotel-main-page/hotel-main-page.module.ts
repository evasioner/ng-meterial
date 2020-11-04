import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

// store
import * as storeHotelMainSearch from 'src/app/store/hotel-main-page';

// ngx-bootstrap
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HotelMainPageRoutingModule } from './hotel-main-page-routing.module';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/hotel-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/hotel-main-page/en.json';

import { HotelMainPageComponent } from './hotel-main-page.component';
import { HotelCouponDownComponent } from './components/hotel-coupon-down/hotel-coupon-down.component';
import { HotelCustomerEventComponent } from './components/hotel-customer-event/hotel-customer-event.component';
import { HotelHotListComponent } from './components/hotel-hot-list/hotel-hot-list.component';
import { HotelMainSearchComponent } from './components/hotel-main-search/hotel-main-search.component';
import { HotelNewSearchListComponent } from './components/hotel-new-search-list/hotel-new-search-list.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/hotel-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

@NgModule({
    declarations: [
        HotelMainPageComponent,
        HotelCouponDownComponent,
        HotelCustomerEventComponent,
        HotelHotListComponent,
        HotelMainSearchComponent,
        HotelNewSearchListComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        HotelMainPageRoutingModule,
        // store-page
        StoreModule.forFeature(storeHotelMainSearch.hotelMainSearchFeatureKey, storeHotelMainSearch.reducers),
        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot(),


        // 다국어
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),
    ]
})
export class HotelMainPageModule { }
