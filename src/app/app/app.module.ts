import { NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { NgtUniversalModule } from '@ng-toolkit/universal';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { metaReducers, ROOT_REDUCERS } from './store/store';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './routing/app-routing.module';
import { LayoutsModule } from './layouts/layouts.module';
import { PagesModule } from './pages/pages.module';
import { ApiModule } from './api/api.module';
import { CommonSourceModule } from './common-source/common-source.module';

import { environment } from '@/environments/environment';

import { TransferHttpCacheModule } from '@nguniversal/common';

// @ts-ignore
import * as translationKo from '../assets/i18n/ko.json';
// @ts-ignore
import * as translationEn from '../assets/i18n/en.json';

import { AppComponent } from './app.component';



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
        return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        AppRoutingModule,
        InfiniteScrollModule,
        TransferHttpCacheModule,
        BrowserAnimationsModule,
        CommonSourceModule,
        NgtUniversalModule,

        /**
         * NgRx store
         */
        StoreModule.forRoot(ROOT_REDUCERS, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
                strictStateSerializability: true,
                strictActionSerializability: true
            }
        }),

        /**
         * NgRx store-devtools
         */
        !environment.production ? StoreDevtoolsModule.instrument() : [],

        /**
         * NgRx Router
         */
        StoreRouterConnectingModule.forRoot({
            routerState: RouterState.Minimal
        }),

        /**
         * NgRx Effect
         */
        EffectsModule.forRoot([]),

        // 다국어
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),


        LayoutsModule,
        PagesModule,
        ApiModule
    ],
    providers: [
        CookieService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
