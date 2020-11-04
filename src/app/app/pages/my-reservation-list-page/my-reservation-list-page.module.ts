import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyReservationListRoutingModule } from './my-reservation-list-page-routing.module';
import { MyReservationListPageComponent } from './my-reservation-list-page.component';
import { AllReservationListComponent } from './components/all-reservation-list/all-reservation-list.component';
import { FlightReservationListComponent } from './components/flight-reservation-list/flight-reservation-list.component';
import { HotelReservationListComponent } from './components/hotel-reservation-list/hotel-reservation-list.component';
import { ActivityReservationListComponent } from './components/activity-reservation-list/activity-reservation-list.component';
import { RentReservationListComponent } from './components/rent-reservation-list/rent-reservation-list.component';
import { AirtelReservationListComponent } from './components/airtel-reservation-list/airtel-reservation-list.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-reservation-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-reservation-list/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DateSearchComponent } from './components/date-search/date-search.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoreModule } from '@ngrx/store';
import * as storeMyReservationPage from "src/app/store/my-reservation";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
    MyReservationListPageComponent,
    AllReservationListComponent,
    FlightReservationListComponent,
    HotelReservationListComponent,
    ActivityReservationListComponent,
    RentReservationListComponent,
    AirtelReservationListComponent,
    DateSearchComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MomentModule,
    MyReservationListRoutingModule,
    TabsModule.forRoot(),
            // 다국어
            TranslateModule.forChild({
              loader: {
                  provide: TranslateLoader,
                  useFactory: JSONModuleLoaderFactory,
                  deps: [HttpClient, PLATFORM_ID]
              },
              isolate: true
          }),
  
          // store-page
          StoreModule.forFeature(storeMyReservationPage.myReservationFeatureKey, storeMyReservationPage.reducers),

          // ngx-bootstrap
          ModalModule.forRoot()
  ]
})
export class MyReservationListPageModule { }
