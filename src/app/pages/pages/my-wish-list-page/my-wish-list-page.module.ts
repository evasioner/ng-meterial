import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { StoreModule } from "@ngrx/store";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ModalModule } from "ngx-bootstrap/modal";
import { MomentModule } from 'ngx-moment';
import { Observable, of } from 'rxjs';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { MyWishListPageRoutingModule } from './my-wish-list-page-routing.module';
import { MyWishListPageComponent } from './my-wish-list-page.component';
// @ts-ignore
import * as translationKo from 'src/assets/i18n/mypage-wish-list/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/mypage-wish-list/en.json';

//store
import * as storeMyWishListPage from "src/app/store/my-wish-list-page";

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
        return new TranslateHttpLoader(http, 'assets/i18n/mypage-wish-list/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [MyWishListPageComponent],
    imports: [
        CommonModule,

        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        MyWishListPageRoutingModule,

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
        StoreModule.forFeature(storeMyWishListPage.myWishListPageFeatureKey, storeMyWishListPage.reducers),

        /**
         * ngx-bootstrap
         */
        ModalModule.forRoot()
    ]
})
export class MyWishListPageModule { }
