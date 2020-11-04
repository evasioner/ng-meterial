import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RentSearchResultDetailPageComponent } from './rent-search-result-detail-page.component';
import { RentSearchResultDetailPageRoutingModule } from './rent-search-result-detail-page-routing.module';
import { CommonSourceModule } from '../../common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/rent-search-result-detail-page/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/rent-search-result-detail-page/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import * as storeRentSearchResultDetailPage from '../../store/rent-search-result-detail-page';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';

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
        return new TranslateHttpLoader(http, 'assets/i18n/rent-search-result-detail-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        RentSearchResultDetailPageComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        RentSearchResultDetailPageRoutingModule,

        // 다국어
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        StoreModule.forFeature(storeRentSearchResultDetailPage.rentSearchResultDetailPageFeatureKey, storeRentSearchResultDetailPage.reducers),
        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()

    ]
})
export class RentSearchResultDetailPageModule { }
