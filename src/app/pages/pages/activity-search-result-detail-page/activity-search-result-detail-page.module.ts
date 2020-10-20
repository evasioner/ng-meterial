import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';
import { AccordionModule } from 'ngx-bootstrap/accordion';

// store
import * as storeActivitySearchResultDetailPage from '@/app/store/activity-search-result-detail-page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CommonSourceModule } from '@/app/common-source/common-source.module';

import { ActivitySearchResultDetailPageRouting } from './activity-search-result-detail.routing';

import { ActivityComServiceService } from '../../common-source/services/activity-com-service/activity-com-service.service';

// @ts-ignore
import * as translationKo from '@/assets/i18n/activity-search-result-detail-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/activity-search-result-detail-page/en.json';

import { ActivitySearchResultDetailPageComponent } from './activity-search-result-detail-page.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-search-result-detail-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,


        ActivitySearchResultDetailPageRouting,

        // 다국어
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        StoreModule.forFeature(storeActivitySearchResultDetailPage.activitySearchResultDetailPageFeatureKey, storeActivitySearchResultDetailPage.reducers),
        ModalModule.forRoot(),
        AccordionModule.forRoot()
    ],
    declarations: [
        ActivitySearchResultDetailPageComponent
    ],
    providers: [
        ActivityComServiceService
    ]
})
export class ActivitySearchResultDetailPageModule { }
