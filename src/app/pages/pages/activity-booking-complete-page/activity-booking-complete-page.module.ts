import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommonSourceModule } from '@/app/common-source/common-source.module';

import { ActivityBookingCompletePageRouting } from './activity-booking-complete-page.routing';

// @ts-ignore
import * as translationKo from '@/assets/i18n/activity-booking-complete-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/activity-booking-complete-page/en.json';

import { ActivityBookingCompletePageComponent } from './activity-booking-complete-page.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-booking-complete-page/', '.json');
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

        ActivityBookingCompletePageRouting
    ],
    declarations: [ActivityBookingCompletePageComponent]
})
export class ActivityBookingCompletePageModule { }
