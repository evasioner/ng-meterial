import { NgModule, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonSourceModule } from '../../common-source/common-source.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// store
import * as storeActivitySearchResultOptionPage from '../../store/activity-search-result-option-page';

// 디렉티브
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/activity-search-result-option-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/activity-search-result-option-page/en.json';
import { Observable, of } from 'rxjs';

import { ActivitySearchResultOptionPageRoutingModule } from './activity-search-result-option-page-routing.module';
import { ActivitySearchResultOptionPageComponent } from './activity-search-result-option-page.component';
import { ActivityCalendarComponent } from './components/activity-calendar/activity-calendar.component';


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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-search-result-option-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

@NgModule({
    declarations: [ActivitySearchResultOptionPageComponent, ActivityCalendarComponent],
    providers: [
        JwtService
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,

        ActivitySearchResultOptionPageRoutingModule,

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
        StoreModule.forFeature(storeActivitySearchResultOptionPage.activitySearchResultOptionPageFeatureKey, storeActivitySearchResultOptionPage.reducers),
    ]
})
export class ActivitySearchResultOptionPageModule { }
