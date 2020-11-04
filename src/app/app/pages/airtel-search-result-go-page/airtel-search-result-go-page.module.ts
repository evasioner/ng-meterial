import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirtelSearchResultGoPageComponent } from './airtel-search-result-go-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoreModule } from '@ngrx/store';
import * as storeAirtelSearchResultGo from 'src/app/store/airtel-search-result-go-page';
import { AirtelSearchResultGoPageRoutingModule } from './airtel-search-result-go-page-routing.module';



@NgModule({
  declarations: [
    AirtelSearchResultGoPageComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    RouterModule,
    MomentModule,
    InfiniteScrollModule,
    AirtelSearchResultGoPageRoutingModule,

    StoreModule.forFeature(storeAirtelSearchResultGo.airtelSearchResultGoFeatureKey, storeAirtelSearchResultGo.reducers),

    ModalModule.forRoot()
  ]
})
export class AirtelSearchResultGoPageModule { }
