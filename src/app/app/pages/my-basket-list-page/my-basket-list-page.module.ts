
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MyBasketListPageRoutingModule } from './my-basket-list-page-routing.module';
import { MyBasketListPageComponent } from './my-basket-list-page.component';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/mypage-basket-list/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/mypage-basket-list/en.json';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AllBasketListComponent } from './components/all-basket-list/all-basket-list.component';
import { FlightBasketListComponent } from './components/flight-basket-list/flight-basket-list.component';
import { HotelBasketListComponent } from './components/hotel-basket-list/hotel-basket-list.component';
import { ActivityBasketListComponent } from './components/activity-basket-list/activity-basket-list.component';
import { RentBasketListComponent } from './components/rent-basket-list/rent-basket-list.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgModule } from '@angular/core';

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
        return new TranslateHttpLoader(http, 'assets/i18n/mypage-basket-list/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [MyBasketListPageComponent,
        AllBasketListComponent,
        FlightBasketListComponent,
        HotelBasketListComponent,
        ActivityBasketListComponent,
        RentBasketListComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        MyBasketListPageRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        TabsModule.forRoot()
    ]
})
export class MyBasketListPageModule { }
