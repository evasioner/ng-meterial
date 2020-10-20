
import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

// store
import * as storeHotelSearchResultPage from 'src/app/store/hotel-search-result-page';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HotelSearchResultPageRoutingModule } from './hotel-search-result-page-routing.module';
import { HotelSearchResultPageComponent } from './hotel-search-result-page.component';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/hotel-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/hotel-main-page/en.json';


import { MomentModule } from 'ngx-moment';

import { HotelBreadcrumbsComponent } from './components/hotel-breadcrumbs/hotel-breadcrumbs.component';
import { HotelCompareComponent } from './components/hotel-compare/hotel-compare.component';
import { HotelPageViewingMsgComponent } from './components/hotel-page-viewing-msg/hotel-page-viewing-msg.component';
import { HotelTabHeaderComponent } from './components/hotel-tab-header/hotel-tab-header.component';
import { HotelTabBodyComponent } from './components/hotel-tab-body/hotel-tab-body.component';
import { HotelModalCompareComponent } from './modal-components/hotel-modal-compare/hotel-modal-compare.component';


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
        HotelSearchResultPageComponent,
        HotelBreadcrumbsComponent,
        HotelCompareComponent,
        HotelPageViewingMsgComponent,
        HotelTabHeaderComponent,
        HotelTabBodyComponent,
        HotelModalCompareComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        HotelSearchResultPageRoutingModule,

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
        StoreModule.forFeature(storeHotelSearchResultPage.hotelSearchResultPageFeatureKey, storeHotelSearchResultPage.reducers),

        /**
         * ngx-bootstrap
         */
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        PaginationModule.forRoot()
    ],
    exports: []
})
export class HotelSearchResultPageModule { }
