import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyReservationHotelDetailPageRoutingModule } from './my-reservation-hotel-detail-page-routing.module';
import { MyReservationHotelDetailPageComponent } from './my-reservation-hotel-detail-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-reservation-hotel-detail/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-reservation-hotel-detail/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyModalHotelTravelInsuComponent } from './modal-components/my-modal-hotel-travel-insu/my-modal-hotel-travel-insu.component';
import { MyModalHotelVoucherComponent } from './modal-components/my-modal-hotel-voucher/my-modal-hotel-voucher.component';
import { MyModalHotelInvoiceComponent } from './modal-components/my-modal-hotel-invoice/my-modal-hotel-invoice.component';
import { MyModalHotelReceiptComponent } from './modal-components/my-modal-hotel-receipt/my-modal-hotel-receipt.component';
import { MyModalHotelBookerModifyComponent } from './modal-components/my-modal-hotel-booker-modify/my-modal-hotel-booker-modify.component';

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
    MyReservationHotelDetailPageComponent,
    MyModalHotelTravelInsuComponent,
    MyModalHotelVoucherComponent,
    MyModalHotelInvoiceComponent,
    MyModalHotelReceiptComponent,
    MyModalHotelBookerModifyComponent,
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MyReservationHotelDetailPageRoutingModule
  ]
})
export class MyReservationHotelDetailPageModule { }
