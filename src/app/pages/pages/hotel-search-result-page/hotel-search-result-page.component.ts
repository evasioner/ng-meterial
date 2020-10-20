import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeWhile, take, switchMap, distinctUntilChanged, tap, finalize, debounceTime, map } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';

import { clearHotelModalCalendars } from '@/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { clearHotelModalDestinations } from '@/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
import { clearHotelModalTravelerOptions } from '@/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import { clearHotelModalDetailOptions } from '@/app/store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.actions';
import { clearHotelSearchResultMapPages } from '@/app/store/hotel-search-result-page/hotel-search-result-map-page/hotel-search-result-map-page.actions';
import { upsertHotelSearchResultPage, clearHotelSearchResultPages } from '@/app/store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.actions';
import { upsertHotelSearchResultPageUiState } from '@/app/store/hotel-search-result-page/hotel-search-result-page-ui-state/hotel-search-result-page-ui-state.actions';
import { upsertHotelSessionStorage } from '@/app/store/hotel-common/hotel-session-storage/hotel-session-storage.actions';
import { addHotelSearchResultPageCompareList } from '@/app/store/hotel-search-result-page/hotel-search-result-page-compare-list/hotel-search-result-page-compare-list.actions';

import * as hotelUiStateSelectors from '@/app/store/hotel-search-result-page/hotel-search-result-page-ui-state/hotel-search-result-page-ui-state.selectors';

// ngx
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';
import { LoadingBarService } from '@ngx-loading-bar/core';

// 모듈
import * as _ from 'lodash';
import * as qs from 'qs';

// 서비스
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { HotelComService } from '@/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiHotelService } from '@/app/api/hotel/api-hotel.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { HotelUiState } from './insterfaces/hotel-ui-state';

