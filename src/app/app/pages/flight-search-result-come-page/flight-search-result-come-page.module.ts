import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { FlightSearchResultComePageComponent } from './flight-search-result-come-page.component';
import { FlightSearchResultComePageRoutingModule } from './flight-search-result-come-page-routing.module';
import { StoreModule } from '@ngrx/store';
import * as storeFlightSearchResultCome from 'src/app/store/flight-search-result-come-page';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
    declarations: [
        FlightSearchResultComePageComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        RouterModule,
        FlightSearchResultComePageRoutingModule,
        InfiniteScrollModule,

        StoreModule.forFeature(storeFlightSearchResultCome.flightSearchResultComeFeatureKey, storeFlightSearchResultCome.reducers),

        ModalModule.forRoot()
    ]
})
export class FlightSearchResultComePageModule { }
