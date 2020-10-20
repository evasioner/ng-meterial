import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

import * as storeHotelSearchRoomtypePage from '../../store/hotel-search-roomtype-page';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AgmCoreModule } from '@agm/core';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { HotelSearchRoomtypPageRoutingModule } from './hotel-search-roomtyp-page-routing.module';

import { environment } from '@/environments/environment';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/hotel-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/hotel-main-page/en.json';

import { HotelSearchRoomtypePageComponent } from './hotel-search-roomtype-page.component';
import { HotelModalDetailImageComponent } from './modal-components/hotel-modal-detail-image/hotel-modal-detail-image.component';
import { HotelModalRoomInformationComponent } from './modal-components/hotel-modal-room-information/hotel-modal-room-information.component';

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
    declarations: [
        HotelSearchRoomtypePageComponent,
        HotelModalDetailImageComponent,
        HotelModalRoomInformationComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        HotelSearchRoomtypPageRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY,
            language: 'ko',
            region: 'KR'
        }),

        // 다국어
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        StoreModule.forFeature(storeHotelSearchRoomtypePage.hotelSearchRoomtypeFeatureKey, storeHotelSearchRoomtypePage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ]
})
export class HotelSearchRoomtypePageModule { }
