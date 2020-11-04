import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import * as storeFlightBookingInformationPage from '@app/store/flight-booking-information-page';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MomentModule } from 'ngx-moment';

import { CommonSourceModule } from '@app/common-source/common-source.module';
import { FlightBookingInformationPageRoutingModule } from './flight-booking-information-page-routing.module';

import { FlightBookingInformationPageComponent } from './flight-booking-information-page.component';
import { FlightModalAgreementComponent } from './modal-components/flight-modal-agreement/flight-modal-agreement.component';

@NgModule({
    declarations: [
        FlightBookingInformationPageComponent,
        FlightModalAgreementComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        CommonSourceModule,
        ReactiveFormsModule,
        FlightBookingInformationPageRoutingModule,

        StoreModule.forFeature(storeFlightBookingInformationPage.flightBookingInformationFeatureKey, storeFlightBookingInformationPage.reducers),

        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        MomentModule
    ]
})
export class FlightBookingInformationPageModule { }
