import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { upsertCommonUserInfo, deleteCommonUserInfo } from 'src/app/store/common/common-user-info/common-user-info.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import * as _ from 'lodash';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { AllReservationListComponent } from './components/all-reservation-list/all-reservation-list.component';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-reservation-list-page',
    templateUrl: './my-reservation-list-page.component.html',
    styleUrls: ['./my-reservation-list-page.component.scss']
})
export class MyReservationListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    rxAlive: boolean = true;
    isLogin: boolean = false;
    tabNo: any;
    headerType: any;
    headerConfig: any;
    loadingBool: Boolean = false;
    resolveData: any;
    selectCode = 0;
    userInfo: any = {};
    commonUserInfo$: any;
    // infiniteScrollConfig: any = {
    //   distance: 1,
    //   throttle: 150
    // };
    private subscriptionList: Subscription[];

    @ViewChild(AllReservationListComponent) allReserCom: AllReservationListComponent;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private bsModalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        public jwtService: JwtService,
        public apiBookingService: ApiBookingService,
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
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
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

    /**
     * 로그인 체크
     */
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
                    .catch((err) => {
                        this.alertService.showApiAlert(err);
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

    // onScroll() {
    //   this.allReserCom.onScroll();
    // }

    // onTab0Click(e) {
    //   console.info('[전체 예약리스트]', e);
    //   const seltab = 'all-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab1Click(e) {
    //   console.info('[항공 예약리스트]', e);
    //   const seltab = 'flight-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab2Click(e) {
    //   console.info('[호텔 예약리스트]', e);
    //   const seltab = 'hotel-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab3Click(e) {
    //   console.info('[액티비티 예약리스트]', e);
    //   const seltab = 'activity-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab4Click(e) {
    //   console.info('[렌터카 예약리스트]', e);
    //   const seltab = 'rent-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab5Click(e) {
    //   console.info('[묶음할일 예약리스트]', e);
    //   const seltab = 'airtel-reservation-list';
    //   this.callReservation(seltab);
    // }

}
