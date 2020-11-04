import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyNoticeListPageRoutingModule } from './my-notice-list-page-routing.module';
import { MyNoticeListPageComponent } from './my-notice-list-page.component';
import { NoticeListComponent } from './components/notice-list/notice-list.component';
import { MyModalNoticeViewComponent } from './modal-components/my-modal-notice-view/my-modal-notice-view.component';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-notice-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-notice-list/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NoticeListFlightComponent } from './components/notice-list-flight/notice-list-flight.component';
import { NoticeListHotelComponent } from './components/notice-list-hotel/notice-list-hotel.component';
import { NoticeListActivityComponent } from './components/notice-list-activity/notice-list-activity.component';
import { NoticeListRentComponent } from './components/notice-list-rent/notice-list-rent.component';
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
    return new TranslateHttpLoader(http, 'assets/i18n/mypage-qna-list/', '.json');
  } else {
    return new JSONModuleLoader();
  }
}

// ------------------------------------[end 다국어]

@NgModule({
  declarations: [
    MyNoticeListPageComponent,
    NoticeListComponent,
    MyModalNoticeViewComponent,
    NoticeListFlightComponent,
    NoticeListHotelComponent,
    NoticeListActivityComponent,
    NoticeListRentComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    MyNoticeListPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    InfiniteScrollModule,
    TabsModule.forRoot(),
    // ngx-bootstrap
    ModalModule.forRoot()
  ]
})
export class MyNoticeListPageModule { }