import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-hotel-search-result-page',
    templateUrl: './hotel-search-result-page.component.html',
    styleUrls: ['./hotel-search-result-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotelSearchResultPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    vm: any;
    resolveData: any;
    hotelSessionRq: any;
    hotelSessionTopBody: any;
    hotelSessionCompareList: any;
    hotelListRq: any; // 가공된 hotel/list rq
    researchRq: any; // 재검색용 가공된 hotel/list rq
    hotelTabBodyStateInfo: HotelUiState;

    isFiltered: boolean;
    hotelList: Array<any> = []; // hotel/list rs > hotelList
    hotelTransactionSetId: any; // hotel/list rs > 트랜잭션 Id
    totalItem: number; // hotel/list rs > totalItem : 전체 검색된 호텔 전체 수 (없을 시, 0 으로 내려옴)
    allVendors: number; // hotel/list rs > allVendors
    nowVendors: number; // hotel/list rs > nowVendors

    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;
    researchBool: boolean = false;

    private subscriptionList: Subscription[];
    private hotelListSubject$: Subject<any>;

    public errorFlag: boolean;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private comService: HotelComService,
        private apiHotelService: ApiHotelService,
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

        this.hotelListSubject$ = new Subject<any>();
        this.pageInit();
    }

    ngOnInit(): void {
        console.info('[ngOnInit]');
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';

        super.ngOnInit();
        this.headerInit();
        this.sessionInit();
        this.hotelTabBodyStateInit();
        this.timerInit();
        this.storeHotelCommonInit();
        this.routeInit();
        this.hotelUiStateInit();
        this.hotelCompareListInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    sessionInit() {
        console.info('>>>>>>>>>>>>>>>>>sessionInit<<<<<<<<<<<<<<<');
        const session = JSON.parse(sessionStorage.getItem('hotel-common'));
        if (!_.isEmpty(session.hotelSessionStorages.entities)) {
            if (!_.isEmpty(session.hotelSessionStorages.entities['hotel-search-limit']))
                this.hotelSessionRq = session.hotelSessionStorages.entities['hotel-search-limit'].result;

            if (!_.isEmpty(session.hotelSessionStorages.entities['hotel-tab-body-top']))
                this.hotelSessionTopBody = session.hotelSessionStorages.entities['hotel-tab-body-top'].result;
        }
        if (session.hotelSessionStorageCompareList.entities) {
            const compare = [];
            const sessionCompareList = session.hotelSessionStorageCompareList.entities;
            _.forEach(sessionCompareList, ($item) => {
                compare.push($item);
            });

            if (compare.length > 0)
                this.hotelSessionCompareList = compare;
        }
    }

    /**
     * 호텔 리스트 영역 초기화
     */
    hotelTabBodyStateInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelUiStateSelectors.getSelectId('hotel-tab-body-top')), // 스토어 ID
                    takeWhile(val => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('hotel-search-result-page> hotel-tab-body-top', ev);
                        if (ev) { // 변경 되이터
                            this.hotelTabBodyStateInfo = { ...ev.result };
                        } else { // 기본값 설정
                            if (this.hotelSessionTopBody) {
                                this.hotelTabBodyStateInfo = this.hotelSessionTopBody;
                            } else {
                                this.hotelTabBodyStateInfo = {
                                    state: SearchResultPageState.IS_DEFAULT,
                                    btnCompareToggleBool: true
                                };
                            }
                        }
                    }
                )
        );
    }

    hotelUiStateInit() {
        this.store.dispatch(upsertHotelSearchResultPageUiState({
            hotelSearchResultPageUiState: {
                id: 'hotel-tab-body-top',
                result: this.hotelTabBodyStateInfo
            }
        }));
    }

    hotelCompareListInit() {
        if (this.hotelSessionCompareList) {
            _.forEach(this.hotelSessionCompareList, ($item) => {
                this.compareListUpdate($item);
            });
        }
    }

    compareListUpdate($item) {
        const id = $item.id;
        const result = $item.result;
        this.store.dispatch(addHotelSearchResultPageCompareList({
            hotelSearchResultPageCompareList: {
                id,
                result
            }
        }));
    }

    timerInit() {
        const cdate = new Date();
        const timerVal = 10; // 타이머 분 설정
        cdate.setMinutes(cdate.getMinutes() + timerVal);
        this.countdownTimerService.startTimer(cdate);

        this.subscriptionList.push(
            this.countdownTimerService.onTimerStatusChange
                .pipe(takeWhile(val => this.rxAlive))
                .subscribe(
                    (status: any) => {
                        if (status === 'END') {
                            this.rxAlive = false;
                            console.info('[status]', status);
                            console.info('[rxAlive]', this.rxAlive);
                            console.info('[timerValue]', this.countdownTimerService.timerValue);

                            const alertTxt = '검색 후 10분이 경과하여 재검색 합니다.';
                            this.comService.timerAlert(alertTxt);
                        }
                    }
                )
        );
    }

    /**
     * 라우트 초기화 : get으로 데이터 전달 받음
     */
    routeInit() {
        console.info('[routeInit]');

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.paramParser(data);
                    }
                )
        );
    }

    /**
     * paramParser
     * url 변경 시 api 호출
     *
     * @param data
     */
    private paramParser(data: any): void {
        console.info('[1. route 통해 데이터 전달 받기]', data);
        this.resolveData = _.cloneDeep(data.resolveData);

        const rq = this.comService.makeHotelListRq(data.resolveData);

        if (_.has(this.hotelSessionRq, 'limits')) {
            const limits = _.chain(this.hotelSessionRq)
                .get('limits')
                .value()
                .map((o) => {
                    return Number(o);
                });
            rq.condition.limits = limits;
        } else {
            rq.condition.limits = [0, 10];
        }
        this.resolveData.rq = _.cloneDeep(rq);
        this.hotelListRq = _.cloneDeep(rq);
        this.researchRq = _.cloneDeep(rq);

        console.info('[1. route 통해 데이터 전달 받기 isBrowser]', this.resolveData);

        this.vmInit();

        if (this.isBrowser) {
            console.info('[1-1. 가공된 rq 데이터]', rq);
            this.hotelListSubject$.next(this.resolveData.rq);
        }
    }

    pageInit() {
        this.subscriptionList = [
            this.hotelListSubject$
                .pipe(
                    tap(
                        () => {
                            this.apiLoadingBool = false;
                            this.errorFlag = false;
                            this.loadingBar.start();
                        }
                    ),
                    map(req => req),
                    debounceTime(300),
                    distinctUntilChanged(
                        (before: any, now: any) => {
                            return _.isEqual(before, now);
                        }
                    ),
                    switchMap(
                        req => this.apiHotelService.POST_HOTEL_LIST(req)
                            .pipe(
                                finalize(() => {
                                    console.log('POST_HOTEL_LIST completed.');
                                    this.loadingBool = true;
                                    this.apiLoadingBool = true;
                                    this.loadingBar.complete();
                                })
                            )
                    )
                )
                .subscribe(
                    (res: any) => {
                        console.info('[pageInit > POST_HOTEL_LIST]', res);
                        if (res) {
                            if (res.succeedYn) {
                                this.rsDataInit(this.resolveData, res);
                                this.rsCheckInit(res);
                            } else {
                                this.alertService.showApiAlert(res.errorMessage);
                            }
                        }
                    },
                    (err: any) => {
                        this.errorFlag = true;
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        ];

        console.info('[API 호출 끝]');
    }

    vmInit() {
        const RESOLVE_DATA = this.resolveData;
        this.vm = {
            city: RESOLVE_DATA.city,
            chkIn: RESOLVE_DATA.chkIn,
            chkOut: RESOLVE_DATA.chkOut,
            roomList: RESOLVE_DATA.roomList,

            rq: RESOLVE_DATA.rq,
            rs: null
        };

        if (_.has(RESOLVE_DATA, 'limits'))
            this.vm['limits'] = RESOLVE_DATA.limits;

        if (_.has(RESOLVE_DATA, 'filter'))
            this.vm['filter'] = RESOLVE_DATA.filter;

        if (_.has(RESOLVE_DATA, 'hotelSearchTrd'))
            this.vm['hotelSearchTrd'] = RESOLVE_DATA.hotelSearchTrd;

        console.info('[vmInit] > this.vm', this.vm);
        console.info('[vmInit] > RESOLVE_DATA', RESOLVE_DATA);

        this.upsertOne({
            id: 'hotel-resolve-data',
            result: this.resolveData
        });
    }

    /**
     * 전달 받은 데이터를 스토어에 저장
     * @param $res
     */
    rsDataInit($resolveData, $res) {
        console.info('[rsDataInit]', $res);
        const STORE_DATA = $resolveData;
        this.vm = {
            city: STORE_DATA.city,
            chkIn: STORE_DATA.chkIn,
            chkOut: STORE_DATA.chkOut,
            roomList: STORE_DATA.roomList,

            rq: STORE_DATA.rq,
            rs: $res,
            state: SearchResultPageState.IS_DEFAULT
        };

        if (_.has(STORE_DATA, 'limits'))
            this.vm['limits'] = STORE_DATA.limits;

        if (_.has(STORE_DATA, 'sortOrder'))
            this.vm['sortOrder'] = STORE_DATA.sortOrder;

        if (_.has(STORE_DATA, 'filter'))
            this.vm['filter'] = STORE_DATA.filter;

        if (_.has(STORE_DATA, 'hotelSearchTrd'))
            this.vm['hotelSearchTrd'] = STORE_DATA.hotelSearchTrd;

        this.upsertOne({
            id: 'hotel-search-result-info',
            result: this.vm
        });

    }

    rsCheckInit($res) {
        console.info('[rsCheckInit]', $res);
        this.isFiltered = _.has($res.result, 'filter');
        this.hotelList = $res.result.hotels;
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_HOTEL
        };
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
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelSearchResultPage({
            hotelSearchResultPage: $obj
        }));
    }

    upsertSessionOne($obj) {
        this.store.dispatch(upsertHotelSessionStorage({
            hotelSessionStorage: _.cloneDeep($obj)
        }));
    }

    /**
    * store > hotel-common 초기화
    */
    storeHotelCommonInit() {
        console.info('[0. store > hotel-common 초기화]');
        this.store.dispatch(clearHotelModalDestinations());
        this.store.dispatch(clearHotelModalCalendars());
        this.store.dispatch(clearHotelModalTravelerOptions());
        this.store.dispatch(clearHotelModalDetailOptions());
        this.store.dispatch(clearHotelSearchResultPages());
        this.store.dispatch(clearHotelSearchResultMapPages());
    }

    /**
     * hotel-search-form Output Evt
     * 재검색 모달창 오픈
     * @param e
     */
    openResearchEvt(e) {
        if (this.apiLoadingBool)
            this.researchBool = true;
    }

    /**
     * hotel-research-form Output Evt
     * 재검색 모달창 닫기
     * @param e
     */
    closeResearchEvt(e) {
        this.researchBool = false;
    }

    private makeNewUrl(data): any {
        //---------------------- -- 1. limit session 삭제
        this.comService.deleteSessionItem('hotel-search-limit');

        //-------------------------------------------- 2. rq 셋팅
        const RES_VM = _.cloneDeep(data.rq);
        const URL = _.cloneDeep(data.url);
        const rqInfo = {
            city: RES_VM.city,
            chkIn: RES_VM.chkIn,
            chkOut: RES_VM.chkOut,
            roomList: RES_VM.roomList,
        };

        if (_.has(RES_VM, 'limits'))
            rqInfo['limits'] = RES_VM.limits;

        if (_.has(RES_VM, 'sortOrder'))
            rqInfo['sortOrder'] = RES_VM.sortOrder;

        if (_.has(RES_VM, 'filter'))
            rqInfo['filter'] = RES_VM.filter;

        if (_.has(RES_VM, 'hotelSearchTrd'))
            rqInfo['hotelSearchTrd'] = RES_VM.hotelSearchTrd;

        console.info('[makeNewUrl : ', rqInfo);

        //--------------------------------------------- 3. 결과 페이지 이동
        return {
            locationPath: `/${URL}/${encodeURIComponent(qs.stringify(rqInfo))}`,
            urlPath: `/${URL}/${qs.stringify(rqInfo)}`,
            rqInfo: rqInfo
        };
    }

    /**
    * 필터/정렬 Output Evt
    * 1. limit session 삭제
    * 2. rq 셋팅
    * 3. 결과 페이지 이동
    * @param e
    */
    onSearchOutEvt(e) {
        console.info('[page -> onSearchEvt e]', e);
        const info = this.makeNewUrl(e);
        console.info('[page -> onSearchEvt info]', info);
        this.location.replaceState(info.locationPath);
        this.paramParser({ resolveData: info.rqInfo });
    }

    /**
     * hotel-tab-body Output Evt
     * 페이지 검색
     * @param e
     */
    goPageEvt(e) {
        if (this.apiLoadingBool) {
            console.info('[goPageEvt] e', e);
            this.resolveData = e;
            this.moveScrollTo('contents');
            this.hotelListSubject$.next(this.resolveData.rq);
        }
    }

    /**
     * 스크롤 이동
     * @param $id
     */
    moveScrollTo($id: string) {
        const doc = document.documentElement;
        const targetOffset = document.getElementById($id).getBoundingClientRect();
        const windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        const top = targetOffset.top + windowScrollTop - 54;
        window.scrollTo(0, top);
    }

    goToMain() {
        const path = '/hotel-main';
        this.router.navigate([path], { relativeTo: this.route });
    }

    /**
     * onPageMvoe
     * 페이지 이동 이벤트
     * 필터나 페이지네이션은 자체적으로 api만 호출하고 지도와 리스트는 페이지 전환이 필요
     *
     * @param data
     */
    public onPageMvoe(data: any) {
        console.info('[onPageMvoe] data', data);
        const info = this.makeNewUrl(data);
        console.info('[onPageMvoe] info', info);
        this.router.navigate([info.urlPath]);
    }
}
