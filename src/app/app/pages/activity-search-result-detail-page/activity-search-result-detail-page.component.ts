import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { clearActivityModalDestinations } from '@/app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';
import { clearActivityResultSearchs } from '@/app/store/activity-search-result-page/activity-result-search/activity-result-search.actions';
import { upsertActivitySearchResultDetailPage } from '@/app/store/activity-search-result-detail-page/activity-search-result-detail-page/activity-search-result-detail-page.actions';
import { clearActivityCitySearchs } from 'src/app/store/activity-city-intro-page/activity-city-search/activity-city-search.actions';
import { upsertActivitySessionStorage, clearActivitySessionStorages } from 'src/app/store/activity-common/activity-session-storage/activity-session-storage.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';

import * as _ from 'lodash';
import * as qs from 'qs';

import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { UtilUrlService } from '../../common-source/services/util-url/util-url.service';
import { ApiActivityService } from '@/app/api/activity/api-activity.service';
import { WebShareService } from '@/app/common-source/services/web-share/web-share.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { ActivityModalReviewComponent } from './modal-components/activity-modal-review/activity-modal-review.component';
import { ActivityModalProductQnaComponent } from './modal-components/activity-modal-product-qna/activity-modal-product-qna.component';
import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '../../common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-activity-search-result-detail-page',
    templateUrl: './activity-search-result-detail-page.component.html',
    styleUrls: ['./activity-search-result-detail-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivitySearchResultDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;

    isLogin: boolean = false;
    rxAlive: boolean = true;

    rqInfo: any;
    sessionInfo: any;
    transactionSetId: any;
    loadingBool: Boolean = false;

    bsModalReviewRef: any;
    bsModalQnaRef: any;

    public viewModel: any;
    private dataModel: any;
    resolveData: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        @Inject(DOCUMENT) private document: Document,
        titleService: Title,
        metaTagService: Meta,
        seoCanonicalService: SeoCanonicalService,
        translate: TranslateService,
        private readonly store: Store<any>,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly activityComServiceService: ActivityComServiceService,
        private readonly apiActivityService: ApiActivityService,
        public jwtService: JwtService,
        public utilUrlService: UtilUrlService,
        private bsModalService: BsModalService,
        private countdownTimerService: CountdownTimerService,
        private webShareS: WebShareService,
        private storageS: StorageService,
        private alertService: ApiAlertService,
        private apiMypageService: ApiMypageService,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.viewModel = {};
        this.dataModel = {};
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.headerInit();
        this.timerInit();
        this.storeActivityInit(); // store > activity-common 초기화
        this.sessionInit();

        this.isLogin = this.jwtService.checkedLogin();

        /**
         * 초기화 데이터
         */
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        if (this.sessionInfo != null) {// session을 통해서 넘어온 값이라면
                            this.rqInfo = this.sessionInfo;
                        } else {
                            const rsData = this.activityComServiceService.afterEncodingRq(
                                _.cloneDeep(data.resolveData)
                            );
                            this.rqInfo = rsData;
                        }
                        console.log(this.rqInfo, 'this.rqInfo');
                        console.log(data.resolveData, 'data.resolveData');


                        this.isBrowser && this.pageInit();
                    }
                )
        );

    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals(); // TODO 문의하기중일때 화면을 닫으면 안될거 같은데...
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private headerInit(): void {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '상품 상세 정보',
            key: 'TITLE',
            ctx: this.ctx
        };
    }

    timerInit() {
        const cdate = new Date();
        const timerVal = 10; // 타이머 분 설정
        cdate.setMinutes(cdate.getMinutes() + timerVal);
        this.countdownTimerService.startTimer(cdate);

        this.subscriptionList.push(
            this.countdownTimerService.onTimerStatusChange
                .pipe(take(1))
                .subscribe(
                    (status: any) => {
                        console.info('[status]', status);
                        if (status === 'END') {
                            this.rxAlive = false;
                            this.timerAlert();
                        }
                    }
                )
        );
    }

    sessionInit() {
        const sessionItem = JSON.parse(localStorage.getItem(ActivityStore.STORE_COMMON));
        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            if (sessionItem.activitySessionStorages.entities[ActivityStore.STORE_RESULT_DETAIL_RQ]) {
                this.sessionInfo = _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_RESULT_DETAIL_RQ].option);
                this.storeActivitySessionInit();
            }
        }
    }

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     */
    pageInit() {
        this.rxAlive = true;
        this.loadingBool = true;

        this.subscriptionList.push(
            this.apiActivityService.POST_ACTIVITY_INFORMATION(this.rqInfo.rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('POST_ACTIVITY_INFORMATION : ', res);
                            this.transactionSetId = res['transactionSetId'];
                            this.dataModel.response = _.cloneDeep(res.result);
                            this.setViewModel();
                            this.storageS.makeRecentData(
                                'local',
                                {
                                    resolveData: this.rqInfo,
                                    // activityCode: this.dataModel.response.activityCode,
                                    activityNameEn: res.result.activityNameEn || '',
                                    continentNameLn: res.result.serviceCities[0].continentNameLn,
                                    cityNameLn: res.result.serviceCities[0].cityNameLn,
                                    amountSum: res.result.amountSum,
                                    vendorCompName: res.result.vendorCompName,
                                },
                                'activity'
                            );
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }

                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )

        );


        console.log(this.rqInfo, 'this.rqInfo');

        console.log(this.dataModel.response, 'this.dataModel.response');
    }

    /**
     * setViewModel
     * 화면 구성용 데이터
     */
    private setViewModel(): void {
        const info = this.dataModel.response.info ? true : false;
        this.viewModel = {
            maxInfoLength: 3,
            mainImage: '',
            images: [],
            imageCount: 0,
            activityName: this.dataModel.response.activityNameLn,
            activityCode: this.dataModel.response.activityCode,
            reviewAverage: this.dataModel.response.reviewAverage,
            reviewCount: this.dataModel.response.reviewCount,
            instantConfirmYn: this.dataModel.response.instantConfirmYn,
            vendorCompName: this.dataModel.response.provider.name,
            vendorCompImage: this.dataModel.response.provider.photoUrl,
            caution: info && this.dataModel.response.info.caution,
            amountSum: (this.dataModel.response.amountSum || 0),
            tabMenuList: [
                { text: '상품설명', id: 'info', count: 0, active: true, show: false, more: false },
                { text: '상세일정', id: 'itinerary', count: 0, active: true, show: false, more: true },
                { text: '사용방법', id: 'use', count: 0, active: false, show: false, more: true },
                { text: '취소규정', id: 'cancel', count: 0, active: false, show: false, more: true },
                { text: '이용후기', id: 'after', count: 0, active: false, show: false, more: true }
            ]
        };

        if (!_.isEmpty(this.dataModel.response.photos)) {
            this.viewModel.mainImage = this.dataModel.response.photos[0].photoUrl;
            this.viewModel.images = this.dataModel.response.photos;
            this.viewModel.imageCount = (this.dataModel.response.photos.length - 4) < 0 ? 0 : `+${(this.dataModel.response.photos.length - 4)}`;
        }

        Object.entries(this.dataModel.response.info).map(
            ([key, value]: any) => {
                if (value) {
                    switch (key) {
                        case 'caution':
                            this.viewModel.tabMenuList[0].show = true;
                            this.viewModel.tabMenuList[0].count++;
                            this.viewModel.cautionDetail = value;
                            break;

                        case 'excludedDetail':
                            this.viewModel.tabMenuList[0].show = true;
                            this.viewModel.tabMenuList[0].count++;
                            this.viewModel.excludedDetail = value;
                            break;

                        case 'howToUse':
                            this.viewModel.tabMenuList[2].show = true;
                            this.viewModel.howToUse = value;
                            break;

                        case 'includedDetail':
                            this.viewModel.tabMenuList[0].show = true;
                            this.viewModel.tabMenuList[0].count++;
                            this.viewModel.includedDetail = value;
                            break;

                        case 'itineraryDetail':
                            this.viewModel.tabMenuList[1].show = true;
                            this.viewModel.tabMenuList[1].count++;
                            this.viewModel.itineraryDetail = value;
                            break;

                        case 'othersDesc':
                            this.viewModel.tabMenuList[3].show = true;
                            this.viewModel.othersDescDetail = value;
                            break;

                        case 'productDesc':
                            this.viewModel.tabMenuList[0].show = true;
                            this.viewModel.tabMenuList[0].count++;
                            this.viewModel.productDescDetail = value;
                            break;
                    }
                } else {
                    this.viewModel[key] = '';
                }
            }
        );
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertActivitySearchResultDetailPage({
            activitySearchResultDetailPage: $obj
        }));
    }

    /**
     * 세션스토리지에 저장되는 스토어에 값 수정 및 저장
     * @param $obj
     */
    upsertOneSession($obj) {
        this.store.dispatch(upsertActivitySessionStorage({
            activitySessionStorage: _.cloneDeep($obj)
        }));
    }

    /**
     * store > activity-common 초기화
     */
    storeActivityInit() {
        this.store.dispatch(clearActivityModalDestinations());
        this.store.dispatch(clearActivityCitySearchs());
        this.store.dispatch(clearActivityResultSearchs());
    }

    storeActivitySessionInit() {
        this.store.dispatch(clearActivitySessionStorages());
    }

    timerAlert() {
        const initialState = {
            titleTxt: '검색 후 10분이 경과하여 재검색 합니다.',
            closeObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => {
                            this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                        });
                }
            },
            okObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => {
                            this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                        });
                }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
     * onShareClick
     * 공유하기
     *
     * @param event dom 이벤트
     */
    public onShareClick(event: any): void {
        event && event.preventDefault();

        this.webShareS.webShare(
            {
                title: this.viewModel.activityName,
                text: this.viewModel.productDesc,
                url: this.router.url
            }
        );
    }

    /**
     * onAttentionClick
     * 공유하기
     *
     * @param event dom 이벤트
     */
    public onAttentionClick(event: any): void {
        event && event.preventDefault();
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }
    /**
     * 여행 후기 클릭 - 더보기 모달팝업
     */
    onGoReview() {
        const initialState: any = {
            storeId: 'activity-modal-review'
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalReviewRef = this.bsModalService.show(ActivityModalReviewComponent, { initialState, ...configInfo });
    }

    /**
     * 문의하기 클릭 - 문의하기 모달팝업
     */
    async onGoQna() {

        const userInfoRes = await this.jwtService.getUserInfo();

        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                boardMasterSeq: 1000020,
                postCategoryCode: 'IC04',
                userNo: userInfoRes.result.user.userNo,
                postTitle: this.dataModel.response.activityNameEn
            },
        };

        this.subscriptionList.push(
            this.apiMypageService.PUT_QNA(rqInfo)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.dataModel.response = _.cloneDeep(res.result);
                            console.log('성공이다~~~~');

                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        console.log('error');
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );

        if (!this.isLogin) {
            this.upsertOneSession(
                {
                    id: ActivityStore.STORE_RESULT_DETAIL_RQ,
                    result: _.cloneDeep(this.rqInfo)
                }
            );

            const qsStr = qs.stringify(this.rqInfo);
            const path = ActivityCommon.PAGE_SEARCH_RESULT_DETAIL + qsStr;

            const returnUrl = this.utilUrlService.getOrigin() + path;
            const res = this.jwtService.getLoginUrl(returnUrl);
            this.document.location.href = res;
            console.log(this.rqInfo, 'this.rqInfo');
            console.log(res, 'res');


        } else {
            const initialState: any = {
                storeId: 'activity-modal-qna'
            };

            // ngx-bootstrap config
            const configInfo = {
                class: 'm-ngx-bootstrap-modal',
                animated: false
            };

            this.bsModalQnaRef = this.bsModalService.show(ActivityModalProductQnaComponent, { initialState, ...configInfo });
        }
    }

    /**
     * onGoCalendarClick
     * 최종 확인 모달
     *
     * @param event dom event
     */
    public onGoCalendarClick(event: any): void {
        event && event.preventDefault();

        const activityOptionInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                transactionSetId: this.transactionSetId,
                condition: {
                    activityCode: Number(this.rqInfo.rq.condition.activityCode)
                }
            }
        };

        this.rxAlive = false;
        const qsStr = qs.stringify(activityOptionInfo);
        const path = ActivityCommon.PAGE_SEARCH_RESULT_OPTION + qsStr;
        this.router.navigate([path], { relativeTo: this.route });
    }
}
