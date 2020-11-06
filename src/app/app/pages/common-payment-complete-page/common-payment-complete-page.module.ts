import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/common-payment-complete-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/common-payment-complete-page/en.json';

import { CommonPaymentCompletePageComponent } from './common-payment-complete-page.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/common-payment-complete-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]
@NgModule({
    imports: [
        CommonModule,

        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),
    ],
    declarations: [CommonPaymentCompletePageComponent]
})
export class CommonPaymentCompletePageModule { }
