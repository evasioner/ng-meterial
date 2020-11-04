import { NgModule, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonSourceModule } from '../../common-source/common-source.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// store
import * as storeActivityBookingCompletePage from '../../store/activity-booking-complete-page';

// 디렉티브
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// @ts-ignore
import * as translationKo from 'src/assets/i18n/activity-booking-complete-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/activity-booking-complete-page/en.json';
import { Observable, of } from 'rxjs';

import { ActivityBookingCompletePageRoutingModule } from './activity-booking-complete-page-routing.module';
import { ActivityBookingCompletePageComponent } from './activity-booking-complete-page.component';


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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-booking-complete-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
@NgModule({
    declarations: [ActivityBookingCompletePageComponent],
    providers: [
        JwtService
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,

        ActivityBookingCompletePageRoutingModule,

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
        StoreModule.forFeature(storeActivityBookingCompletePage.activitBookingCompletePageKey, storeActivityBookingCompletePage.reducers)
    ]
})
export class ActivityBookingCompletePageModule { }
