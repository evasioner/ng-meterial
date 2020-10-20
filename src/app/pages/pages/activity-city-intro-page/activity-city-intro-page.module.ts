import { NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

// store
import * as storeActivityCityIntroPage from '../../store/activity-city-intro-page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CommonSourceModule } from '../../common-source/common-source.module';

import { ActivityCityIntroPageRouting } from './activity-city-intro-page.routing';

// @ts-ignore
import * as translationKo from '@/assets/i18n/activity-city-intro-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/activity-city-intro-page/en.json';

import { ActivityCityIntroPageComponent } from './activity-city-intro-page.component';
import { ActivityModalCityInformationComponent } from './modal-components/activity-modal-city-information/activity-modal-city-information.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-city-intro-page/', '.json');
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

        ActivityCityIntroPageRouting,

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
        StoreModule.forFeature(storeActivityCityIntroPage.activityCityIntroPageFeatureKey, storeActivityCityIntroPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ],
    declarations: [
        ActivityCityIntroPageComponent,
        ActivityModalCityInformationComponent
    ]
})
export class ActivityCityIntroPageModule { }
