import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FlightSearchResultComePageRoutingModule } from './flight-search-result-come-page-routing.module';

import { FlightSearchResultComePageComponent } from './flight-search-result-come-page.component';

@NgModule({
    declarations: [
        FlightSearchResultComePageComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        RouterModule,
        FlightSearchResultComePageRoutingModule,
        MomentModule,
        FormsModule,
        ReactiveFormsModule,

        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot()
    ]
})
export class FlightSearchResultComePageModule { }
