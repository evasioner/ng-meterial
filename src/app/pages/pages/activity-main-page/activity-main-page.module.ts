import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

// store
import * as storeActivityMainPage from '../../store/activity-page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ActivityMainPageRoutingModule } from './activity-main-page-routing.module';

import { CommonSourceModule } from '@app/common-source/common-source.module';

// @ts-ignore
import * as translationKo from '@/assets/i18n/activity-main-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/activity-main-page/en.json';

import { ActivityNewSearchListComponent } from './components/activity-new-search-list/activity-new-search-list.component'
import { ActivityMainPageComponent } from './activity-main-page.component';
import { ActivityMainSearchComponent } from './components/activity-main-search/activity-main-search.component';

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
        ActivityMainPageComponent,
        ActivityMainSearchComponent,
        ActivityNewSearchListComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        ActivityMainPageRoutingModule,
        FormsModule,
        ReactiveFormsModule,

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
        StoreModule.forFeature(storeActivityMainPage.activityPageFeatureKey, storeActivityMainPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()

    ]
})
export class ActivityMainPageModule { }
