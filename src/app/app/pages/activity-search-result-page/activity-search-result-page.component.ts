import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertActivityResultSearch } from '../../store/activity-search-result-page/activity-result-search/activity-result-search.actions';
import { clearActivityCitySearchs } from '@/app/store/activity-city-intro-page/activity-city-search/activity-city-search.actions';
import { clearActivityModalDestinations } from '@/app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CountdownTimerService } from 'ngx-timer';

import * as _ from 'lodash';
import * as qs from 'qs';

import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ApiActivityService } from '@/app/api/activity/api-activity.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { ActivityInput } from '@/app/common-source/enums/activity/activity-input.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { ActivityModalAlignFilterComponent } from './modal-components/activity-modal-align-filter/activity-modal-align-filter.component';
import { ActivityModalDetailFilterComponent } from './modal-components/activity-modal-detail-filter/activity-modal-detail-filter.component';
import { ActivityModalOptionComponent } from './modal-components/activity-modal-option/activity-modal-option.component';
import { CommonModalAlertComponent } from '../../common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-activity-search-result-page',
    templateUrl: './activity-search-result-page.component.html',
    styleUrls: ['./activity-search-result-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivitySearchResultPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;

    // 목록 관련 변수
    listType: string = '';
    resultCount: number = 0; // api rs 액티비티 카운트
    resultList: any; // api rs 액티비티 정보
    activityFilter: any; // api rs 액티비티 정보

    vm: any = {
        headerTitle: null,
        searchType: null, // CITY : 도시 선택, CATEGORY : 카테고리 선택, DETAIL : 상품 선택.
        searchCityCode: null,
        searchCityName: null,
        searchCategoryCode: null,
        searchCategoryName: null,
        detailId: null
    };

    loadingBool: Boolean = false;
    rxAlive: boolean = true;
    modalDestinationSearch$: Observable<any>; // 검색 모달창
    transactionSetId: any;

    bsModalOptionRef: BsModalRef;
    bsModalFilterRef: any;
    bsModalAlignRef: any;

    resolveData: any;
    infiniteScrollConfig: any = {
        distance: 2,
        throttle: 50
    };

    public detailUpdate: Boolean;        // 상세필터 변경 유무
    public alignUpdate: Boolean;         // 정렬필터 변경 유무

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private readonly store: Store<any>,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly apiActivityService: ApiActivityService,
        private readonly activityComServiceService: ActivityComServiceService,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
        private countdownTimerService: CountdownTimerService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.timerInit();
        this.storeActivityInit(); // store > activity-common 초기화

        /**
         * 초기화 데이터
         */
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        const rsData = this.activityComServiceService.afterEncodingRq(_.cloneDeep(data.resolveData));
                        this.resolveData = rsData;
                        this.detailUpdate = (this.resolveData.detailUpdate === 'true');
                        this.alignUpdate = (this.resolveData.alignUpdate === 'true');
                        this.isBrowser && this.pageInit();
                    }
                )
        );
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
                            console.info('[status]', status);
                            console.info('[rxAlive]', this.rxAlive);
                            console.info('[timerValue]', this.countdownTimerService.timerValue);

                            this.timerAlert();
                        }
                    }
                )
        );
    }

    /**
     * vm 초기화
     */
    vmInit() {
        this.listType = 'L';
        this.vm.searchCityName = '';
        this.vm.searchCategoryName = '';
        this.vm.detailId = '';
    }

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     * @param $resolveData
     */
    async pageInit() {
        // ---------[activity-list-rq-info 스토어에 저장]
        this.upsertOne({
            id: ActivityStore.STORE_RESULT_LIST_RQ,
            result: this.resolveData
        });

        // ---------[헤더 초기화]
        const tmpTitle = _.chain([this.resolveData.searchCityName, this.resolveData.searchCategoryName])
            .compact()
            .join(', ');
        this.headerInit(tmpTitle);
        // ---------[ end 헤더 초기화]

        // ---------[데이터 초기화]
        this.vmInit();
        this.rxAlive = true;
        this.vm.searchCityCode = this.resolveData.rq.condition.cityCode;
        this.vm.searchCityName = this.resolveData.searchCityName;
        this.vm.searchCategoryCode = (this.resolveData.rq.condition.activityCategoryCode) ? this.resolveData.rq.condition.activityCategoryCode : null;
        this.vm.searchCategoryCode = this.resolveData.searchCategoryName;
        console.log('abcdefg : ', this.resolveData);
        // ---------[ end 데이터 초기화]

        // ---------[api 호출 | 액티비티 리스트]
        let resData = null;
        this.loadingBool = false;
        this.loadingBar.start();
        resData = await this.callListApi(_.cloneDeep(this.resolveData.rq));
        this.loadingBool = true;
        this.loadingBar.complete();

        if (resData != undefined && resData != null) {
            // default
            this.transactionSetId = resData['transactionSetId'];
            this.resultCount = resData['result'].count.nowItem;
            this.resultList = resData['result'].activities;
            this.activityFilter = resData['result'].forFilter;
        } else {
            this.resultCount = 0;
            this.resultList = [];
        }

        this.upsertOne({
            id: ActivityStore.STORE_RESULT_LIST_RS,
            result: resData
        });
        // ---------[End api 호출 | 액티비티 리스트]
    }


    headerInit($headerTitle) {
        this.headerType = 'subPageType1'; // HeaderTypes.SUB_PAGE
        this.headerConfig = {
            title: $headerTitle,
            key: null,
            ctx: this.ctx
        };
    }

    /**
     * 검색 API 호출 액티비티 리스트
     */
    async callListApi($rq) {
        console.log('$$$$$$$$$$$$$$ rq', $rq);
        $rq.detailUpdate = undefined;
        $rq.alignUpdate = undefined;
        return this.apiActivityService.POST_ACTIVITY_LIST($rq)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info('[액티비티 리스트 > res]', res);
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }

    /**
     * 더보기
     */
    async listIncrease() {
        console.log('resultCount : ', this.resultCount);
        console.log('resultList : ', this.resultList);

        if (!this.resultList && (this.resultCount < this.resultList.length)) {
            return;
        }

        this.curLimitsIncrease();
        const res = await this.callListApi(_.cloneDeep(this.resolveData.rq));
        this.resultList = [...this.resultList, ...res['result'].activities];
    }

    /**
     * 증가
     */
    curLimitsIncrease() {
        const resolveData = _.cloneDeep(this.resolveData);
        resolveData.rq.condition.limits[0] += 10;
        resolveData.rq.condition.limits[1] += 10;
        this.resolveData = resolveData;
        // resolveData.rq = {...resolveData.rq, transactionSetId: this.transactionSetId};
    }


    /**
     * 다음 스탭으로 이동하는 로직
     * searchType에 따라 다른 페이지를 호출한다.
     */
    onGoNextPage() {
        if (this.vm.searchType == null) { // Defensive coding
            return;
        }

        let rqCondition = {};
        let tmpPath = '';

        if (this.vm.searchType === ActivityInput.SEARCH_TYPE_DETAIL) {
            if (this.vm.detailId === null) { // Defensive coding
                return;
            }

            // transactionSetId : this.transactionSetId, // 메인에서 바로 detail로 이동할 경우, 본 값이 없다.
            rqCondition = {
                activityCode: this.vm.detailId
            };
            tmpPath = ActivityCommon.PAGE_SEARCH_RESULT_DETAIL;
        } else {
            if (this.vm.searchCityCode === null) { // Defensive coding
                return;
            }

            rqCondition = {
                cityCode: this.vm.searchCityCode,
                limits: [0, 10]
            };

            tmpPath = ActivityCommon.PAGE_CITY_INTRO;
        }

        const activityMainInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                condition: rqCondition
            },
            searchCityName: this.vm.searchCityName, // display용
            searchCategoryName: this.vm.searchCategoryName // display용
        };


        this.rxAlive = false;
        const qsStr = qs.stringify(activityMainInfo);
        const path = tmpPath + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);


        if (tmpPath !== ActivityCommon.PAGE_SEARCH_RESULT) {
            this.router.navigate([path], extras);
        } else {
            // 같은 페이지 재호출시 상위 컴포넌트에 onInit을 다시 실행하기 위해 아래의 코드로 작성.
            this.router.navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate([path]));
        }

    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertActivityResultSearch({
            activityResultSearch: $obj
        }));
    }

    /**
     * store > activity-common 초기화
     */
    storeActivityInit() {
        this.store.dispatch(clearActivityModalDestinations());
        this.store.dispatch(clearActivityCitySearchs());
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
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * 검색 팝업 호출 = 재검색

    onGoSearchClick() {
      console.info('[검색어 클릭]');
      /**
       * 아이템 카테고리 코드
       * IC01 항공
       * IC02 호텔
       * IC03 렌터카
       * IC04 액티비티
       * IC05 일정표
       * /
      const itemCategoryCode = "IC04";

      const initialState: any = {
        storeId: "search",
        majorDestinationRq: { // 주요도시 API RQ
          rq: {
            currency: 'KRW', // TODO - user setting
            language: 'KO', // TODO - user setting
            stationTypeCode: environment.STATION_CODE,
            condition: {
              itemCategoryCode: itemCategoryCode,
              compCode: environment.COMP_CODE
            }
          }
        },
        destinationRq: { // 목적지검색 API RQ
          rq: {
            currency: 'KRW', // TODO - user setting
            language: 'KO', // TODO - user setting
            stationTypeCode: environment.STATION_CODE,
            condition: {
              itemCategoryCode: itemCategoryCode,
              keyword: null,
              limit : [0, 20]
            }
          }
        }
      };

      // ngx-bootstrap config
      const configInfo = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
      };

      console.info('[initialState]', initialState);

      this.bsModalRef = this.bsModalService.show(ActivityModalDestinationComponent, {initialState, ...configInfo});
    }
    */

    /**
     * 검색결과 목록 타입 변경
     */
    onChangeListType() {
        this.listType = (this.listType === 'L') ? 'I' : 'L';
    }

    /**
     * 옵션 모달 팝업 호출
     */
    onOptionSearchClick(sType) { // 1 : 도시, 2: 카테고리
        // 로딩중이거나 검색결과가 없을 경우. 모달창을 띄우지 않는다. 박종선(2020.06.11)
        if (!this.loadingBool || this.resultList == null || this.resultList.length == 0) {
            return;
        }

        const initialState = {
            storeId: 'activity-option',
            optionType: sType
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalOptionRef = this.bsModalService.show(ActivityModalOptionComponent, { initialState, ...configInfo });
    }

    /**
     * 상세 필터 모달 팝업 호출
     */
    onDetailFilterSearchClick() {
        const initialState: any = {
            storeId: 'activity-detail-filter'
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalFilterRef = this.bsModalService.show(ActivityModalDetailFilterComponent, { initialState, ...configInfo });
    }

    /**
     * 정렬 필터 모달 팝업 호출
     */
    onAlignFilterSearchClick() {
        const initialState: any = {
            storeId: 'activity-align-filter'
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalAlignRef = this.bsModalService.show(ActivityModalAlignFilterComponent, { initialState, ...configInfo });
    }


    /**
     * 상세 페이지 이동
     */
    onGoDetailPage(listIndex) {
        const activityOption = _.find(this.resultList, _.matchesProperty('activityIndex', listIndex));

        const activityOptionInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                transactionSetId: this.transactionSetId,
                condition: {
                    activityCode: Number(activityOption['activityCode'])
                }
            }
        };

        this.rxAlive = false;
        // const base64Str = this.base64Svc.base64EncodingFun(activityOptionInfo);
        // const path = ActivityStore.PAGE_SEARCH_RESULT_DETAIL + base64Str;
        const qsStr = qs.stringify(activityOptionInfo);
        const path = ActivityCommon.PAGE_SEARCH_RESULT_DETAIL + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    /**
     * 무한스크롤(화면 하단까지 스크롤된 경우 다음 페이지의 목록을 호출한다.)
     */
    async onScroll() {
        await this.listIncrease();
    }

    /**
     * 상품 defaultPhotoUrl null check.
     * @param $data
     */
    getBackgroundImg($data) {
        if ($data == null) {
            return '/assets/images/temp/@temp-hotel-image.png'; // TODO default img 퍼블 요청 필요.
        }

        return $data;
    }

    /**
     * ui 변경하여 필터 아웃으로 변경 시 오픈
     */
    public showFilterArea(): boolean {
        let showFlag = true;

        if (!this.detailUpdate && this.resultList.length === 0 && this.loadingBool) {
            showFlag = false;
        }

        return showFlag;
    }
}
