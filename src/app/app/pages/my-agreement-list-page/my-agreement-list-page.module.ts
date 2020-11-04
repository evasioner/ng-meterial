import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-review-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-review-list/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { MyAgreementListPageComponent } from './my-agreement-list-page.component';
import { MyAgreementListPageRoutingModule } from './my-agreement-list-page-routing.module';

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
        return new TranslateHttpLoader(http, 'assets/i18n/mypage-review-list/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
@NgModule({
    imports: [
        CommonModule,
        CommonSourceModule,
        MyAgreementListPageRoutingModule
    ],
    declarations: [MyAgreementListPageComponent]
})
export class MyAgreementListPageModule { }
