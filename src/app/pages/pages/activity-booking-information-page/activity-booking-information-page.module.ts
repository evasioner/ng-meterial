import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { CommonSourceModule } from '@/app/common-source/common-source.module';

import { ActivityBookingInformationPageRouting } from './activity-booking-information-page.routing';

// @ts-ignore
import * as translationKo from '@/assets/i18n/activity-booking-information-page/ko.json';
// @ts-ignore
import * as translationEn from '@/assets/i18n/activity-booking-information-page/en.json';

import { ActivityBookingInformationPageComponent } from './activity-booking-information-page.component';
import { ActivityModalAgreementComponent } from './modal-component/activity-modal-agreement/activity-modal-agreement.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/activity-booking-information-page/', '.json');
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

        ActivityBookingInformationPageRouting,

        // 다국어
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        TabsModule.forRoot()
    ],
    declarations: [
        ActivityBookingInformationPageComponent,
        ActivityModalAgreementComponent
    ]
})
export class ActivityBookingInformationPageModule { }
