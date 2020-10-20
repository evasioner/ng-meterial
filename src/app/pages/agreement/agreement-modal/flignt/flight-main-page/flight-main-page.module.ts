import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FlightMainPageComponent } from './flight-main-page.component';
import { FlightMainPageRoutingModule } from "./flight-main-page-routing.module";

import { FlightMainSearchComponent } from './components/flight-main-search/flight-main-search.component';
import { FlightNewSearchListComponent } from './components/flight-new-search-list/flight-new-search-list.component'

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoreModule } from '@ngrx/store';

// store
import * as storeFlightMainPage from "src/app/store/flight-main-page";

// @ts-ignore
import * as translationKo from 'src/assets/i18n/flight-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/flight-main-page/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


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
        return new TranslateHttpLoader(http, "assets/i18n/flight-main-page/", ".json");
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        FlightMainPageComponent,
        FlightMainSearchComponent,
        FlightNewSearchListComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        FormsModule,
        RouterModule,
        FlightMainPageRoutingModule,
        ReactiveFormsModule,
        MomentModule,

        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        // store-page
        StoreModule.forFeature(storeFlightMainPage.flightMainSearchFeatureKey, storeFlightMainPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()

    ]
})
export class FlightMainPageModule { }
