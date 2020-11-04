import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { NgxTimerModule } from 'ngx-timer';
import { MomentModule } from 'ngx-moment';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CanActivateService, Permissions, UserToken } from './guard/canActivate/can-activate.service';
import { JwtService } from './services/jwt/jwt.service';
import { WebShareService } from './services/web-share/web-share.service';
import { StorageService } from './services/storage/storage.service';

import { CommonPipe } from './pipe/common.pipe';
import { NumberPadPipe } from './pipe/number-pad/number-pad.pipe';
import { TimeAmPmPipe } from './pipe/time-am-pm/time-am-pm.pipe';
import { WeatherIconPipe } from './pipe/weather-icon/weather-icon.pipe';
import { Time24to12Pipe } from './pipe/time24to12/time24to12.pipe';
import { WeekEnToKrPipe } from './pipe/week-en-to-kr/week-en-to-kr.pipe';
import { FlightMinuteToHourMinutePipe } from './pipe/flight-minute-to-hour-minute/flight-minute-to-hour-minute.pipe';
import { RentTimeToDateTimePipe } from './pipe/rent-time-to-date-time/rent-time-to-date-time.pipe';

import { HeaderFixedDirective } from './directives/header-fixed/header-fixed.directive';
import { EnOnlyDirective } from './directives/en-only/en-only.directive';
import { KoOnlyDirective } from './directives/ko-only/ko-only.directive';
import { NumOnlyDirective } from './directives/num-only/num-only.directive';

import { FlightHeaderComponent } from './components/flight-header/flight-header.component';
import { HotelHeaderComponent } from './components/hotel-header/hotel-header.component';
import { MypageHeaderComponent } from './components/mypage-header/mypage-header.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RentHeaderComponent } from './components/rent-header/rent-header.component';
import { ActivityHeaderComponent } from './components/activity-header/activity-header.component';
import { AirtelHeaderComponent } from './components/airtel-header/airtel-header.component';
import { TravelConvenienceHeaderComponent } from './components/travel-convenience-header/travel-convenience-header.component';
import { ErrorNodataComponent } from './components/error-nodata/error-nodata.component';
import { ErrorResultComponent } from './components/error-result/error-result.component';
import { ImgViewComponent } from './components/img-view/img-view.component';
import { LoaddingResultComponent } from './components/loadding-result/loadding-result.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';

import { MyModalMainComponent } from './modal-components/my-modal-main/my-modal-main.component';
import { FlightModalPaymentDetailComponent } from './modal-components/flight-modal-payment-detail/flight-modal-payment-detail.component';
import { FlightModalPaymentComponent } from './modal-components/flight-modal-payment/flight-modal-payment.component';
import { ModalDestinationComponent } from './modal-components/modal-destination/modal-destination.component';
import { HotelModalDetailOptionComponent } from './modal-components/hotel-modal-detail-option/hotel-modal-detail-option.component';
import { FlightModalChildrenInformaionComponent } from './modal-components/flight-modal-children-informaion/flight-modal-children-informaion.component';
import { FlightModalTravelerOptionComponent } from './modal-components/flight-modal-traveler-option/flight-modal-traveler-option.component';
import { FlightModalScheduleComponent } from './modal-components/flight-modal-schedule/flight-modal-schedule.component';
import { FlightModalResearchComponent } from './modal-components/flight-modal-research/flight-modal-research.component';
import { FlightModalPriceAlarmComponent } from './modal-components/flight-modal-price-alarm/flight-modal-price-alarm.component';
import { FlightModalAlignFilterComponent } from './modal-components/flight-modal-align-filter/flight-modal-align-filter.component';
import { FlightModalDetailFilterComponent } from './modal-components/flight-modal-detail-filter/flight-modal-detail-filter.component';
import { HotelModalTravelerOptionComponent } from './modal-components/hotel-modal-traveler-option/hotel-modal-traveler-option.component';
import { HotelModalChildrenInformationComponent } from './modal-components/hotel-modal-children-information/hotel-modal-children-information.component';
import { AirtelModalTravelerOptionComponent } from './modal-components/airtel-modal-traveler-option/airtel-modal-traveler-option.component';
import { AirtelModalChildrenInformationComponent } from './modal-components/airtel-modal-children-information/airtel-modal-children-information.component';
import { FlightModalScheduleInformationComponent } from './modal-components/flight-modal-schedule-information/flight-modal-schedule-information.component';
import { AirtelModalStepPageComponent } from './modal-components/airtel-modal-step-page/airtel-modal-step-page.component';
import { CommonModalAlertComponent } from './modal-components/common-modal-alert/common-modal-alert.component';
import { AirtelModalScheduleComponent } from './modal-components/airtel-modal-schedule/airtel-modal-schedule.component';
import { AirtelModalPaymentDetailComponent } from './modal-components/airtel-modal-payment-detail/airtel-modal-payment-detail.component';
import { AirtelModalResearchComponent } from './modal-components/airtel-modal-research/airtel-modal-research.component';
import { CommonModalCalendarComponent } from './modal-components/common-modal-calendar/common-modal-calendar.component';
import { InputSliderComponent } from './modal-components/input-slider/input-slider.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CommonModalPhotoListComponent } from './modal-components/common-modal-photo-list/common-modal-photo-list.component';
import { CommonModalPhotoDetailComponent } from './modal-components/common-modal-photo-detail/common-modal-photo-detail.component';
import { CommonModalLoadingComponent } from './modal-components/common-modal-loading/common-modal-loading.component';



