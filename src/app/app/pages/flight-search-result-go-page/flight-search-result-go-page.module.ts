import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { MomentModule } from 'ngx-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FlightSearchResultGoPageRoutingModule } from './flight-search-result-go-page-routing.module';

import * as storeFlightSearchResultGo from 'src/app/store/flight-search-result-go-page';

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
        InfiniteScrollModule,

        StoreModule.forFeature(storeFlightSearchResultGo.flightSearchResultGoFeatureKey, storeFlightSearchResultGo.reducers),

        ModalModule.forRoot()
    ]
})
export class FlightSearchResultGoPageModule { }
