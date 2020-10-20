import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

// store
import * as storeActivitySearchResultPage from '../../store/activity-search-result-page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TreeModule } from '@circlon/angular-tree-component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { CommonSourceModule } from '@app/common-source/common-source.module';

import { ActivitySearchResultPageRouting } from './activity-search-result-page.routing';

import { ActivityComServiceService } from '../../common-source/services/activity-com-service/activity-com-service.service';

// @ts-ignore
import * as translationKo from '@/assets/i18n/activity-search-result-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/activity-search-result-page/en.json';

import { ActivitySearchResultPageComponent } from './activity-search-result-page.component';
import { ActivityCompareComponent } from './components/activity-compare/activity-compare.component';
import { ActivityTabBodyComponent } from './components/activity-tab-body/activity-tab-body.component';
import { ActivityTabHeaderComponent } from './components/activity-tab-header/activity-tab-header.component';
import { ActivityModalCompareComponent } from './modal-components/activity-modal-compare/activity-modal-compare.component';


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

        ActivitySearchResultPageRouting,

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
        StoreModule.forFeature(
            storeActivitySearchResultPage.activitySearchResultPageFeatureKey, storeActivitySearchResultPage.reducers
        ),

        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        PaginationModule.forRoot(),
        TreeModule
    ],
    declarations: [
        ActivityCompareComponent,
        ActivitySearchResultPageComponent,
        ActivityTabBodyComponent,
        ActivityTabHeaderComponent,
        ActivityModalCompareComponent
    ],
    providers: [
        ActivityComServiceService
    ]
})
export class ActivitySearchResultPageModule { }
