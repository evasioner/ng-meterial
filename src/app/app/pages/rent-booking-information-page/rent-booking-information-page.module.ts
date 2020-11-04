import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RentBookingInformationPageComponent } from './rent-booking-information-page.component';
import { CommonSourceModule } from '../../common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
// @ts-ignore
import * as translationKo from '../../../assets/i18n/rent-booking-information-page/ko.json';
// @ts-ignore
import * as translationEn from '../../../assets/i18n/rent-booking-information-page/en.json';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import * as storeRentBookingInformationPage from '../../store/rent-booking-information-page';
import { rentBookingInformationPageRoutingModule } from './rent-booking-information-page-routing.module';
import { RentModalAgreementComponent } from './modal-components/rent-modal-agreement/rent-modal-agreement.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RentModalFlightInfoComponent } from './modal-components/rent-modal-flight-info/rent-modal-flight-info.component';
import { RentModalBranchofficeComponent } from './modal-components/rent-modal-branchoffice/rent-modal-branchoffice.component';
import { RentModalBranchofficeDetailComponent } from './modal-components/rent-modal-branchoffice-detail/rent-modal-branchoffice-detail.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '@/environments/environment';

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
        return new TranslateHttpLoader(http, 'assets/i18n/rent-booking-information-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}

// ------------------------------------[end 다국어]

@NgModule({
    declarations: [
        RentBookingInformationPageComponent,
        RentModalAgreementComponent,
        RentModalFlightInfoComponent,
        RentModalBranchofficeComponent,
        RentModalBranchofficeDetailComponent
    ],
    imports: [
        CommonModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,

        rentBookingInformationPageRoutingModule,

        // 다국어
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),

        StoreModule.forFeature(storeRentBookingInformationPage.rentBookingInformationPageFeatureKey, storeRentBookingInformationPage.reducers),

        /**
         * ngx-bootstrap
         */
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY
        })
    ]
})
export class RentBookingInformationPageModule { }
