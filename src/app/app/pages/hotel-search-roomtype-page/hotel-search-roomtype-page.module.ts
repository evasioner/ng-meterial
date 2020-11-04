import { NgModule, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HotelSearchRoomtypePageComponent } from './hotel-search-roomtype-page.component';
import { HotelSearchRoomtypePageRoutingModule } from './hotel-search-roomtype-page-routing.module';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { AgmCoreModule } from '@agm/core';

// store
import * as storeHotelSearchRoomtypePage from '../../store/hotel-search-roomtype-page';

// 디렉티브
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// @ts-ignore
import * as translationKo from 'src/assets/i18n/hotel-search-roomtype-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/hotel-search-roomtype-page/en.json';
import { Observable, of } from 'rxjs';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { environment } from '@/environments/environment';
import { HotelModalLocationMapModule } from './modal-components/hotel-modal-location-map/hotel-modal-location-map.module';
import { HotelModalReviewComponent } from './modal-components/hotel-modal-review/hotel-modal-review.component';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotelModalRoomtypeDetailComponent } from './modal-components/hotel-modal-roomtype-detail/hotel-modal-roomtype-detail.component';
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
        return new TranslateHttpLoader(http, 'assets/i18n/hotel-search-roomtype-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]
@NgModule({
    declarations: [
        HotelSearchRoomtypePageComponent,
        HotelModalReviewComponent,
        HotelModalRoomtypeDetailComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        HotelSearchRoomtypePageRoutingModule,
        HotelModalLocationMapModule,
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY,
            language: 'ko',
            region: 'KR'
        }),

        // 다국어
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        StoreModule.forFeature(storeHotelSearchRoomtypePage.hotelSearchRoomtypePageFeatureKey, storeHotelSearchRoomtypePage.reducers),
        ModalModule.forRoot()

    ]
})
export class HotelSearchRoomtypePageModule { }
