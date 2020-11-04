import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { StoreModule } from '@ngrx/store';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';

// store
import * as storeActivityMainPage from '../../store/activity-page';

import { CommonSourceModule } from '../../common-source/common-source.module';
import { ActivityMainPageRoutingModule } from './activity-main-page-routing.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/activity-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/activity-page/en.json';

import { ActivityPageComponent } from './activity-page.component';
import { ActivityMainSearchComponent } from './components/activity-main-search/activity-main-search.component';
import { ActivityHotplaceListComponent } from './components/activity-hotplace-list/activity-hotplace-list.component';
import { ActivityHotactivityListComponent } from './components/activity-hotactivity-list/activity-hotactivity-list.component';
import { ActivityCouponListComponent } from './components/activity-coupon-list/activity-coupon-list.component';
import { ActivityCustomerEventComponent } from './components/activity-customer-event/activity-customer-event.component';
import { ActivityCustomerFreestyleComponent } from './components/activity-customer-freestyle/activity-customer-freestyle.component';
import { ActivityNewSearchListComponent } from './components/activity-new-search-list/activity-new-search-list.component';


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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        ActivityPageComponent,
        ActivityMainSearchComponent,
        ActivityHotplaceListComponent,
        ActivityHotactivityListComponent,
        ActivityCustomerFreestyleComponent,
        ActivityCustomerEventComponent,
        ActivityCouponListComponent,
        ActivityNewSearchListComponent
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

        ActivityMainPageRoutingModule,

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
        StoreModule.forFeature(storeActivityMainPage.activityPageFeatureKey, storeActivityMainPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ]
})
export class ActivityPageModule { }
