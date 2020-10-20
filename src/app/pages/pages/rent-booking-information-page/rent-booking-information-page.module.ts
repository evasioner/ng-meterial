import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RentBookingInformationPageComponent } from './rent-booking-information-page.component';

// store
import * as storeRentBookingInformationPage from 'src/app/store/rent-booking-information-page';
// @ts-ignore
import * as translationKo from 'src/assets/i18n/rent-main-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/rent-main-page/en.json';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { RouterModule } from '@angular/router';
import { CommonSourceModule } from '../../common-source/common-source.module';
import { RentBookingInformationPageRoutingModule } from './rent-booking-information-page-routing.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AgmCoreModule } from '@agm/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { environment } from '@/environments/environment';
import { RentModalBranchofficeComponent } from './modal-components/rent-modal-branchoffice/rent-modal-branchoffice.component';
import { RentModalAgreementComponent } from './modal-components/rent-modal-agreement/rent-modal-agreement.component';

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
        return new TranslateHttpLoader(http, 'assets/i18n/rent-main-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [RentBookingInformationPageComponent, RentModalBranchofficeComponent, RentModalAgreementComponent],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        RentBookingInformationPageRoutingModule,

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
        StoreModule.forFeature(storeRentBookingInformationPage.rentBookingInformationPageFeatureKey, storeRentBookingInformationPage.reducers),

        /**
         * ngx-bootstrap
         */
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY,
            language: 'ko',
            region: 'KR'
        })
    ]
})
export class RentBookingInformationPageModule { }
