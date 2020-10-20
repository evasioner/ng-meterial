import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { FlightBookingInformationPageRoutingModule } from './flight-booking-information-page-routing.module';
import { CommonSourceModule } from '@app/common-source/common-source.module';

import { FlightBookingInformationPageComponent } from './flight-booking-information-page.component';
import { FlightModalAgreementComponent } from './modal-components/flight-modal-agreement/flight-modal-agreement.component';

@NgModule({
    declarations: [
        FlightBookingInformationPageComponent,
        FlightModalAgreementComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        FormsModule,
        RouterModule,
        FlightBookingInformationPageRoutingModule,
        ReactiveFormsModule,
        MomentModule,

        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot()
    ]
})
export class FlightBookingInformationPageModule { }
