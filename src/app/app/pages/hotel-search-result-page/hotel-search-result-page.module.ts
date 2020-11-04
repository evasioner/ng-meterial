import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import * as storePage from '../../store/hotel-search-result-page';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MomentModule } from 'ngx-moment';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';

import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { HotelSearchResultPageRoutingModule } from './hotel-search-result-page-routing.module';
import { HotelModalMapFilterModule } from './modal-components/hotel-modal-map-filter/hotel-modal-map-filter.module';

import { HotelSearchResultPageComponent } from './hotel-search-result-page.component';
import { HotelModalDetailFilterComponent } from './modal-components/hotel-modal-detail-filter/hotel-modal-detail-filter.component';
import { HotelModalAlignFilterComponent } from './modal-components/hotel-modal-align-filter/hotel-modal-align-filter.component';
import { HotelModalResearchComponent } from './modal-components/hotel-modal-research/hotel-modal-research.component';


@NgModule({
    declarations: [
        HotelSearchResultPageComponent,
        HotelModalDetailFilterComponent,
        HotelModalAlignFilterComponent,
        HotelModalResearchComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        InfiniteScrollModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        HotelSearchResultPageRoutingModule,
        HotelModalMapFilterModule,
        NgxBootstrapSliderModule,
        // store-page
        StoreModule.forFeature(storePage.hotelSearchResultPageFeatureKey, storePage.reducers),
        /**
         * ngx-bootstrap
         */
        AccordionModule.forRoot(),
        ModalModule.forRoot()

    ],
    exports: [
        NgxBootstrapSliderModule
    ]
})
export class HotelSearchResultPageModule { }