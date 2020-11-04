import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyReservationActivityDetailPageRoutingModule } from './my-reservation-activity-detail-page-routing.module';
import { MyReservationActivityDetailPageComponent } from './my-reservation-activity-detail-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-reservation-activity-detail/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-reservation-activity-detail/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyModalActivityTravelInsuComponent } from './modal-components/my-modal-activity-travel-insu/my-modal-activity-travel-insu.component';
import { MyModalActivityVoucherComponent } from './modal-components/my-modal-activity-voucher/my-modal-activity-voucher.component';
import { MyModalActivityWifiComponent } from './modal-components/my-modal-activity-wifi/my-modal-activity-wifi.component';
import { MyModalActivityBookerModifyComponent } from './modal-components/my-modal-activity-booker-modify/my-modal-activity-booker-modify.component';


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
    MyReservationActivityDetailPageComponent,
    MyModalActivityTravelInsuComponent,
    MyModalActivityVoucherComponent,
    MyModalActivityWifiComponent,
    MyModalActivityBookerModifyComponent,
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MyReservationActivityDetailPageRoutingModule
  ]
})
export class MyReservationActivityDetailPageModule { }