@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        HotelHeaderComponent,
        RentHeaderComponent,
        ModalDestinationComponent,
        FlightModalChildrenInformaionComponent,
        FlightModalTravelerOptionComponent,
        FlightModalScheduleComponent,
        FlightModalResearchComponent,
        FlightModalPriceAlarmComponent,
        FlightModalAlignFilterComponent,
        FlightModalDetailFilterComponent,
        ActivityHeaderComponent,
        HotelModalTravelerOptionComponent,
        HotelModalChildrenInformationComponent,
        HotelModalDetailOptionComponent,
        InputSliderComponent,

        MypageHeaderComponent,

        RentTimeToDateTimePipe,


        FlightHeaderComponent,

        FlightMinuteToHourMinutePipe,

        FlightModalPaymentComponent,


        MyModalMainComponent,

        FlightModalPaymentDetailComponent,



        NumberPadPipe,

        AirtelHeaderComponent,

        AirtelModalTravelerOptionComponent,


        AirtelModalChildrenInformationComponent,

        FlightModalScheduleInformationComponent,

        WeekEnToKrPipe,

        Time24to12Pipe,

        TravelConvenienceHeaderComponent,

        ErrorResultComponent,

        LoaddingResultComponent,

        AirtelModalStepPageComponent,
        CommonModalAlertComponent,
        AirtelModalScheduleComponent,
        AirtelModalPaymentDetailComponent,
        ErrorNodataComponent,
        AirtelModalResearchComponent,
        CommonModalCalendarComponent,

        TimeAmPmPipe,
        WeatherIconPipe,

        ImgViewComponent,

        EnOnlyDirective,
        KoOnlyDirective,
        NumOnlyDirective,

        MainHeaderComponent,

        HeaderFixedDirective,

        CommonModalPhotoListComponent,
        CommonModalPhotoDetailComponent,
        CommonModalLoadingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        SlickCarouselModule,
        NgxBootstrapSliderModule,
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        MomentModule,
        LoadingBarModule,
        NgxTimerModule,
        ScrollToModule.forRoot()
    ],
    providers: [
        CanActivateService,
        Permissions,
        UserToken,
        JwtService,
        DatePipe,
        WebShareService,
        StorageService,
        NumberPadPipe

    ],
    exports: [
        NgxTimerModule,
        SlickCarouselModule,
        NgxBootstrapSliderModule,
        LoadingBarModule,

        CommonPipe,
        RentTimeToDateTimePipe,
        FlightMinuteToHourMinutePipe,
        NumberPadPipe,
        WeekEnToKrPipe,
        Time24to12Pipe,
        TimeAmPmPipe,
        WeatherIconPipe,

        EnOnlyDirective,
        KoOnlyDirective,
        NumOnlyDirective,
        HeaderFixedDirective,

        HeaderComponent,
        FooterComponent,
        HotelHeaderComponent,
        RentHeaderComponent,
        FlightHeaderComponent,
        AirtelHeaderComponent,
        ActivityHeaderComponent,
        MypageHeaderComponent,
        TravelConvenienceHeaderComponent,
        ErrorResultComponent,
        LoaddingResultComponent,
        CommonModalAlertComponent,
        ErrorNodataComponent,
        InputSliderComponent,
        ImgViewComponent,
        MainHeaderComponent,
        CommonModalLoadingComponent
    ]
})
export class CommonSourceModule { }
