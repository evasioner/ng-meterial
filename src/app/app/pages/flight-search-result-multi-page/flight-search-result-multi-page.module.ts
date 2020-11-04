import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { RouterModule } from '@angular/router';
import { FlightSearchResultMultiPageComponent } from './flight-search-result-multi-page.component';
import { FlightSearchResultMultiPageRoutingModule } from './flight-search-result-multi-page-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    FlightSearchResultMultiPageComponent
  ],
  imports: [
    CommonModule,
    CommonSourceModule,
    RouterModule,
    FlightSearchResultMultiPageRoutingModule,
    InfiniteScrollModule,

    ModalModule.forRoot()
  ]
})
export class FlightSearchResultMultiPageModule { }
