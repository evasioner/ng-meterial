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
import { MomentModule } from 'ngx-moment';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';

// store
import * as storeRentSearchResultPage from '@app/store/rent-search-result-page';

import { CommonSourceModule } from '../../common-source/common-source.module';
import { RentSearchResultPageRoutingModule } from './rent-search-result-page-routing.module';


import { PaginationModule } from 'ngx-bootstrap/pagination';

// @ts-ignore
import * as translationKo from '@/assets/i18n/rent-main-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/rent-main-page/en.json';

import { RentSearchResultPageComponent } from './rent-search-result-page.component';
import { RentModalCompareComponent } from './modal-components/rent-modal-compare/rent-modal-compare.component';
import { RentBreadcrumbsComponent } from './components/rent-breadcrumbs/rent-breadcrumbs.component';
import { RentTabBodyComponent } from './components/rent-tab-body/rent-tab-body.component';
import { RentTabHeaderComponent } from './components/rent-tab-header/rent-tab-header.component';
import { RentCompareComponent } from './components/rent-compare/rent-compare.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/rent-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        RentBreadcrumbsComponent,
        RentCompareComponent,
        RentTabBodyComponent,
        RentTabHeaderComponent,
        RentSearchResultPageComponent,
        RentModalCompareComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        RentSearchResultPageRoutingModule,

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
        StoreModule.forFeature(storeRentSearchResultPage.rentSearchResultPageFeatureKey, storeRentSearchResultPage.reducers),

        /**
         * ngx-bootstrap
         */
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        PaginationModule.forRoot()
    ]
})
export class RentSearchResultPageModule { }
