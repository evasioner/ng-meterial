import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyFaqListPageRoutingModule } from './my-faq-list-page-routing.module';
import { MyFaqListPageComponent } from './my-faq-list-page.component';
import { AllFaqComponent } from './components/all-faq/all-faq.component';
import { FaqListComponent } from './components/faq-list/faq-list.component';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-faq-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-faq-list/en.json';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader } from '@ngx-translate/core';
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
    return new TranslateHttpLoader(http, 'assets/i18n/mypage-mileage-list/', '.json');
  } else {
    return new JSONModuleLoader();
  }
}

// ------------------------------------[end 다국어]

@NgModule({
  declarations: [
    MyFaqListPageComponent,
    AllFaqComponent,
    FaqListComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    FormsModule,
    ReactiveFormsModule,
    MyFaqListPageRoutingModule
  ]
})
export class MyFaqListPageModule { }
