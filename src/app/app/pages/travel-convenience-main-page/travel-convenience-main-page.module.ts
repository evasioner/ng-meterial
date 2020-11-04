import { NgModule, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonSourceModule } from '../../common-source/common-source.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// store
// import * as storeActivityMainPage from "../../store/activity-page"; TODO

// 디렉티브
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// @ts-ignore
import * as translationKo from 'src/assets/i18n/activity-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/activity-page/en.json';
import { Observable, of } from 'rxjs';
import { TravelConvenienceMainPageRoutingModule } from './travel-convenience-main-page-routing.module';
import { TravelConvenienceMainPageComponent } from './travel-convenience-main-page.component';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { TravelConvenienceCouponListComponent } from './components/travel-convenience-coupon-list/travel-convenience-coupon-list.component';
import { TravelConvenienceCustomerEventComponent } from './components/travel-convenience-customer-event/travel-convenience-customer-event.component';
import { TravelConvenienceCustomerFreestyleComponent } from './components/travel-convenience-customer-freestyle/travel-convenience-customer-freestyle.component';
import { TravelConvenienceWifiListComponent } from './components/travel-convenience-wifi-list/travel-convenience-wifi-list.component';
import { TravelConvenienceUsimListComponent } from './components/travel-convenience-usim-list/travel-convenience-usim-list.component';
import { TravelConvenienceMainComponent } from './components/travel-convenience-main/travel-convenience-main.component';
import { TravelConvenienceSellerComponent } from './modal-components/travel-convenience-seller/travel-convenience-seller.component';

/**
 * 필수 디렉티브
 * PreventDefaultLinkDirective : a 태그 이동 방지
 */
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
        return new TranslateHttpLoader(http, 'assets/i18n/travel-convenience-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]


@NgModule({
    declarations: [
        TravelConvenienceMainPageComponent,
        TravelConvenienceCouponListComponent,
        TravelConvenienceCustomerEventComponent,
        TravelConvenienceCustomerFreestyleComponent,
        TravelConvenienceWifiListComponent,
        TravelConvenienceUsimListComponent,
        TravelConvenienceMainComponent,
        TravelConvenienceSellerComponent
    ],
    providers: [
        JwtService
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,

        TravelConvenienceMainPageRoutingModule,

        // 다국어
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        // store-page
        // StoreModule.forFeature(storeActivityMainPage.activityPageFeatureKey, storeActivityMainPage.reducers), TODO

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ]
})
export class TravelConvenienceMainPageModule { }
