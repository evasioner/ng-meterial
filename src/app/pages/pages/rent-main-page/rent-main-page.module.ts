import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RentMainPageComponent } from './rent-main-page.component';
import { RentMainPageRoutingModule } from './rent-main-page-routing.module';
import { CommonSourceModule } from '../../common-source/common-source.module';
import { RentMainSearchComponent } from './components/rent-main-search/rent-main-search.component';

import { RentModalDemandsComponent } from './components/rent-modal-demands/rent-modal-demands.component';
import { RentModalAmericaComponent } from './components/rent-modal-america/rent-modal-america.component';
import { RentModalCanadaComponent } from './components/rent-modal-canada/rent-modal-canada.component';
import { RentModalEuropeComponent } from './components/rent-modal-europe/rent-modal-europe.component';
import { RentNewSearchListComponent } from './components/rent-new-search-list/rent-new-search-list.component';
// store
import * as storeRentMainPage from 'src/app/store/rent-main-page';
// @ts-ignore
import * as translationKo from 'src/assets/i18n/rent-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/rent-main-page/en.json';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { RouterModule } from '@angular/router';

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
        return new TranslateHttpLoader(http, 'assets/i18n/rent-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        RentMainPageComponent,
        RentMainSearchComponent,
        RentModalDemandsComponent,
        RentModalAmericaComponent,
        RentModalCanadaComponent,
        RentModalEuropeComponent,
        RentNewSearchListComponent
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
