
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonSourceModule } from '@app/common-source/common-source.module';

//ngx-bootstrap
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MomentModule } from 'ngx-moment';

import { HotelBookingInformationPageComponent } from './hotel-booking-information-page.component';
import { HotelBookingInformationPageRoutingModule } from './hotel-booking-information-page-routing.module';
import { HotelModalAgreementComponent } from './modal-components/hotel-modal-agreement/hotel-modal-agreement.component';

@NgModule({
    declarations: [
        HotelBookingInformationPageComponent,
        HotelModalAgreementComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        HotelBookingInformationPageRoutingModule,

        /**
        * ngx-bootstrap
        */
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
    ]
})
export class HotelBookingInformationPageModule { }
