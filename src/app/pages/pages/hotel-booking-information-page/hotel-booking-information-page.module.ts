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
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MomentModule } from 'ngx-moment';

import { CommonSourceModule } from '../../common-source/common-source.module';

// store
import * as storeHotelBookingInformationPage from 'src/app/store/hotel-booking-information-page';

import { HotelBookingInformationPageRoutingModule } from './hotel-booking-information-page-routing.module';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/hotel-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/hotel-main-page/en.json';

import { HotelBookingInformationPageComponent } from './hotel-booking-information-page.component';
import { HotelModalAgreementComponent } from './modal-components/hotel-modal-agreement/hotel-modal-agreement.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/hotel-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]

@NgModule({
    declarations: [HotelBookingInformationPageComponent, HotelModalAgreementComponent],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        HotelBookingInformationPageRoutingModule,

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
        StoreModule.forFeature(storeHotelBookingInformationPage.hotelBookingInformationPageFeatureKey, storeHotelBookingInformationPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot(),
        TabsModule.forRoot()
    ]
})
export class HotelBookingInformationPageModule { }
