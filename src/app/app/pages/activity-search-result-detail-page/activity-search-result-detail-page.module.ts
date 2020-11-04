import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

// store
import * as storeActivitySearchResultDetailPage from '../../store/activity-search-result-detail-page';

// 디렉티브
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CommonSourceModule } from '../../common-source/common-source.module';
import { ActivitySearchResultDetailPageRoutingModule } from './activity-search-result-detail-page-routing.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/activity-search-result-detail-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/activity-search-result-detail-page/en.json';

import { ActivitySearchResultDetailPageComponent } from './activity-search-result-detail-page.component';
import { ActivityModalReviewComponent } from './modal-components/activity-modal-review/activity-modal-review.component';
import { ActivityModalProductQnaComponent } from './modal-components/activity-modal-product-qna/activity-modal-product-qna.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-search-result-detail-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]
@NgModule({
    declarations: [
        ActivitySearchResultDetailPageComponent,
        ActivityModalReviewComponent,
        ActivityModalProductQnaComponent
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

        ActivitySearchResultDetailPageRoutingModule,

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
        StoreModule.forFeature(storeActivitySearchResultDetailPage.activitySearchResultDetailPageFeatureKey, storeActivitySearchResultDetailPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ]
})
export class ActivitySearchResultDetailPageModule { }
