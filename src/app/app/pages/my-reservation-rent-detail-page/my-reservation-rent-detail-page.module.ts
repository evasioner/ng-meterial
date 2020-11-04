import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyReservationRentDetailPageRoutingModule } from './my-reservation-rent-detail-page-routing.module';
import { MyReservationRentDetailPageComponent } from './my-reservation-rent-detail-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-reservation-rent-detail/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-reservation-rent-detail/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyModalRentTravelInsuComponent } from './modal-components/my-modal-rent-travel-insu/my-modal-rent-travel-insu.component';
import { MyModalRentConfirmationComponent } from './modal-components/my-modal-rent-confirmation/my-modal-rent-confirmation.component';
import { MyModalRentWifiComponent } from './modal-components/my-modal-rent-wifi/my-modal-rent-wifi.component';
import { MyModalRentInvoiceComponent } from './modal-components/my-modal-rent-invoice/my-modal-rent-invoice.component';

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
    MyReservationRentDetailPageComponent,
    MyModalRentTravelInsuComponent,
    MyModalRentConfirmationComponent,
    MyModalRentWifiComponent,
    MyModalRentInvoiceComponent,
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MyReservationRentDetailPageRoutingModule
  ]
})
export class MyReservationRentDetailPageModule { }
