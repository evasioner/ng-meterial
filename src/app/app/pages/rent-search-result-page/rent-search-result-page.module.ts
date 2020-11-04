import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

import * as storeRentSearchResultPage from '../../store/rent-search-result-page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'ngx-moment';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { RentSearchResultPageRoutingModule } from './rent-search-result-page-routing.module';
import { CommonSourceModule } from '../../common-source/common-source.module';

// @ts-ignore
import * as translationKo from '@/assets/i18n/rent-search-result-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/rent-search-result-page/en.json';

import { RentSearchResultPageComponent } from './rent-search-result-page.component';
import { RentImgViewComponent } from './components/rent-img-view/rent-img-view.component';
import { RentModalResearchComponent } from './modal-components/rent-modal-research/rent-modal-research.component';
import { RentModalAlignFilterComponent } from './modal-components/rent-modal-align-filter/rent-modal-align-filter.component';
import { RentModalDetailFilterComponent } from './modal-components/rent-modal-detail-filter/rent-modal-detail-filter.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/rent-search-result-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]


@NgModule({
    declarations: [
        RentSearchResultPageComponent,
        RentImgViewComponent,
        RentModalResearchComponent,
        RentModalAlignFilterComponent,
        RentModalDetailFilterComponent,

    ],
    imports: [
        CommonModule,
        InfiniteScrollModule,
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

        StoreModule.forFeature(storeRentSearchResultPage.rentSearchResultPageFeatureKey, storeRentSearchResultPage.reducers),

        /**
         * ngx-bootstrap
         */
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot()

    ]
})
export class RentSearchResultPageModule {
}
