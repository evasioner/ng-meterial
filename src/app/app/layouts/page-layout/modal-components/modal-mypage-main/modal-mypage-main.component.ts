import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy, Input } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertCommonUserInfo, deleteCommonUserInfo } from 'src/app/store/common/common-user-info/common-user-info.actions';

import * as commonUserInfoSelectors from '@/app/store/common/common-user-info/common-user-info.selectors';
import * as commonLayoutSelectors from '@/app/store/common/common-layout/common-layout.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as qs from 'qs';

import { RentUtilService } from '@/app/common-source/services/rent-com-service/rent-util.service';
import { CommonLayoutSideMenuService } from '@/app/common-source/services/common-layout-side-menu/common-layout-side-menu.service';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';
import { UtilUrlService } from '@/app/common-source/services/util-url/util-url.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { environment } from '@/environments/environment';

import { BasePageComponent } from 'src/app/pages/base-page/base-page.component';
import { RentModalAgreementComponent } from 'src/app/pages/rent-booking-information-page/modal-components/rent-modal-agreement/rent-modal-agreement.component';

@Component({
    selector: 'app-modal-mypage-main',
    templateUrl: './modal-mypage-main.component.html',
    styleUrls: ['./modal-mypage-main.component.scss']
})
export class ModalMypageMainComponent extends BasePageComponent implements OnInit, OnDestroy {
    @Input() resolveData: any;
    isLogin: boolean = true;
    loadingBool: boolean = false;
    userInfo: any;
    traveler: any;
    commonUserInfo$: any;
    isMyModalMain: boolean = true;
    rxAlive: boolean = true;
    bookingInfo: any;
    result: any;

    isMyModalMain$: Observable<any>;
    storeId: string = 'my-menu-layout';
    private subscriptionList: Subscription[];
    summary: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        titleService: Title,
        metaTagService: Meta,
        seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        public rentUtilSvc: RentUtilService,
        private bsModalService: BsModalService,
        public jwtService: JwtService,
        public commonLayoutSideMenuService: CommonLayoutSideMenuService,
        public apiBookingService: ApiBookingService,
        public utilUrlService: UtilUrlService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.subscriptionList = [];
    }

    ngOnInit() {
        console.info('[ModalMypageMainComponent > ngOnInit]');
        super.ngOnInit();
        this.checkedLogin();
        this.observableInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
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
                        this.alertService.showApiAlert(err);
                    });

                console.info('[travelerRes]', travelerRes);
                console.info('[userInfoRes]', userInfoRes);

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

    observableInit() {
        console.log('왔썹');
        this.isMyModalMain$ = this.store
            .pipe(select(commonLayoutSelectors.getSelectId(this.storeId)));
        this.commonUserInfo$ = this.store
            .pipe(select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])));
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.isMyModalMain$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.isMyModalMain = ev.isMyModalMain;
                        } else {
                            this.isMyModalMain = false;
                        }
                    }
                )
        );
        this.subscriptionList.push(
            this.commonUserInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[ev]', ev);
                        if (ev) {
                            this.userInfo = ev.userInfo;
                            this.traveler = ev.traveler;
                            console.info('[userInfo]', this.userInfo);
                            console.info('[traveler]', this.traveler);
                        }
                    }
                )
        );
    }

    aaa() {
        this.checkedLogin();
        this.observableInit();
        this.subscribeInit();
    }

    onCloseClick() {
        // const bodyEl = document.getElementsByTagName('body')[0];
        // bodyEl.classList.remove('overflow-none');
        // this.bsModalRef.hide();
        this.commonLayoutSideMenuService.setClose();
    }

    // 예약리스트
    async goToReservation() {
        const userInfoRes = await this.jwtService.getUserInfo();
        const rqInfo =
        {
            'selectCode': '0',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                userNo: userInfoRes.result.user.userNo,
                bookingItemCode: userInfoRes.result.bookingItemCode
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        const extras = {
            relativeTo: this.route
        };
        this.onCloseClick();
        this.router.navigate([path], extras);

    }

    // 최근 본 상품
    goToRecent() {
        const path = '/my-recent-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
        this.onCloseClick();
    }

    // 장바구니
    goToCart() {
        const path = '/my-basket-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
        this.onCloseClick();
    }

    // 쿠폰&할인카드
    goToCoupon() {
        this.onCloseClick();
        const path = '/my-coupon-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }



    // 문의내역
    goToQna() {
        this.onCloseClick();
        const path = '/my-qna-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    // 후기작성
    goToReview() {
        this.onCloseClick();
        const path = '/my-review-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    // 고객센터
    goToCustomer() {
        alert('준비중 입니다.');
    }

    // 공지사항
    goToNotice() {
        this.onCloseClick();
        const path = '/my-notice-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    // 이벤트&기획전
    goToEvent() {
        this.onCloseClick();
        const path = '/my-event-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    // 친구초대
    goToShare() {
        alert('준비중 입니다.');
    }

    // 판매 및 입점
    goToSeller() {
        alert('준비중 입니다.');
    }

    // 이용약관
    goToAgreement() {
        this.onCloseClick();
        console.info('[일반규정]');

        const storeId = 'agreementNormal';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalAgreementComponent, { initialState, ...configInfo });
    }

    public onGoToLogin(): void {
        const returnUrl = this.utilUrlService.getOrigin() + `/main`;
        const res = this.jwtService.getLoginUrl(returnUrl);
        window.location.href = res;
    }
}
