import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { TranslateService } from '@ngx-translate/core';

//store
import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import * as _ from 'lodash';
import * as qs from 'qs';

//service
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';

import { environment } from '@/environments/environment';

import { InicisCallBack } from '@/app/common-source/models/payment/inicis-payment.model';

import { UserStore } from '@/app/common-source/enums/common/user-store.enum';
import { HotelStore } from '@/app/common-source/enums/hotel/hotel-store.enum';
import { CondisionSet, Condition } from '@/app/common-source/models/common/condition.model';

//component
import { BasePageComponent } from '../base-page/base-page.component';
import { MyCommon } from '@/app/common-source/enums/my/my-common.enum';

@Component({
    selector: 'app-hotel-booking-complete-page',
    templateUrl: './hotel-booking-complete-page.component.html',
    styleUrls: ['./hotel-booking-complete-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotelBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscribeList: Subscription[];
    private dataModel: any;

    public headerType: any;
    public headerConfig: any;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        public jwtService: JwtService,
        private alertService: ApiAlertService,
        private apiBookingS: ApiBookingService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscribeList && this.subscribeList.map(
            (item: Subscription) => {
                item && item.unsubscribe();
            }
        );
    }

    /**
     * initialize
     * 데이터 초기화
     */
    private initialize(): void {
        this.subscribeList = [];
        this.dataModel = {};
        this.viewModel = {
            paymentLoading: true
        };
        this.sessionInit();
        this.loginInit();
    }

    private sessionInit() {
        const session: any = JSON.parse(localStorage.getItem(HotelStore.STORE_HOTEL_COMMON));

        if (!_.isEmpty(session.hotelSessionStorages.entities)) {
            this.dataModel.beforeBookingRq = session.hotelSessionStorages.entities[HotelStore.STORE_HOTEL_BOOKING_RQ].result;
        }
    }

    private loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        console.info('[this.isBrowser > curUrl]', curUrl);

        this.jwtService.loginGuardInit(curUrl)
            .then(
                (e) => {
                    console.info('[jwtService.loginGuardInit > ok]', e);
                    if (e) {
                        this.getQueryParams();
                        this.subscribeInit();
                    }
                },
                (err) => {
                    console.info('[jwtService.loginGuardInit > err]', err);
                }
            );
    }

    /**
     * getQueryParams
     * 쿼리 데이터 받는 곳
     */
    private getQueryParams() {
        this.subscribeList.push(
            this.route.queryParams
                .pipe(
                    mergeMap(
                        (params: InicisCallBack) => {
                            console.log('rrrroute queryParams : ', params);
                            try {
                                if (params.P_STATUS === '00') {
                                    this.dataModel.inicisData = params;
                                    this.dataModel.callBackData = qs.parse(params.P_NOTI);
                                    this.makeBookingData();
                                    console.log(this.dataModel.bookingRq);
                                    return this.apiBookingS.POST_BOOKING_V2(this.dataModel.bookingRq);
                                } else {
                                    this.alertService.showApiAlert(params.P_RMESG1);
                                }
                            } catch (err) {
                                console.log(err);
                                this.alertService.showApiAlert(err);
                            }
                        }
                    )
                )
                .subscribe(
                    (res: any) => {
                        console.log('결제 완료 : ', res);
                        try {
                            if (res.succeedYn) {
                                this.dataModel.inicisResult = _.cloneDeep(res.result);
                                this.setViewModel();
                            } else {
                                this.alertService.showApiAlert(res.errorMessage);
                            }
                        } catch (err) {
                            this.alertService.showApiAlert(err);
                        }
                    },
                    err => {
                        console.log(err);
                        this.alertService.showApiAlert(err);
                    }
                )
        );
    }

    private makeBookingData() {
        console.log('하하하하하 : ', this.dataModel);
        this.dataModel.bookingRq = CondisionSet;
        this.dataModel.bookingRq.transactionSetId = this.dataModel.beforeBookingRq.transactionSetId;
        this.dataModel.bookingRq.condition = this.dataModel.beforeBookingRq.condition;
        this.dataModel.bookingRq.condition.domainAddress = window.location.hostname;
        this.dataModel.bookingRq.condition.deviceTypeCode = environment.DEVICE_TYPE;
        this.dataModel.bookingRq.condition.payment = {
            easyPay: {
                amount: Number(this.dataModel.inicisData.P_AMT),
                encodedData: window.btoa(encodeURIComponent(JSON.stringify(this.dataModel.inicisData)))
            }
        };

        this.dataModel.bookingRq.condition.hotelItems.map(
            (item: any, index: number) => {
                item.itemIndex = index;
                return item;
            }
        );
    }

    private setViewModel() {
        this.viewModel.bookingItemCode = this.dataModel.inicisResult.bookingItems[0].bookingItemCode;
        this.viewModel.paymentLoading = false;
    }

    private subscribeInit() {
        this.subscribeList.push(
            this.store
                .select(commonUserInfoSelectors.getSelectId([UserStore.STORE_COMMON_USER]))
                .subscribe(
                    (ev: any) => {
                        console.info('[userInfo]', ev);
                        if (ev) {
                            this.dataModel.userInfo = ev.userInfo;
                        }
                    }
                )
        );
    }

    public myBookingListLink(event: MouseEvent) {
        event && event.preventDefault();

        const rq: Condition = CondisionSet;
        rq.condition = { userNo: this.dataModel.user.userNo };
        const path = MyCommon.PAGE_RESERVATION_LIST + qs.stringify(rq);
        this.router.navigate([path]);
    }

    public myBookingDetailLink(event: MouseEvent) {
        event && event.preventDefault();

        const rq: Condition = CondisionSet;
        rq.condition = { userNo: this.viewModel.bookingItemCode };
        const path = MyCommon.PAGE_RESERVATION_HOTEL_DETAIL + qs.stringify(rq);
        this.router.navigate([path]);
    }

}