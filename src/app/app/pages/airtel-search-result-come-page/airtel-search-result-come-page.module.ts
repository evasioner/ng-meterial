import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirtelSearchResultComePageComponent } from './airtel-search-result-come-page.component';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'ngx-moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AirtelSearchResultComePageRoutingModule } from './airtel-search-result-come-page-routing.module';
import { AirtelModalPaymentComponent } from './modal-components/airtel-modal-payment/airtel-modal-payment.component';



@NgModule({
  declarations: [AirtelSearchResultComePageComponent, AirtelModalPaymentComponent],
  imports: [
    CommonModule,
    CommonSourceModule,
    RouterModule,
    MomentModule,
    InfiniteScrollModule,
    AirtelSearchResultComePageRoutingModule,

    ModalModule.forRoot()

  ]
})
export class AirtelSearchResultComePageModule { }
