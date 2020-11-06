import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as commonUserInfoSelectors from '@/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as qs from 'qs';
import * as _ from 'lodash';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { InicisCallBack } from '@/app/common-source/models/payment/inicis-payment.model';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';
import { UserStore } from '@/app/common-source/enums/common/user-store.enum';

import { CondisionSet, Condition } from '@/app/common-source/models/common/condition.model';

import { BasePageComponent } from '../base-page/base-page.component';
import { MyCommon } from '@/app/common-source/enums/my/my-common.enum';

@Component({
    selector: 'app-activity-booking-complete-page',
    templateUrl: './activity-booking-complete-page.component.html',
    styleUrls: ['./activity-booking-complete-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivityBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
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
        private store: Store<any>,
        private route: ActivatedRoute,
        public jwtService: JwtService,
        private apiBookingS: ApiBookingService,
        private alertService: ApiAlertService,
        private router: Router
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
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private initialize(): void {
        this.subscriptionList = [];
        this.dataModel = {};
        this.viewModel = {
            paymentLoading: true
        };
        this.sessionInit();
        this.getQueryParams();
    }

    private sessionInit() {
        const sessionItem = JSON.parse(localStorage.getItem(ActivityStore.STORE_COMMON));
        // this.headerInit();
        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            console.log('abcd : ', sessionItem.activitySessionStorages.entities);
            this.dataModel.booking = _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_BOOKING_RS].result);
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
                        this.loginInit();
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
        this.subscriptionList.push(
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
        this.dataModel.bookingRq.transactionSetId = this.dataModel.transactionSetId;
        this.dataModel.bookingRq.condition = this.dataModel.beforeBookingRq.condition;
        this.dataModel.bookingRq.condition.bookingCode = this.dataModel.beforeBookingRs.bookingCode;
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
        this.viewModel.bookingItemCode = this.dataModel.callBackData.code;
        this.viewModel.paymentLoading = false;
    }

    private subscribeInit() {
        this.subscriptionList.push(
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


    /**
     * 액티비티예약상세 마이페이지 상세페이지 이동
     */
    detailLink(event: MouseEvent) {
        event && event.preventDefault();

        const rq: Condition = CondisionSet;
        rq.condition = { userNo: this.dataModel.user.userNo };
        const path = MyCommon.PAGE_RESERVATION_LIST + qs.stringify(rq);
        this.router.navigate([path]);
    }

    /**
     * 액티비티예약상세 마이페이지 목록페이지 이동
     */
    listLink(event: MouseEvent) {
        event && event.preventDefault();

        const rq: Condition = CondisionSet;
        rq.condition = { userNo: this.viewModel.bookingItemCode };
        const path = MyCommon.PAGE_RESERVATION_ACTIVITY_DETAIL + qs.stringify(rq);
        this.router.navigate([path]);
    }
}
