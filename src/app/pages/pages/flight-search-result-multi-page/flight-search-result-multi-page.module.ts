import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FlightSearchResultMultiPageRoutingModule } from './flight-search-result-multi-page-routing.module';

import { FlightSearchResultMultiPageComponent } from './flight-search-result-multi-page.component';

@NgModule({
    declarations: [
        FlightSearchResultMultiPageComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        RouterModule,
        FlightSearchResultMultiPageRoutingModule,
        MomentModule,
        FormsModule,
        ReactiveFormsModule,

        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot()
    ]
})
export class FlightSearchResultMultiPageModule { }
