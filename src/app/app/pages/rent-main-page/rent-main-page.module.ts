import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';


import { StoreModule } from '@ngrx/store';

// store
import * as storeRentMainPage from '@app/store/rent-main-page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'ngx-moment';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CommonSourceModule } from '../../common-source/common-source.module';
import { RentMainPageRoutingModule } from './rent-main-page-routing.module';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/rent-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/rent-main-page/en.json';

import { RentMainPageComponent } from './rent-main-page.component';
import { RentCouponDownComponent } from './components/rent-coupon-down/rent-coupon-down.component';
import { RentCustomerEventComponent } from './components/rent-customer-event/rent-customer-event.component';
import { RentGuideBtnComponent } from './components/rent-guide-btn/rent-guide-btn.component';
import { RentHotListComponent } from './components/rent-hot-list/rent-hot-list.component';
import { RentMainSearchComponent } from './components/rent-main-search/rent-main-search.component';
import { RentNewSearchListComponent } from './components/rent-new-search-list/rent-new-search-list.component';
import { RentModalDemandsComponent } from './modal-components/rent-modal-demands/rent-modal-demands.component';
import { RentModalAmericaComponent } from './modal-components/rent-modal-america/rent-modal-america.component';
import { RentModalCanadaComponent } from './modal-components/rent-modal-canada/rent-modal-canada.component';
import { RentModalEuropeComponent } from './modal-components/rent-modal-europe/rent-modal-europe.component';

/**
 * 필수 디렉티브
 * PreventDefaultLinkDirective : a 태그 이동 방지
 */

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
        return new TranslateHttpLoader(http, 'assets/i18n/rent-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

@NgModule({
    declarations: [
        RentMainPageComponent,
        RentCouponDownComponent,
        RentCustomerEventComponent,
        RentGuideBtnComponent,
        RentHotListComponent,
        RentMainSearchComponent,
        RentNewSearchListComponent,
        RentModalDemandsComponent,
        RentModalAmericaComponent,
        RentModalCanadaComponent,
        RentModalEuropeComponent,
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
        MomentModule,

        RentMainPageRoutingModule,

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
        StoreModule.forFeature(storeRentMainPage.rentMainPageFeatureKey, storeRentMainPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()


    ]
})
export class RentMainPageModule {
}
