import { NgModule } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyQnaListPageRoutingModule } from './my-qna-list-page-routing.module';
import { MyQnaListPageComponent } from './my-qna-list-page.component';
import { ReservationQnaComponent } from './components/reservation-qna/reservation-qna.component';
import { ProductQnaComponent } from './components/product-qna/product-qna.component';
import { MyModalQnaViewComponent } from './modal-components/my-modal-qna-view/my-modal-qna-view.component';
import { MyModalQnaWriteComponent } from './modal-components/my-modal-qna-write/my-modal-qna-write.component';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-qna-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-qna-list/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AllQnaComponent } from './components/all-qna/all-qna.component';
import { FlightQnaComponent } from './components/flight-qna/flight-qna.component';
import { HotelQnaComponent } from './components/hotel-qna/hotel-qna.component';
import { RentQnaComponent } from './components/rent-qna/rent-qna.component';
import { ActivityQnaComponent } from './components/activity-qna/activity-qna.component';
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
        MyQnaListPageComponent,
        ReservationQnaComponent,
        ProductQnaComponent,
        MyModalQnaViewComponent,
        MyModalQnaWriteComponent,
        AllQnaComponent,
        FlightQnaComponent,
        HotelQnaComponent,
        RentQnaComponent,
        ActivityQnaComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        MyQnaListPageRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        TabsModule.forRoot(),
        // ngx-bootstrap
        ModalModule.forRoot(),
        InfiniteScrollModule
    ]
})
export class MyQnaListPageModule { }
