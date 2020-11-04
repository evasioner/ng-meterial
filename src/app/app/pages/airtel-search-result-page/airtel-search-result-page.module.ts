import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonSourceModule } from '../../common-source/common-source.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AirtelSearchResultPageComponent } from './airtel-search-result-page.component';
import { AirtelSearchResultPageService } from './services/airtel-search-result-page.service';

import * as storePage from '../../store/airtel-search-result-page';
import { AirtelSearchResultPageRoutingModule } from './airtel-search-result-page-routing.module';

@NgModule({
  declarations: [AirtelSearchResultPageComponent],
  imports: [
    RouterModule,
    CommonModule,
    CommonSourceModule,
    FormsModule,
    ReactiveFormsModule,
    AirtelSearchResultPageRoutingModule,
    StoreModule.forFeature(storePage.pageFeatureKey, storePage.reducers)
  ],
  providers: [AirtelSearchResultPageService]
})
export class AirtelSearchResultPageModule { }
