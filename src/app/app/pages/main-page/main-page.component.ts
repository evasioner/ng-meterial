import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { deleteCommonUserInfo, upsertCommonUserInfo } from '../../store/common/common-user-info/common-user-info.actions';

import * as commonUserInfoSelectors from '../../store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';

import { UtilUrlService } from '../../common-source/services/util-url/util-url.service';
import { ApiBookingService } from '../../api/booking/api-booking.service';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { MainMenuParams, MainMenuParamsSet, RecommendMenuParams, RecommendMenuParamsSet } from './models/main-page.model';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    isLogin: boolean = false;
    loadingBool: boolean = false;

    vm: any = {};

    userInfo: any;
    traveler: any;
    commonUserInfo$: any;

    public mainMenuParams: MainMenuParams[];
    public recommendMenuParams: RecommendMenuParams[];
    private subscriptionList: Subscription[];

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        public rentUtilSvc: RentUtilService,
        public jwtService: JwtService,
        private router: Router,
        public utilUrlService: UtilUrlService,
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

        this.subscriptionList = [];
        this.mainMenuParams = MainMenuParamsSet;
        this.recommendMenuParams = RecommendMenuParamsSet;
    }

    async ngOnInit() {
        console.info('[ngOnInit > 통합 메인]', this.router.url);
        super.ngOnInit();
        this.headerInit();
        this.setBodyClass('open');

        await this.checkedLogin();

        this.observableInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.setBodyClass();
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    observableInit() {
        this.commonUserInfo$ = this.store
            .pipe(select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])));
    }

    subscribeInit() {
        console.info('[subscribeInit]');
        this.subscriptionList.push(
            this.commonUserInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[ev]', ev);
                        if (ev) {
                            this.userInfo = ev.userInfo;
                            this.traveler = ev.traveler;
                            console.info('[1 userInfo]', this.userInfo);
                            console.info('[1 traveler]', this.traveler);
                        }
                    }
                )
        );
    }

    /**
     * 로그인 체크
     * 1. 쿠키 확인 : _YBSSTK
     * 2. 쿠키가 있으면 로그인 초기화
     * - localStorage 에 "access_token" : 쿠키 저장
     * 3. user/getInfo 사용해서 사용자 정보 가져옴.
     * - 사용자 정보 가져오기 성공 : 사용자 정보 userInfo에 저장
     * - 사용자 정보 가져오기 실패 : 로그아웃( 쿠키 삭제, 로컬스토리지 삭제)
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
                    .catch((err: any) => {
                        this.alertService.showApiAlert(err);
                    });

                console.info('[2 travelerRes]', travelerRes);
                console.info('[2 userInfoRes]', userInfoRes);

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
    }

    headerInit() {
        this.headerType = HeaderTypes.MAIN;
    }

    setBodyClass($state?) {
        if (this.isBrowser) {
            const bodyEl = document.getElementsByTagName('body')[0];
            if ($state === 'open') {
                bodyEl.classList.add('bg-main');
                bodyEl.classList.remove('bg');
            } else {
                bodyEl.classList.add('bg');
                bodyEl.classList.remove('bg-main');
            }
        }
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

    /**
     * 로그인 페이지 이동
     */
    onGoToLogin() {
        const returnUrl = this.utilUrlService.getOrigin() + `/main`;
        const res = this.jwtService.getLoginUrl(returnUrl);
        this.document.location.href = res;
    }

    /**
     * onOpenLate
     * a 태그 클릭 시 화면 새로고침 방지 임시용.
     *
     * @param {Event} event 돔이벤트
     *
     * @return {Object} 할인 이벤트 데이터
     */
    public onOpenLate(event): void {
        event && event.preventDefault();
    }
}
