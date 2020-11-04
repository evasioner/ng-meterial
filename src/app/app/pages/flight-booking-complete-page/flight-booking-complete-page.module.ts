import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommonSourceModule } from '@/app/common-source/common-source.module';
import { FlightBookingCompletePageRoutingModule } from './flight-booking-complete-page-routing.module';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/flight-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/flight-main-page/en.json';

import { FlightBookingCompletePageComponent } from './flight-booking-complete-page.component';


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
        return new TranslateHttpLoader(http, 'assets/i18n/flight-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        FlightBookingCompletePageComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        FlightBookingCompletePageRoutingModule,

        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),
    ]
})
export class FlightBookingCompletePageModule { }
