import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';

import { environment } from '@/environments/environment';

import { InicisCardList, InicisPaymentSet, InicisPayType, InicisPayTypeList, InicisQuotaBaseList } from '@/app/common-source/models/payment/inicis-payment.model';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { UserStore } from '@/app/common-source/enums/common/user-store.enum';

@Component({
    selector: 'app-activity-booking-payment-page',
    templateUrl: './activity-booking-payment-page.component.html',
    styleUrls: ['./activity-booking-payment-page.component.scss']
})
export class ActivityBookingPaymentPageComponent extends BasePageComponent implements OnInit, OnDestroy {
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
        private activityComS: ActivityComServiceService,
        private route: ActivatedRoute,
        private alertService: ApiAlertService
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

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('bg');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('bg');
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

    private logInCheck() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl)
            .then(
                (res: any) => {
                    if (res) {
                        this.sessionInit();
                        this.headerSet();
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

    private sessionInit() {
        const sessionItem = JSON.parse(localStorage.getItem(ActivityStore.STORE_COMMON));
        console.log('세세세ㅔ세세세 셔셔셔셔셔셔셔ㅕㅅ 션 : ', sessionItem);
        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            this.dataModel.bookingResponse = _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_BOOKING_RS].result);
            const request = this.activityComS.afterEncodingRq(
                _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_BOOKING_INFORMATION].result)
            );
            this.dataModel.optionView = _.cloneDeep(request.view);
            this.dataModel.transactionSetId = request.rq.transactionSetId;
        }

        const userSessionItem = JSON.parse(localStorage.getItem(UserStore.STORE_COMMON));

        if (!_.isEmpty(userSessionItem.commonUserInfoes.entities)) {
            this.dataModel.user = userSessionItem.commonUserInfoes.entities[UserStore.STORE_COMMON_USER].userInfo.user;
        }
    }

    private viewModelSet() {
        console.log('뭐가 나올까요? 궁금하네요 : ', this.dataModel);
        this.viewModel.inicisPayment.P_OID = this.dataModel.bookingResponse.bookingItems[0].bookingItemCode;
        this.viewModel.inicisPayment.P_GOODS = this.dataModel.optionView.options[0].optionNameLn;
        this.viewModel.inicisPayment.P_AMT = this.dataModel.optionView.amountSum;
        this.viewModel.inicisPayment.P_UNAME = this.dataModel.user.name;
        this.viewModel.inicisPayment.P_MOBILE = this.dataModel.user.mobileNo;
        this.viewModel.inicisPayment.P_EMAIL = this.dataModel.user.emailAddress;
        this.viewModel.inicisPayment.P_NOTI = `callBack=${ActivityCommon.PAGE_BOOKING_COMPLETE}&code=${this.dataModel.bookingResponse.bookingItems[0].bookingItemCode}`;
    }

    /**
     * headerSet
     */
    private headerSet() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: 'icon sm card',
            title: '결제하기',
        };
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

        this.viewModel.paymentLoading = true;
        this.inicisForm.nativeElement.submit();
    }
}
