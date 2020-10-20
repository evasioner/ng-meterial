import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyRecentListPageRoutingModule } from './my-recent-list-page-routing.module';
import { MyRecentListPageComponent } from './my-recent-list-page.component';
import { AllRecentListComponent } from './components/all-recent-list/all-recent-list.component';
import { FlightRecentListComponent } from './components/flight-recent-list/flight-recent-list.component';
import { HotelRecentListComponent } from './components/hotel-recent-list/hotel-recent-list.component';
import { ActivityRecentListComponent } from './components/activity-recent-list/activity-recent-list.component';
import { RentRecentListComponent } from './components/rent-recent-list/rent-recent-list.component';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-recent-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-recent-list/en.json';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { TabsModule } from 'ngx-bootstrap/tabs';
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
    return new TranslateHttpLoader(http, 'assets/i18n/mypage-recent-list/', '.json');
  } else {
    return new JSONModuleLoader();
  }
}

// ------------------------------------[end 다국어]

@NgModule({
  declarations: [
    MyRecentListPageComponent,
    AllRecentListComponent,
    FlightRecentListComponent,
    HotelRecentListComponent,
    ActivityRecentListComponent,
    RentRecentListComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MyRecentListPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    TabsModule.forRoot()
  ]
})
export class MyRecentListPageModule { }
