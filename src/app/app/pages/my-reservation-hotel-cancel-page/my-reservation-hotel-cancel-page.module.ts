import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-reservation-hotel-cancel/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-reservation-hotel-cancel/en.json';
import { MyReservationHotelCancelPageRoutingModule } from './my-reservation-hotel-cancel-page-routing.module';
import { MyReservationHotelCancelPageComponent } from './my-reservation-hotel-cancel-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule } from '@angular/forms';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

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
    return new TranslateHttpLoader(http, 'assets/i18n/mypage-reservation-list/', '.json');
  } else {
    return new JSONModuleLoader();
  }
}

// ------------------------------------[end 다국어]

@NgModule({
  declarations: [
    MyReservationHotelCancelPageComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    FormsModule,
    MyReservationHotelCancelPageRoutingModule
  ]
})
export class MyReservationHotelCancelPageModule { }
