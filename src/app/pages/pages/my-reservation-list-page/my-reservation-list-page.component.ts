import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertCommonUserInfo, deleteCommonUserInfo } from 'src/app/store/common/common-user-info/common-user-info.actions';

import * as commonUserInfoSelectors from '../../store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { ApiBookingService } from '../../api/booking/api-booking.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { myReservationListPageVm } from './insterfaces/my-reservation-list-page-vm';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { AllReservationListComponent } from './components/all-reservation-list/all-reservation-list.component';

@Component({
    selector: 'app-my-reservation-list-page',
    templateUrl: './my-reservation-list-page.component.html',
    styleUrls: ['./my-reservation-list-page.component.scss']
})
export class MyReservationListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;
    isLogin: boolean = false;
    loadingBool: boolean = false;
    tabNo: any;
    resolveData: any;
    vm: myReservationListPageVm;
    selectCode = 0;
    commonUserInfo$: any;

    userInfo: any = {};
    traveler: any;

    private subscriptionList: Subscription[];

    @ViewChild(AllReservationListComponent) allReserCom: AllReservationListComponent;


    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private apiBookingService: ApiBookingService,
        public bsModalService: BsModalService,
        public jwtService: JwtService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.headerInit();
        this.checkedLogin();
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);
                        console.info('[1. route 통해 데이터 전달 받기]', this.resolveData);
                        const selectCode = Number(_.chain(this.resolveData).get('selectCode').value());
                        console.info('Number(selectCode)>>', selectCode);
                        this.resolveData.selectCode = selectCode;
                        this.resolveData.userInfo = this.userInfo;  // resolveData에 userInfo항목을 추가함(this.userInfo가 지금은 빈값)
                        // this.selectTab(this.resolveData.selectCode);
                    }
                )
        );
        // if (this.isLogin) { // 로그인 시 초기화
        //   this.userInfo = await this.jwtService.getUserInfo();
        //   this.resolveData.userInfo = this.userInfo;
        //   console.info('userInfo1111>>>>', this.userInfo);
        // }
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }



    observableInit() {
        this.commonUserInfo$ = this.store.pipe(
            select(commonUserInfoSelectors.getSelectId(['commonUserInfo']))
        );
    }
    subscribeInit() {
        this.subscriptionList.push(
            this.commonUserInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[userInfo]', ev);
                        if (ev) {
                            this.userInfo = ev.userInfo;
                            console.info('userInfo2222>>>>', this.userInfo);
                        }
                    }
                )
        );
    }

    aaa() {
        const futureMonth = moment().add(3, 'months');
        const pastMonth = moment().subtract(3, 'months');
        console.log('futureMonth >>>', futureMonth.format('YYYY-MM-DD'));
        console.log('pastMonth >>>', pastMonth.format('YYYY.MM.DD (ddd)'));
    }


    async checkedLogin() {
        this.isLogin = this.jwtService.checkedLogin();

        if (this.isLogin) { // 로그인 시 초기화
            this.jwtService.loginInit();
            const userInfoRes = await this.jwtService.getUserInfo();
            if (userInfoRes.succeedYn) {
                console.info('[로그인]');
                /**
                 * 로그인을 완료후 여행자 정보를 가져온다.
                 */
                const travelerReq = {
                    stationTypeCode: environment.STATION_CODE,
                    currency: 'KRW',
                    language: 'KO',
                    condition: {
                        userNo: userInfoRes.result.user.userNo
                    }
                };
                const travelerRes = await this.apiBookingService.POST_BOOKING_TRAVELER(travelerReq)
                    .toPromise()
                    .then((res: any) => {
                        if (res.succeedYn) {
                            return res;
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    })
                    .catch((err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    });

                console.info('[travelerRes]', travelerRes);
                console.info('[userInfoRes]', userInfoRes);
                this.resolveData.condition.userNo = userInfoRes.result.user.userNo;
                this.resolveData.userInfo = userInfoRes.result.user;
                console.info('userInfoRes>>>>>>>>>>>>>>>>>>>>', userInfoRes.result.user);
                const commonUserInfo: any = {
                    id: 'commonUserInfo',
                    userInfo: userInfoRes['result'],
                    traveler: travelerRes['result'].travelers
                };

                this.upsertOne(commonUserInfo);

            } else {
                console.info('[로그아웃]');
                this.jwtService.logoutInit();
                this.deleteOne('commonUserInfo');
                this.isLogin = false;
            }

            setTimeout(() => {
                this.loadingBool = true;
                this.selectTab(this.resolveData.selectCode);
            }, 100);
        }
        // console.info('commonUserInfo>>', commonUserInfo);
    }

    upsertOne($obj) {
        console.info('[upsertOne]', $obj);
        this.store.dispatch(upsertCommonUserInfo({
            commonUserInfo: $obj
        }));
    }

    deleteOne($id) {
        this.store.dispatch(deleteCommonUserInfo($id));
    }

    hisBack() {
        history.back();
    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '예약/결제 내역',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }
    /**
     * 라우트 초기화 : get으로 데이터 전달 받음
     */

    goToReservation() {
        const path = '/my-reservation-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToRecent() {
        const path = '/my-recent-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToWish() {
        const path = '/my-wish-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToCoupon() {
        // this.onCloseClick();
        const path = '/my-coupon-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToQna() {
        const path = '/my-qna-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToReview() {
        const path = '/my-review-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToCustomer() {
        // const path = '/my-customer-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToNotice() {
        const path = '/my-notice-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToEvent() {
        const path = '/my-promotion-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToShare() {
        // const path = '/my-share-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToSeller() {
        // const path = '/my-seller-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToAgreement() {
        // const path = '/my-agreement-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }

}

