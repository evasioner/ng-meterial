import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertFlightSearchResult } from '@/app/store/flight-common/flight-search-result/flight-search-result.actions';
import { upsertFlightMainSearch } from 'src/app/store/flight-main-page/flight-main-search/flight-main-search.actions';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CountdownTimerService } from 'ngx-timer';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiFlightService } from '@/app/api/flight/api-flight.service';
import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { HeaderTypes } from '@/app/common-source/enums/header-types.enum';

import { FlightModalResearchComponent } from '@/app/common-source/modal-components/flight-modal-research/flight-modal-research.component';
import { FlightModalPriceAlarmComponent } from '@/app/common-source/modal-components/flight-modal-price-alarm/flight-modal-price-alarm.component';
import { FlightModalScheduleComponent } from '@/app/common-source/modal-components/flight-modal-schedule/flight-modal-schedule.component';
import { FlightModalDetailFilterComponent } from '@/app/common-source/modal-components/flight-modal-detail-filter/flight-modal-detail-filter.component';
import { FlightModalAlignFilterComponent } from '@/app/common-source/modal-components/flight-modal-align-filter/flight-modal-align-filter.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-flight-search-result-multi-page',
    templateUrl: './flight-search-result-multi-page.component.html',
    styleUrls: ['./flight-search-result-multi-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlightSearchResultMultiPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;            // 헤더 타입
    headerConfig: any;          // 헤더 Config
    ItineraryCount: number = 0; // 여정 카운트( 여정1,2,3,4 )

    storeModel: any;         // 항공 스토어 모델
    flightStepRQ: any;          // 항공Step API RQ
    flightSearhRQ: any;         // 항공검색 API RQ
    resultList: any;            // 항공조회 결과 리스트
    transactionSetId: any;      // transactionSetId
    vmInfo: any;

    resolveData: any;
    isSearchDone: boolean = false;
    loadingBool: Boolean = false;
    detailUpdate: Boolean;
    alignUpdate: Boolean;

    bsModalFilterRef: any;
    bsModalAlignRef: any;
    bsModalChangeRef: any;
    bsModalAlarmRef: any;

    rxAlive: any = true;

    howMany: any = '';
    title: any = '';

    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    infiniteScrollConfig: any = {
        distance: 1,
        throttle: 150
    };

    vm: any = {
        aligns: [
            {
                type: 'RecommendDesc',
                name: '추천순',
                price: '1000',
                duration: '60'
            },
            {
                type: 'DurationAsc',
                name: '최단 여행 시간',
                price: '20000',
                duration: '120'
            },
            {
                type: 'AmountAsc',
                name: '최저가',
                price: '300000',
                duration: '180'
            }
        ]
    };
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private apiflightSvc: ApiFlightService,
        private datePipe: DatePipe,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
        private countdownTimerService: CountdownTimerService,
        private storageS: StorageService,
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

    /**
     * 1. route 통해 데이터 전달 받기
     * 2. 헤더 초기화
     * 3. api 호출
     */
    ngOnInit(): void {
        super.ngOnInit();
        this.timerInit();

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);

                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.vmInfo = _.cloneDeep(data.resolveData.vm);

                        // queryString to Integer Convert
                        this.resConvert(this.resolveData.rq);
                        this.storageS.makeRecentData(
                            'local',
                            {
                                rq: this.resolveData.rq,
                                vm: this.resolveData.vm,
                                detailUpdate: this.resolveData.detailUpdate,
                                alignUpdate: this.resolveData.alignUpdate
                            },
                            'flight'
                        );

                        const modelData: any = _.cloneDeep(this.resolveData);
                        modelData.stepRq = _.cloneDeep(this.resolveData.rq);
                        console.log('modelData >>', modelData);

                        console.info('[스토어에 flight-list-rq-info 저장 시작]');
                        this.modelInit('flight-list-rq-info', modelData, 'flightSearchResultMultiPage');

                        if (!_.has(this.resolveData.rq, 'condition.filter.itineraryIndexes')) {
                            this.ItineraryCount = 1;
                        } else {
                            this.ItineraryCount = this.resolveData.rq.condition.filter.itineraryIndexes.length + 1;
                        }

                        console.info('[2. 헤더 초기화 시작]');
                        this.pageInit(this.resolveData);

                        this.flightSearhRQ = _.cloneDeep(this.resolveData.rq);

                        // 필터 적용유무
                        if (!_.isEmpty(this.resolveData.stepRq)) {
                            // 적용
                            this.resConvert(this.resolveData.stepRq);
                            this.flightStepRQ = _.cloneDeep(this.resolveData.stepRq);
                            // 미적용
                        } else {
                            this.flightStepRQ = _.cloneDeep(this.resolveData.rq);
                        }

                        this.detailUpdate = (this.resolveData.detailUpdate === 'true');
                        this.alignUpdate = (this.resolveData.alignUpdate === 'true');

                        this.loadingBar.start();
                        console.info('[3. API 호출]');
                        this.flightSearch(this.flightSearhRQ);
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

    /**
     * 페이지 초기화
     * 2. 헤더 초기화
     * @param $resolveData
     */
    async pageInit($resolveData) {
        const momentRange = extendMoment(moment);
        // ---------[헤더 초기화]
        const headerTitle = `여정${this.ItineraryCount} ${$resolveData.rq.condition.itineraries[this.ItineraryCount - 1].originCityCodeIata}-${$resolveData.rq.condition.itineraries[this.ItineraryCount - 1].destinationCityCodeIata} 항공편 선택`;
        const originDatetime = $resolveData.rq.condition.itineraries[0].departureDate;
        const destDateTime = $resolveData.rq.condition.itineraries[$resolveData.rq.condition.itineraries.length - 1].departureDate;
        const range = momentRange.range(originDatetime, destDateTime);
        this.howMany = $resolveData.rq.condition.adultCount + $resolveData.rq.condition.childCount + $resolveData.rq.condition.infantCount;
        const headerTime = `${this.datePipe.transform(originDatetime, 'MM.dd')} - ${this.datePipe.transform(destDateTime, 'MM.dd')}(${range.diff('days') + 1}일), ${this.howMany} 명, ${$resolveData.vm.travelerStore.cabinClassNm}`;

        console.log(headerTitle);
        console.log(headerTime);

        this.headerInit('flight-departure', headerTitle, headerTime);

        // 가격 표시 문구
        if (this.howMany > 1) {
            this.title = `표시된 금액은 <strong class="color-main2">항공권+제세공과금+유류할증료</strong>의 합계입니다.`;
        } else {
            this.title = `표시된 금액은 성인 <strong class="color-main2">1인당 항공권+제세공과금+유류할증료</strong>의 합계입니다.`;
        }
        // ---------[ end 헤더 초기화]
        console.info('[2. 헤더 초기화 끝]');
    }

    /**
     * 헤더 초기화
     */
    headerInit($iconType, $headerTitle, $headerTime) {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: $iconType,
            step: {
                title: $headerTitle,
                changeBtnFun: this.onChangeBtnClick,
                alArmFun: this.onAlarm
            },
            detail: $headerTime,
            ctx: this.ctx
        };
    }

    /**
       * 항공 검색
       * 3. api 호출
       * @param $resolveData
       */
    async flightSearch($resolveData) {
        await this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY($resolveData)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info(`[API 호출 | 항공편 리스트(다구간) 여정 ${this.ItineraryCount}]`, res['result']);
                    this.transactionSetId = res['transactionSetId'];
                    this.resultList = _.cloneDeep(res);
                    this.isSearchDone = false;
                    console.info('[스토어에 flight-list-rs 저장]');
                    this.modelInit('flight-list-rs', this.resultList);

                    this.loadingBool = true;
                    this.loadingBar.complete();
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
        console.info('[3. API 호출 끝]');
        this.isSearchDone = true;
    }

    /**
     * 모델 초기화 & 스토어 업데이트
     * @param id
     * @param option
     */
    modelInit(id: string, option: any, pageId: string = '') {
        this.storeModel = {
            id: id,
            option: option,
            pageId: pageId
        };
        this.upsertOne(this.storeModel);
        console.info(`[스토어에 ${id} 저장 끝]`);
    }

    /**
     * 스토어에 값 수정 및 저장
     * @param $obj
     */
    upsertOne($obj) {
        this.store.dispatch(upsertFlightSearchResult({
            flightSearchResult: _.cloneDeep($obj)
        }));
    }

    /**
     * 항공 일정으로 이동
     */
    goToResultPage() {
        const initialState = {
            rq: this.flightStepRQ,
            vm: this.vmInfo
        };

        const bsModalRef = this.bsModalService.show(FlightModalScheduleComponent, { initialState, ...this.configInfo });

        this.subscriptionList.push(
            this.bsModalService.onHide
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    () => {
                        const path = bsModalRef.content.naviPath;
                        if (!_.isEmpty(path)) {
                            this.router
                                .navigateByUrl('/', { skipLocationChange: true })
                                .then(() => this.router.navigate([path]));
                        }
                    }
                )
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

    resConvert($Request: any) {
        console.info('[queryString to Integer Convert 시작]');

        $Request.condition.adultCount = Number($Request.condition.adultCount);
        $Request.condition.childCount = Number($Request.condition.childCount);
        $Request.condition.infantCount = Number($Request.condition.infantCount);
        $Request.condition.laborCount = Number($Request.condition.laborCount);
        $Request.condition.studentCount = Number($Request.condition.studentCount);
        $Request.condition.dynamicSearchYn = String(true) === $Request.condition.dynamicSearchYn ? true : false;

        // 직항
        if (_.has($Request.condition, 'filter.stops')) {
            $Request.condition.filter.stops[0].viaCount = Number($Request.condition.filter.stops[0].viaCount);
        }

        // 가격대
        if (_.has($Request.condition, 'filter.amount')) {
            $Request.condition.filter.amount.lowestAmount = Number($Request.condition.filter.amount.lowestAmount);
            $Request.condition.filter.amount.highestAmount = Number($Request.condition.filter.amount.highestAmount);
        }

        // 소요시간
        if (_.has($Request.condition, 'filter.time.duration')) {
            $Request.condition.filter.time.duration.maxMinutes = Number($Request.condition.filter.time.duration.maxMinutes);
            $Request.condition.filter.time.duration.minMinutes = Number($Request.condition.filter.time.duration.minMinutes);
        }

        // 경유지 체류시간
        if (_.has($Request.condition, 'filter.time.ground')) {
            $Request.condition.filter.time.ground.maxMinutes = Number($Request.condition.filter.time.ground.maxMinutes);
            $Request.condition.filter.time.ground.minMinutes = Number($Request.condition.filter.time.ground.minMinutes);
        }

        // 선택한 여정의 itineraryIndexes
        if (_.has($Request.condition, 'filter.itineraryIndexes')) {
            const indexes = _
                .chain($Request.condition)
                .get('filter.itineraryIndexes')
                .value()
                .map((o) => {
                    return Number(o);
                });
            $Request.condition.filter.itineraryIndexes = indexes;
        }

        // 기타 - 환승시 공항 변경 없음
        if (_.has($Request.condition, 'filter.others.airportChange')) {
            $Request.condition.filter.others.airportChange[0] = {
                changedOrNot: false
            };
        }

        // 기타 - 공동운항편 제외
        if (_.has($Request.condition, 'filter.others.codeShare')) {
            $Request.condition.filter.others.codeShare[0] = {
                sharedOrNot: false
            };
        }

        // 페이징 값
        const limits = _
            .chain(this.resolveData)
            .get('rq.condition.limits')
            .value()
            .map((o) => {
                return Number(o);
            });
        $Request.condition.limits = limits;

        console.info('[queryString to Integer Convert 끝]');
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
    * 모든 bsModalService 닫기
    */
    closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * 상단 정렬버튼(추천순, 최단여행시간, 최저가)
     * @param sortOrder
     */
    onAlign(sortOrder: string) {
        console.info('[상단 정렬(추천, 시간, 최저가)]', sortOrder);
        this.flightSearhRQ.condition.sortOrder = sortOrder;
        this.flightSearhRQ.condition.limits[0] = 0;
        this.flightSearhRQ.condition.limits[1] = 10;

        // transactionSetId 추가(검색-예약 트랜잭션을 묶어주는값)
        this.flightSearhRQ.transactionSetId = this.transactionSetId;

        console.info('[flightSearhRQ >]', this.flightSearhRQ);

        this.loadingBool = false;
        this.loadingBar.start();
        // 재 검색(정렬)
        this.flightSearch(this.flightSearhRQ);
    }

    /**
     * 디테일 필터 모달
     */
    onDetailFilter() {
        console.info('[ 필터 | 상세 ]');

        this.bsModalFilterRef = this.bsModalService.show(FlightModalDetailFilterComponent, { ...this.configInfo });
    }

    /**
      * 정렬 필터 모달
      */
    onAlignFilter() {
        console.info('[ 필터 | 정렬 ]');

        this.bsModalAlignRef = this.bsModalService.show(FlightModalAlignFilterComponent, { ...this.configInfo });
    }

    /**
     * 가격 알람 모달
     */
    onAlarm($ctx) {
        $ctx.bsModalAlarmRef = $ctx.bsModalService.show(FlightModalPriceAlarmComponent, { ...this.configInfo });
    }

    onChangeBtnClick = ($ctx) => {
        console.info('[변경 버튼 클릭]', $ctx);
        if ($ctx.isSearchDone) {
            $ctx.bsModalChangeRef = $ctx.bsModalService.show(FlightModalResearchComponent, { ...this.configInfo });

            this.subscriptionList.push(
                $ctx.bsModalService.onHide
                    .pipe(takeWhile(() => $ctx.rxAlive))
                    .subscribe(
                        () => {
                            const path = $ctx.bsModalChangeRef.content.naviPath;
                            if (!_.isEmpty(path)) {
                                $ctx.router
                                    .navigateByUrl('/', { skipLocationChange: true })
                                    .then(() => $ctx.router.navigate([path]));
                            }
                        }
                    )
            );
        }
    };

    async onScroll() {
        console.info('[무한스크롤 이벤트]');
        if (this.loadingBool) {
            await this.flightListIncrease();
        }
    }

    /**
    * 더보기
    */
    async flightListIncrease() {
        // 리스트 총 갯수 < 리미트 시작 값
        if (
            (!this.isBrowser || !_.has(this.resultList.result, 'totalFlightCount')) ||
            (this.resultList.result.totalFlightCount < this.flightSearhRQ.condition.limits[0] + 10)
        ) {
            return false;
        }

        const flightsList: any = _.cloneDeep(this.resultList.result.flights);

        this.flightSearhRQ.condition.limits[0] += 10;
        this.flightSearhRQ.condition.limits[1] += 10;
        console.info('[limits >]', this.flightSearhRQ.condition.limits);

        // 재검색
        this.loadingBar.start();

        this.resultList.result.flights = [...flightsList, ...this.resultList.result.flights];
    }

    /**
   * 항공편(가는편) 선택
   * @param flight
   */
    onSchedule(flight: any) {
        console.info('[항공편 선택 | 가는편]', flight);

        // transactionSetId 추가(검색-예약 트랜잭션을 묶어주는값)
        this.flightStepRQ.transactionSetId = this.transactionSetId;

        const itineraryIndex = flight.itinerary.itineraryIndex;

        // 필터에 선택한 여정의 itineraryIndex 추가
        if (_.has(this.flightStepRQ, 'condition.filter.itineraryIndexes')) {
            if (this.ItineraryCount <= this.flightStepRQ.condition.filter.itineraryIndexes.length) {
                this.flightStepRQ.condition.filter.itineraryIndexes.pop();
            }
            this.flightStepRQ.condition.filter.itineraryIndexes.push(itineraryIndex);
        } else if (_.has(this.flightStepRQ, 'condition.filter')) {
            this.flightStepRQ.condition.filter.itineraryIndexes = [itineraryIndex];
        } else {
            const addItem: any = {
                'itineraryIndexes': [itineraryIndex]
            };
            this.flightStepRQ.condition.filter = addItem;
        }
        // 페이지 ID
        this.flightStepRQ.pageId = 'flightSearchResultMultiPage';

        console.info('[flightStepRQ >>]', this.flightStepRQ);

        this.goToResultPage();
    }

    /**
    * ErrorResultComponent output 이벤트
    * 에러 발생 > 다시 검색 버튼 클릭 >  메인 이동
    * 1. 필터 적용된 다구간 1 and 다구간 2,3,4 ~ 일 경우 -> 뒤로가기
    * 2. 다구간1 and 필터 적용 x 에러 -> 메인 이동
    * @param e
    */
    errorSearchAgain(e) {
        const filter = this.resolveData.rq.condition.filter;
        if (_.has(filter, 'itineraryIndexes') || this.detailUpdate) { // 필터 적용된 다구간 1 and 다구간 2,3,4 ~ 일 경우
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.remove('overflow-none');
            this.location.back();
        } else { // 다구간1 and 필터 적용 x
            const path = e;
            const vm = this.resolveData.vm;
            console.info('errorSearchAgain', vm);
            const obj: any = {
                id: 'flight-search-again',
                search: vm
            };

            this.store.dispatch(upsertFlightMainSearch({
                flightMainSearch: obj
            }));

            this.router.navigate([path]);
        }
    }
}
