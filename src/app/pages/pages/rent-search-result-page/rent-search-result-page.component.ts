import { Component, Inject, PLATFORM_ID, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { take, takeWhile, tap, debounceTime, distinctUntilChanged, switchMap, finalize, map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { clearRentModalCalendars } from '@store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';
import { clearRentModalDestinations } from '@store/rent-common/rent-modal-destination/rent-modal-destination.actions';
import { upsertRentSearchResultPage } from '@store/rent-search-result-page/rent-search-result-page/rent-search-result-page.actions';
import { upsertRentSearchResultPageUiState, clearRentSearchResultPageUiStates } from '@store/rent-search-result-page/rent-search-result-page-ui-state/rent-search-result-page-ui-state.actions';

import * as rentUiStateSelectors from '@store/rent-search-result-page/rent-search-result-page-ui-state/rent-search-result-page-ui-state.selectors';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';

import * as qs from 'qs';
import * as _ from 'lodash';

import { ApiRentService } from '@api/rent/api-rent.service';
import { SeoCanonicalService } from '@common/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '@common/services/rent-com-service/rent-util.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { RentUiState } from './insterfaces/rent-ui-state';
import { RentResultVm } from './insterfaces/rent-result-vm';

import { PageCodes } from '@common/enums/page-codes.enum';
import { SearchResultListState } from '@/app/common-source/enums/search-result-list-state.enum';
import { RentSearchResultPageStoreIds } from './enums/rent-search-result-page-store-ids.enum';
import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@common/modal-components/common-modal-alert/common-modal-alert.component';
import { clearRentSearchResultPageCompareLists } from '@/app/store/rent-search-result-page/rent-search-result-page-compare-list/rent-search-result-page-compare-list.actions';

@Component({
    selector: 'app-rent-search-result-page',
    templateUrl: './rent-search-result-page.component.html',
    styleUrls: ['./rent-search-result-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RentSearchResultPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;
    resolveData: any;

    vm: RentResultVm;
    rentTabBodyStateInfo: RentUiState;

    researchOpenBool: boolean = false;
    isFilter: boolean;
    vehiclesLength: number;

    private subscriptionList: Subscription[];
    private rentListSubject$: Subject<any>;

    public errorFlag: boolean;

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
        private apiRentService: ApiRentService,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
        private countdownTimerService: CountdownTimerService,
        private location: Location,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.rentListSubject$ = new Subject<any>();
        this.subscriptionList = [];
        this.pageInit();
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';
        super.ngOnInit();

        this.headerInit();
        this.rentTabBodyStateInit();
        this.routeInit();
        this.timerInit();
        this.storeRentCommonInit();
        this.uiStateUpdate();
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


    /**
     * 페이지 초기화 : api 통신으로 데이터를 가져옴
     * api를 통해 화면에 표시할 데이터를 가져온다.
     */
    pageInit() {
        this.subscriptionList = [
            this.rentListSubject$
                .pipe(
                    map(req => req),
                    debounceTime(300),
                    distinctUntilChanged(
                        (before: any, now: any) => {
                            console.log(before, now, _.isEqual(before, now));
                            return _.isEqual(before, now);
                        }
                    ),
                    switchMap(
                        (req) => {
                            this.errorFlag = false;
                            this.apiLoadingBool = false;
                            this.loadingBar.start();
                            this.resolveData.rq = _.cloneDeep(req);
                            return this.apiRentService.POST_RENT_LIST(req)
                                .pipe(
                                    finalize(
                                        () => {
                                            this.loadingBool = true;
                                            this.apiLoadingBool = true;
                                            this.loadingBar.complete();
                                        }
                                    )
                                );
                        }
                    )
                )
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.apiDataInit(res);
                            this.filterChk(res);
                            this.resultListLenChk(res);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.errorFlag = true;
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        ];
    }

    /**
     * 렌터카 리스트 영역 초기화
     */
    rentTabBodyStateInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(rentUiStateSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_TAB_BODY_TOP)), // 스토어 ID
                    takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) { // 변경 데이터
                            this.rentTabBodyStateInfo = { ...ev.result };
                        } else { // 기본값 설정
                            this.rentTabBodyStateInfo = {
                                state: SearchResultPageState.IS_DEFAULT,
                                listState: SearchResultListState.IS_LIST,
                                btnCompareToggleBool: true
                            };
                        }
                    }
                )
        );
    }

    /**
     * 라우트 초기화 : get으로 데이터 전달 받음
     */
    routeInit() {
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveDataInit(data);
                    }
                )
        );
    }

    /**
     * url 통해 전달 받은 데이터 초기화
     * - 모든 데이터가 string 형태로 넘어오기때문에 형변환한다.
     *
     * @param $data
     */
    resolveDataInit($data) {
        console.info('[rent-search-result resolveDataInit]', $data);
        this.resolveData = _.cloneDeep($data.resolveData);

        const limits = _.chain(this.resolveData)
            .get('rq.condition.limits')
            .value()
            .map((o) => {
                return Number(o);
            });

        if (_.has(this.resolveData, 'rq.condition.filter.passengerCounts')) {
            const passengerCounts = _.chain(this.resolveData)
                .get('rq.condition.filter.passengerCounts')
                .value()
                .map((o) => {
                    const temp = {
                        passengerCount: Number(o.passengerCount)
                    };
                    return temp;
                });

            console.info('[passengerCounts]', passengerCounts);
            _.set(this.resolveData, 'rq.condition.filter.passengerCounts', passengerCounts);
        }
        console.info('[resolveDataInit > limits]', limits);

        this.resolveData.rq.condition.limits = limits;
        this.resolveData.locationReturnBool = (String(this.resolveData.locationReturnBool) === 'true');

        this.vmInit();
    }

    /**
   * url 을통해 전달 받은데이터와 화면에서 사용하는 데이터를 모아 vm을 만든다.
   * 만든 데이터를 스토어에 저장한다.
   * 여기서 저장되는 시점은 url로 데이터를 전달 받았을때 이다.
   * api 통시을 하기전 화면초기화 상태를 만든다.
   *
   */
    vmInit() {
        const RESOLVE_DATA = this.resolveData;

        this.vm = {
            locationAccept: RESOLVE_DATA.locationAccept,
            locationReturn: RESOLVE_DATA.locationReturn,
            locationReturnBool: RESOLVE_DATA.locationReturnBool,

            formDateStr: RESOLVE_DATA.formDateStr,
            formTimeList: RESOLVE_DATA.formTimeList,
            formTimeVal: RESOLVE_DATA.formTimeVal,

            toDateStr: RESOLVE_DATA.toDateStr,
            toTimeList: RESOLVE_DATA.toTimeList,
            toTimeVal: RESOLVE_DATA.toTimeVal,

            driverBirthday: RESOLVE_DATA.driverBirthday,

            rq: RESOLVE_DATA.rq,
            rs: null
        };

        console.log('[search-result resolveUpdate] ', this.vm);
        this.store.dispatch(
            upsertRentSearchResultPage({
                rentSearchResultPage: {
                    id: RentSearchResultPageStoreIds.RENT_RESOLVE_DATA,
                    result: this.vm
                }
            })
        );

        console.log(this.isBrowser);
        if (this.isBrowser) {
            this.rentListSubject$.next(this.vm.rq);
        }
    }

    /**
     * 타이머 초기화
     */
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
     * 필터 key 존재여부 체크
     * @param $res
     */
    filterChk($res) {
        console.info('[filterChk > $res]', $res);
        this.isFilter = _.has($res.result, 'filter');
        console.info('[filterChk > isFilter]', this.isFilter);
    }

    /**
     * 검색결과 갯수 체크
     * @param $res
     */
    resultListLenChk($res) {
        console.info('[resultListChk > $res]', $res);
        this.vehiclesLength = $res.result.vehicles.length;
        console.info('[resultListChk > vehiclesLength]', this.vehiclesLength);
    }

    /**
     * api 데이터 초기화
     * api를 통해 전달 받은 데이터를 초기화 하고 스토어에 저장한다.
     *
     * @param $res
     */
    apiDataInit($res) {
        const STORE_DATA = this.resolveData;
        this.vm = {
            locationAccept: STORE_DATA.locationAccept,
            locationReturn: STORE_DATA.locationReturn,
            locationReturnBool: STORE_DATA.locationReturnBool,

            formDateStr: STORE_DATA.formDateStr,
            formTimeList: STORE_DATA.formTimeList,
            formTimeVal: STORE_DATA.formTimeVal,

            toDateStr: STORE_DATA.toDateStr,
            toTimeList: STORE_DATA.toTimeList,
            toTimeVal: STORE_DATA.toTimeVal,

            driverBirthday: STORE_DATA.driverBirthday,

            rq: STORE_DATA.rq,
            rs: $res
        };

        this.store.dispatch(upsertRentSearchResultPage({
            rentSearchResultPage: {
                id: RentSearchResultPageStoreIds.RENT_SEARCH_RESULT_INFO,
                result: this.vm
            }
        }));
    }

    uiStateUpdate() {
        this.store.dispatch(upsertRentSearchResultPageUiState({
            rentSearchResultPageUiState: {
                id: RentSearchResultPageStoreIds.RENT_TAB_BODY_TOP,
                result: this.rentTabBodyStateInfo
            }
        }));
    }

    /**
     * store > rent-common 초기화
     */
    storeRentCommonInit() {
        this.store.dispatch(clearRentModalDestinations());
        this.store.dispatch(clearRentModalCalendars());
        this.store.dispatch(clearRentSearchResultPageCompareLists());
        this.store.dispatch(clearRentSearchResultPageUiStates());
    }

    timerAlert() {
        console.info('[timerAlert]');
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

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    goPageEvt(e) {
        console.info('[page -> goPageEvt]', e);
        const RES_VM = e;
        const rqInfo = {
            locationAccept: RES_VM.locationAccept,
            locationReturn: RES_VM.locationReturn,
            locationReturnBool: RES_VM.locationReturnBool,

            formDateStr: RES_VM.formDateStr,
            formTimeList: RES_VM.formTimeList,
            formTimeVal: RES_VM.formTimeVal,

            toDateStr: RES_VM.toDateStr,
            toTimeList: RES_VM.toTimeList,
            toTimeVal: RES_VM.toTimeVal,

            driverBirthday: RES_VM.driverBirthday,

            rq: RES_VM.rq
        };

        this.moveScrollTo('contents');
        this.rentListSubject$.next(rqInfo.rq);
    }

    /**
    * 스크롤 이동
    * @param id
    */
    moveScrollTo(id: string) {
        const doc = document.documentElement;
        const targetOffset = document.getElementById(id).getBoundingClientRect();
        const windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        const top = targetOffset.top + windowScrollTop - 54;
        window.scrollTo(0, top);
    }

    openResearchEvt() {
        console.info('[onResearchFormOpen]');
        this.researchOpenBool = true;
    }

    closeResearchEvt() {
        console.info('[onResearchFormClose]');
        this.researchOpenBool = false;
    }

    onGoToMain() {
        const path = '/rent-main';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    /**
    * 필터/정렬 Output Evt
    * 1. limit session 삭제
    * 2. rq 셋팅
    * 3. 결과 페이지 이동
    * @param data
    */
    onSearchOutEvt(data: any) {
        this.location.replaceState(`/${data.url}/${encodeURIComponent(qs.stringify(data.rq))}`);
        this.resolveDataInit({ resolveData: data.rq });
    }
}
