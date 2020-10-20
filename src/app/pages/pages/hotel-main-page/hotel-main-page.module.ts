import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { HotelMainPageRoutingModule } from './hotel-main-page-routing.module';

import { StoreModule } from '@ngrx/store';

import * as storeHotelMainPage from '@app/store/hotel-main-page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MomentModule } from 'ngx-moment';
import { CommonSourceModule } from '@app/common-source/common-source.module';


// @ts-ignore
import * as translationKo from '@/assets/i18n/hotel-main-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/hotel-main-page/en.json';

import { HotelNewSearchListComponent } from './components/hotel-new-search-list/hotel-new-search-list.component'
import { HotelMainPageComponent } from './hotel-main-page.component';
import { HotelMainSearchComponent } from './components/hotel-main-search/hotel-main-search.component';

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
        HotelMainPageComponent,
        HotelMainSearchComponent,
        HotelNewSearchListComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        HotelMainPageRoutingModule,

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
        StoreModule.forFeature(storeHotelMainPage.hotelMainPageFeatureKey, storeHotelMainPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ]
})
export class HotelMainPageModule { }
