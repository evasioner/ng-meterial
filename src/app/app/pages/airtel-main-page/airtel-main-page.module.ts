import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AirtelMainPageComponent } from './airtel-main-page.component';
import { AirtelCouponDownComponent } from './components/airtel-coupon-down/airtel-coupon-down.component';
import { AirtelCustomerEventComponent } from './components/airtel-customer-event/airtel-customer-event.component';
import { AirtelHotListComponent } from './components/airtel-hot-list/airtel-hot-list.component';
import { AirtelNewSearchListComponent } from './components/airtel-new-search-list/airtel-new-search-list.component';
import { AirtelMainSearchComponent } from './components/airtel-main-search/airtel-main-search.component';
import { ReactiveFormsModule } from '@angular/forms';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/airtel-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/airtel-main-page/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AirtelMainPageRoutingModule } from './airtel-main-page-routing.module';
import * as storeFlightMainPage from 'src/app/store/airtel-main-page';
import { StoreModule } from '@ngrx/store';

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
        return new TranslateHttpLoader(http, 'assets/i18n/airtel-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        AirtelMainPageComponent,
        AirtelCouponDownComponent,
        AirtelCustomerEventComponent,
        AirtelHotListComponent,
        AirtelNewSearchListComponent,
        AirtelMainSearchComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        RouterModule,
        ReactiveFormsModule,
        AirtelMainPageRoutingModule,

        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        StoreModule.forFeature(storeFlightMainPage.airtelMainSearchFeatureKey, storeFlightMainPage.reducers),

        ModalModule.forRoot()
    ]
})
export class AirtelMainPageModule { }
