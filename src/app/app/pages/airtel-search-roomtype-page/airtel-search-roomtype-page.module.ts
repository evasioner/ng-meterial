import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonSourceModule } from '../../common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AirtelSearchRoomtypePageComponent } from './airtel-search-roomtype-page.component';
import { AirtelSearchRoomtypePageService } from './services/search/airtel-search-roomtype-page.service';

import * as storePage from '../../store/airtel-search-result-page';
import { AgmCoreModule } from '@agm/core';
import { environment } from '@/environments/environment';
import { AirtelSearchRoomtypePageRoutingModule } from './airtel-search-roomtype-page-routing.module';

@NgModule({
    declarations: [AirtelSearchRoomtypePageComponent],
    imports: [
        RouterModule,
        CommonModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        StoreModule.forFeature(storePage.pageFeatureKey, storePage.reducers),
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP.API_KEY,
            language: 'ko',
            region: 'KR'
        }),
        AirtelSearchRoomtypePageRoutingModule,
    ],
    providers: [AirtelSearchRoomtypePageService]
})
export class AirtelSearchRoomtypePageModule { }
