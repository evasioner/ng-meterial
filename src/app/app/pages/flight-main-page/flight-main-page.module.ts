import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { RouterModule } from '@angular/router';
import { FlightCouponDownComponent } from './components/flight-coupon-down/flight-coupon-down.component';
import { FlightCustomerEventComponent } from './components/flight-customer-event/flight-customer-event.component';
import { FlightHotListComponent } from './components/flight-hot-list/flight-hot-list.component';
import { FlightMainSearchComponent } from './components/flight-main-search/flight-main-search.component';
import { FlightNewSearchListComponent } from './components/flight-new-search-list/flight-new-search-list.component';
import { FlightMainPageComponent } from './flight-main-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as storeFlightMainPage from 'src/app/store/flight-main-page';
import * as storeFlightCommon from 'src/app/store/flight-common';
import { FlightMainPageRoutingModule } from './flight-main-page-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/flight-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/flight-main-page/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'ngx-moment';


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
        return new TranslateHttpLoader(http, 'assets/i18n/flight-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]


@NgModule({
    declarations: [
        FlightCouponDownComponent,
        FlightCustomerEventComponent,
        FlightHotListComponent,
        FlightMainSearchComponent,
        FlightNewSearchListComponent,
        FlightMainPageComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        RouterModule,
        ReactiveFormsModule,
        FlightMainPageRoutingModule,
        MomentModule,

        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        StoreModule.forFeature(storeFlightMainPage.flightMainSearchFeatureKey, storeFlightMainPage.reducers),
        StoreModule.forFeature(storeFlightCommon.flightCommonFeatureKey, storeFlightCommon.reducers),

        ModalModule.forRoot()
    ]
})
export class FlightMainPageModule { }
