import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-reservation-flight-cancel/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-reservation-flight-cancel/en.json';
import { MyReservationFlightCancelPageRoutingModule } from './my-reservation-flight-cancel-page-routing.module';
import { MyReservationFlightCancelPageComponent } from './my-reservation-flight-cancel-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';


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
    return new TranslateHttpLoader(http, 'assets/i18n/mypage-qna-list/', '.json');
  } else {
    return new JSONModuleLoader();
  }
}

// ------------------------------------[end 다국어]


@NgModule({
  declarations: [
    MyReservationFlightCancelPageComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    FormsModule,
    MyReservationFlightCancelPageRoutingModule
  ]
})
export class MyReservationFlightCancelPageModule { }
