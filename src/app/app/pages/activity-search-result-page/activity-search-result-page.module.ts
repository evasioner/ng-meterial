import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

// store
import * as storeActivitySearchResultPage from '../../store/activity-search-result-page';

// ngx-bootstrap
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeModule } from '@circlon/angular-tree-component';

import { CommonSourceModule } from '../../common-source/common-source.module';
import { ActivitySearchResultPageRoutingModule } from './activity-search-result-page-routing.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

import { ActivitySearchResultPageComponent } from './activity-search-result-page.component';
import { ActivityModalOptionComponent } from './modal-components/activity-modal-option/activity-modal-option.component';
import { ActivityModalAlignFilterComponent } from './modal-components/activity-modal-align-filter/activity-modal-align-filter.component';
import { ActivityModalDetailFilterComponent } from './modal-components/activity-modal-detail-filter/activity-modal-detail-filter.component';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/activity-search-result-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/activity-search-result-page/en.json';

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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-search-result-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]
@NgModule({
    declarations: [
        ActivitySearchResultPageComponent,
        ActivityModalOptionComponent,
        ActivityModalAlignFilterComponent,
        ActivityModalDetailFilterComponent
    ],
    providers: [
        JwtService
    ],
    imports: [
        //RouterModule,
        CommonModule,
        InfiniteScrollModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,

        ActivitySearchResultPageRoutingModule,

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
        StoreModule.forFeature(storeActivitySearchResultPage.activitySearchResultPageFeatureKey, storeActivitySearchResultPage.reducers),

        /**
         * ngx-bootstrap
         */
        AccordionModule.forRoot(),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot(),

        TabsModule.forRoot(),
        TreeModule
    ]
})
export class ActivitySearchResultPageModule { }
