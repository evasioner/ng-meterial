import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

import { CommonSourceModule } from '../../common-source/common-source.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// store
import * as storeActivityCityIntroPage from '../../store/activity-city-intro-page';

// 디렉티브
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// @ts-ignore
import * as translationKo from '@/assets/i18n/activity-city-intro-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/activity-city-intro-page/en.json';

import { ActivityCityIntroPageRoutingModule } from './activity-city-intro-page-routing.module';
import { ActivityCityIntroPageComponent } from './activity-city-intro-page.component';
import { ActivityCitySearchComponent } from './components/activity-city-search/activity-city-search.component';
import { ActivityCityListComponent } from './components/activity-city-list/activity-city-list.component';
import { ActivityCityFreestyleComponent } from './components/activity-city-freestyle/activity-city-freestyle.component';
import { ActivityCityTravelPlanComponent } from './components/activity-city-travel-plan/activity-city-travel-plan.component';
import { ActivityCityHotplaceComponent } from './components/activity-city-hotplace/activity-city-hotplace.component';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { ActivityModalCityInformationComponent } from './modal-components/activity-modal-city-information/activity-modal-city-information.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-city-intro-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]
@NgModule({
    declarations: [
        ActivityCityIntroPageComponent,
        ActivityCitySearchComponent,
        ActivityCityListComponent,
        ActivityCityFreestyleComponent,
        ActivityCityTravelPlanComponent,
        ActivityCityHotplaceComponent,
        ActivityModalCityInformationComponent
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

        ActivityCityIntroPageRoutingModule,

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
    ]
})
export class ActivityCityIntroPageModule { }
