import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyMileageListPageRoutingModule } from './my-mileage-list-page-routing.module';
import { MyMileageListPageComponent } from './my-mileage-list-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { MileageListComponent } from './components/mileage-list/mileage-list.component';
import { MyModalMileageNoticeComponent } from './modal-components/my-modal-mileage-notice/my-modal-mileage-notice.component';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-mileage-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-mileage-list/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';

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
    MyMileageListPageComponent,
    MileageListComponent,
    MyModalMileageNoticeComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    MyMileageListPageRoutingModule,
    // ngx-bootstrap
    ModalModule.forRoot(),
  ]
})
export class MyMileageListPageModule { }
