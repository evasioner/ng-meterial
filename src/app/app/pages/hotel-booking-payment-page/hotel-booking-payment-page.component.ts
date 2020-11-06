import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

//service
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { HotelComService } from '@/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';

import { environment } from '@/environments/environment';

import { InicisPaymentSet, InicisPayType, InicisPayTypeList, InicisQuotaBaseList } from '@/app/common-source/models/payment/inicis-payment.model';
import { InicisCardList } from '../../common-source/models/payment/inicis-payment.model';

import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';
import { UserStore } from '@/app/common-source/enums/common/user-store.enum';
import { HotelStore } from '@/app/common-source/enums/hotel/hotel-store.enum';

//component
import { BasePageComponent } from '../base-page/base-page.component';
import { HotelCommon } from '@/app/common-source/enums/hotel/hotel-common.enum';

@Component({
    selector: 'app-hotel-booking-payment-page',
    templateUrl: './hotel-booking-payment-page.component.html',
    styleUrls: ['./hotel-booking-payment-page.component.scss']
})
export class HotelBookingPaymentPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    @ViewChild('inicisForm', { read: ElementRef }) private inicisForm: ElementRef;
    private subscriptionList: Subscription[];
    private dataModel: any;

    public headerType: any;
    public headerConfig: any;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private jwtService: JwtService,
        private route: ActivatedRoute,
        private comHotelS: HotelComService,
        private alertService: ApiAlertService,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    /**
     * initialize
     * 초기화
     */
    private initialize(): void {
        this.subscriptionList = [];
        this.dataModel = {};
        this.viewModel = {
            inicisUrl: environment.inicisPayUrl,
            inicisPayment: InicisPaymentSet,
            inicisCardList: InicisCardList,
            loadingFlag: true,
            amount: {},
            inicisQuotaBaseList: InicisQuotaBaseList,
            paymentLoading: false,
            inicisPayType: InicisPayTypeList
        };

        this.logInCheck();
    }

    /**
    * sessionInit
    * 세션 저장 데이터 꺼내기
    */
    private sessionInit(): void {
        const sessionItem = JSON.parse(localStorage.getItem(HotelStore.STORE_HOTEL_COMMON));

        console.log(sessionItem);
        if (!_.isEmpty(sessionItem.hotelSessionStorages.entities)) {
            this.dataModel.bookingResponse = sessionItem.hotelSessionStorages.entities[HotelStore.STORE_HOTEL_BOOKING_RS].result;
            this.dataModel.informationResponse = sessionItem.hotelSessionStorages.entities[HotelStore.STORE_HOTEL_BOOKING_INFORMATION_RS].result;
        }

        const userSessionItem = JSON.parse(localStorage.getItem(UserStore.STORE_COMMON));

        if (!_.isEmpty(userSessionItem.commonUserInfoes.entities)) {
            this.dataModel.user = userSessionItem.commonUserInfoes.entities[UserStore.STORE_COMMON_USER].userInfo.user;
        }

        console.log(_.cloneDeep(this.dataModel.informationResponse));
    }

    private logInCheck() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl)
            .then(
                (res: any) => {
                    if (res) {
                        this.sessionInit();
                        this.headerSet(this.dataModel.informationResponse);
                        this.viewModelSet();
                    } else {
                        this.alertService.showApiAlert('로그인 정보가 확인 되지 않습니다.');
                    }
                },
                () => {
                    this.alertService.showApiAlert('로그인 정보가 확인 되지 않습니다.');
                }
            );
    }

    /**
    * headerSet
    * 헤더 표시에 필요한 데이터 설정
    *
    * @param resolveData session 에 저장되었던 데이터
    */
    private headerSet(resolveData: any): void {
        console.info('[헤더 초기화]', resolveData);
        // ---------[헤더 초기화]
        const Moment = extendMoment(moment);
        const checkInDate = moment(resolveData.rq.checkInDate).format('MM.DD');
        const checkOutDate = moment(resolveData.rq.checkOutDate).format('MM.DD');
        const range = Moment.range(resolveData.rq.checkInDate, resolveData.rq.checkOutDate);
        const dayDiff = range.diff('days'); //여행일수
        const travelerInfo = this.comHotelS.getTravelerInfo(resolveData.roomConRq.rooms, false); //객실 수, 인원

        const stepTitle = `결제하기`;
        const headerDetail = `${checkInDate}-${checkOutDate}(${dayDiff}박), ${travelerInfo}`;

        this.headerInit({
            icon: 'card',
            stepTitle: stepTitle,
            detail: headerDetail
        });
        // ---------[ end 헤더 초기화]

        console.info('[헤더 초기화 끝]');
    }

    /**
     * headerInit
     * 헤더 초기화
     *
     * @param header
     */
    private headerInit(header: any): void {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: header.icon,
            step: { title: header.stepTitle },
            detail: header.detail,
            ctx: this
        };
    }

    /**
     * viewModelSet
     * 화면 데이터 그리기
     */
    private viewModelSet() {
        //호텔 취소수수료 정책 rq
        const lowestRoomAmount = this.dataModel.informationResponse.rq.roomInfo.lowestRoomAmount;
        const roomUpgrade: number = this.dataModel.informationResponse.rq.roomInfo.roomType.amountSum - lowestRoomAmount;
        this.viewModel.amount = {
            sum: this.dataModel.informationResponse.rq.roomInfo.roomType.amountSum,
            lowestRoomAmount: lowestRoomAmount,
            noRoomUpgradeBool: (roomUpgrade === 0) ? true : false
        };

        console.log('set view view : ', this.dataModel);
        this.viewModel.inicisPayment.P_OID = this.dataModel.bookingResponse.bookingItemCode;
        this.viewModel.inicisPayment.P_GOODS = this.dataModel.informationResponse.hotelInfoRs.hotel.hotelNameLn;
        this.viewModel.inicisPayment.P_AMT = this.dataModel.informationResponse.rq.roomInfo.roomType.amountSum;
        this.viewModel.inicisPayment.P_UNAME = this.dataModel.user.name;
        this.viewModel.inicisPayment.P_MOBILE = this.dataModel.user.mobileNo;
        this.viewModel.inicisPayment.P_EMAIL = this.dataModel.user.emailAddress;
        this.viewModel.inicisPayment.P_NOTI = `callBack=${HotelCommon.PAGE_BOOKING_COMPLETE}&code=${this.dataModel.bookingResponse.bookingItemCode}`;
    }

    public changePaymentType(event: MouseEvent, selectedItem: InicisPayType) {
        event && event.preventDefault();

        this.viewModel.inicisPayType.map(
            (item: InicisPayType) => {
                if (item.code === selectedItem.code) {
                    item.active = true;
                    this.viewModel.inicisPayment.P_RESERVED = item.code;
                } else {
                    item.active = false;
                }
            }
        );
    }

    public onPay(event: MouseEvent) {
        event && event.preventDefault();

        console.log(JSON.stringify(this.viewModel.inicisPayment));
        this.viewModel.paymentLoading = true;
        this.inicisForm.nativeElement.submit();
    }
}