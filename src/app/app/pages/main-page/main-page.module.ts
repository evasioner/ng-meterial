import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonSourceModule } from '../../common-source/common-source.module';

// @ts-ignore
import * as translationKo from 'src/assets/i18n/rent-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/rent-main-page/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'ngx-moment';
import { StoreModule } from '@ngrx/store';
import * as storeRentMainPage from '../../store/rent-main-page';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RentMainPageRoutingModule } from '../rent-main-page/rent-main-page-routing.module';
import { MainPageRoutingModule } from './main-page-routing.module';
import { JwtService } from '../../common-source/services/jwt/jwt.service';

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
        return new TranslateHttpLoader(http, 'assets/i18n/main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        MainPageComponent
    ],
    providers: [
        JwtService
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MomentModule,

        MainPageRoutingModule,

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
        StoreModule.forFeature(storeRentMainPage.rentMainPageFeatureKey, storeRentMainPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()

    ]
})
export class MainPageModule { }
