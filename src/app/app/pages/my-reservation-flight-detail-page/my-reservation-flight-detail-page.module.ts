import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyReservationFlightDetailPageRoutingModule } from './my-reservation-flight-detail-page-routing.module';
import { MyReservationFlightDetailPageComponent } from './my-reservation-flight-detail-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-reservation-flight-detail/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-reservation-flight-detail/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'ngx-moment';
import { MyModalFlightEticketComponent } from './modal-components/my-modal-flight-eticket/my-modal-flight-eticket.component';
import { MyModalFlightMileageAccumComponent } from './modal-components/my-modal-flight-mileage-accum/my-modal-flight-mileage-accum.component';
import { MyModalFlightFareRuleComponent } from './modal-components/my-modal-flight-fare-rule/my-modal-flight-fare-rule.component';
import { MyModalFlightWifiComponent } from './modal-components/my-modal-flight-wifi/my-modal-flight-wifi.component';
import { MyModalFlightTravelInsuComponent } from './modal-components/my-modal-flight-travel-insu/my-modal-flight-travel-insu.component';
import { MyModalFlightSeatmapComponent } from './modal-components/my-modal-flight-seatmap/my-modal-flight-seatmap.component';
import { MyModalFlightBookerEditComponent } from './modal-components/my-modal-flight-booker-edit/my-modal-flight-booker-edit.component';
import { MyModalFlightDocumentComponent } from './modal-components/my-modal-flight-document/my-modal-flight-document.component';
import { MyModalFlightPassportComponent } from './modal-components/my-modal-flight-passport/my-modal-flight-passport.component';
import { MyModalFlightPassingerComponent } from './modal-components/my-modal-flight-passinger/my-modal-flight-passinger.component';

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
    MyReservationFlightDetailPageComponent,
    MyModalFlightEticketComponent,
    MyModalFlightMileageAccumComponent,
    MyModalFlightFareRuleComponent,
    MyModalFlightWifiComponent,
    MyModalFlightTravelInsuComponent,
    MyModalFlightSeatmapComponent,
    MyModalFlightBookerEditComponent,
    MyModalFlightDocumentComponent,
    MyModalFlightPassportComponent,
    MyModalFlightPassingerComponent,
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MomentModule,
    MyReservationFlightDetailPageRoutingModule
  ]
})
export class MyReservationFlightDetailPageModule { }
