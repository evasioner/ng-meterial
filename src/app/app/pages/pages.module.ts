import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageModule } from './main-page/main-page.module';
import { SamplePageModule } from './sample-page/sample-page.module';
import { HotelMainPageModule } from './hotel-main-page/hotel-main-page.module';
import { HotelSearchResultPageModule } from './hotel-search-result-page/hotel-search-result-page.module';
import { HotelSearchRoomtypePageModule } from './hotel-search-roomtype-page/hotel-search-roomtype-page.module';
import { HotelBookingInformationPageModule } from './hotel-booking-information-page/hotel-booking-information-page.module';
import { HotelBookingCompletePageModule } from './hotel-booking-complete-page/hotel-booking-complete-page.module';
import { FlightSearchResultComePageModule } from './flight-search-result-come-page/flight-search-result-come-page.module';
import { FlightSearchResultGoPageModule } from './flight-search-result-go-page/flight-search-result-go-page.module';
import { FlightSearchResultMultiPageModule } from './flight-search-result-multi-page/flight-search-result-multi-page.module';
import { FlightMainPageModule } from './flight-main-page/flight-main-page.module';
import { FlightBookingCompletePageModule } from './flight-booking-complete-page/flight-booking-complete-page.module';
import { FlightBookingInformationPageModule } from './flight-booking-information-page/flight-booking-information-page.module';
import { ActivityBookingInformationPageModule } from './activity-booking-information-page/activity-booking-information-page.module';
import { ActivityBookingPageModule } from './activity-booking-page/activity-booking-page.module';
import { ActivityBookingCompletePageModule } from './activity-booking-complete-page/activity-booking-complete-page.module';
import { IndexPageModule } from './index-page/index-page.module';
import { HotelBookingPaymentPageModule } from './hotel-booking-payment-page/hotel-booking-payment-page.module';
import { FlightBookingPaymentPageModule } from './flight-booking-payment-page/flight-booking-payment-page.module';

import { BaseChildComponent } from './base-page/components/base-child/base-child.component';
import { BasePageComponent } from './base-page/base-page.component';
import { CmSystemErrorModule } from './cm-system-error/cm-system-error.module';

@NgModule({
    declarations: [
        BasePageComponent,
        BaseChildComponent
    ],
    imports: [
        CommonModule,
        IndexPageModule,
        MainPageModule,
        FlightMainPageModule,
        FlightSearchResultComePageModule,
        FlightSearchResultGoPageModule,
        FlightSearchResultMultiPageModule,
        FlightBookingPaymentPageModule,
        FlightBookingCompletePageModule,
        FlightBookingInformationPageModule,
        HotelMainPageModule,
        HotelSearchResultPageModule,
        HotelSearchRoomtypePageModule,
        HotelBookingInformationPageModule,
        HotelBookingPaymentPageModule,
        HotelBookingCompletePageModule,
        // AirtelMainPageModule,
        // RentMainPageModule,
        // RentSearchResultPageModule,
        // ActivityPageModule,
        // ActivitySearchResultPageModule,
        // ActivityCityIntroPageModule,
        // ActivitySearchResultDetailPageModule,
        // ActivitySearchResultOptionPageModule,
        ActivityBookingInformationPageModule,
        ActivityBookingPageModule,
        ActivityBookingCompletePageModule,
        CmSystemErrorModule,

        SamplePageModule
    ],
    providers: []
})
export class PagesModule { }


