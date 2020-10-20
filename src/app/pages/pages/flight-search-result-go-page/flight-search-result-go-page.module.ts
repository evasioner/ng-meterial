import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'ngx-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FlightSearchResultGoPageRoutingModule } from './flight-search-result-go-page-routing.module';

import { FlightSearchResultGoPageComponent } from './flight-search-result-go-page.component';

@NgModule({
    declarations: [
        FlightSearchResultGoPageComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        RouterModule,
        FlightSearchResultGoPageRoutingModule,
        MomentModule,
        FormsModule,
        ReactiveFormsModule,

        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot()
    ]
})
export class FlightSearchResultGoPageModule { }
