import { Component, OnInit, Inject, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { upsertAirtelSearchResult } from 'src/app/store/airtel-common/airtel-search-result/airtel-search-result.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiFlightService } from 'src/app/api/flight/api-flight.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { FlightModalPriceAlarmComponent } from 'src/app/common-source/modal-components/flight-modal-price-alarm/flight-modal-price-alarm.component';
import { FlightModalDetailFilterComponent } from 'src/app/common-source/modal-components/flight-modal-detail-filter/flight-modal-detail-filter.component';
import { FlightModalAlignFilterComponent } from 'src/app/common-source/modal-components/flight-modal-align-filter/flight-modal-align-filter.component';
import { AirtelModalResearchComponent } from 'src/app/common-source/modal-components/airtel-modal-research/airtel-modal-research.component';

@Component({
    selector: 'app-airtel-search-result-go-page',
    templateUrl: './airtel-search-result-go-page.component.html',
    styleUrls: ['./airtel-search-result-go-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AirtelSearchResultGoPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;        // 헤더 타입
    headerConfig: any;      // 헤더 Config

    storeModel: object;     // 항공 스토어 모델
    flightStepRQ: any;      // 항공Step API RQ
    flightSearhRQ: any;     // 항공검색 API RQ
    resultList: any;        // 항공조회 결과 리스트
    transactionSetId: any;  // transactionSetId
    vmInfo: any;

    resolveData: any;

    detailUpdate: Boolean;
    alignUpdate: Boolean;
    loadingBool: Boolean = false;

    bsModalFilterRef: BsModalRef; // 상세필터 모달
    bsModalAlignRef: BsModalRef;  // 정렬 모달
    bsModalChangeRef: BsModalRef; // 재검색 모달
    bsModalAlarmRef: BsModalRef;  // 가격알림 모달

    rxAlive: any = true;  // 구독 제어변수( true : subscribe, false : unsubscribe)

    // 모달 파라미터(클래스 추가)
    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    // 무한스크롤 옵션
    infiniteScrollConfig: any = {
        distance: 1,
        throttle: 150
    };

    // 뷰 모델
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
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private apiflightSvc: ApiFlightService,
        private datePipe: DatePipe,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
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

    /**
     * 1. route 통해 데이터 전달 받기
     * 2. 헤더 초기화
     * 3. api 호출
     */

    ngOnInit(): void {
        super.ngOnInit();

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);

                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.vmInfo = _.cloneDeep(data.resolveData.vm);

                        // queryString to Integer Convert
                        this.resConvert();

                        // stepRq 생성 (필터 적용 되지않은 Rq 생성 -> 오는편 페이지로 Rq 넘겼을 때 필터적용 되어있지 않아야함)
                        const modelData: any = _.cloneDeep(this.resolveData);
                        modelData.stepRq = _.cloneDeep(this.resolveData.rq);

                        console.info('[스토어에 airtel-list-rq-info 저장 시작]');
                        this.modelInit('airtel-list-rq-info', modelData, 'airtelSearchResultGoPage');

                        console.info('[2. 헤더 초기화 시작]');
                        this.pageInit(this.resolveData);

                        this.flightSearhRQ = _.cloneDeep(this.resolveData.rq);

                        // 필터 적용유무
                        if (!_.isEmpty(this.resolveData.stepRq)) {
                            // 적용
                            this.resConvert();
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
    }

    /**
     * 페이지 초기화
     * 2. 헤더 초기화
     * @param $resolveData
     */
    async pageInit($resolveData) {
        const momentRange = extendMoment(moment);
        let headerTitle = '';
        let headerTime = '';
        // ---------[헤더 초기화]
        // 왕복
        if ($resolveData.rq.condition.tripTypeCode == 'RT') {
            headerTitle = `${$resolveData.rq.condition.itineraries[0].originCityCodeIata}-${$resolveData.rq.condition.itineraries[0].destinationCityCodeIata} 가는편 선택`;
            const originDatetime = $resolveData.rq.condition.itineraries[0].departureDate;
            const destDateTime = $resolveData.rq.condition.itineraries[1].departureDate;
            const range = momentRange.range(originDatetime, destDateTime);
            const howMany = $resolveData.rq.condition.adultCount + $resolveData.rq.condition.childCount + $resolveData.rq.condition.infantCount;
            headerTime = `${this.datePipe.transform(originDatetime, 'MM.dd')}-${this.datePipe.transform(destDateTime, 'MM-dd')}(${range.diff('days') + 1}일), ${howMany} 명, ${$resolveData.vm.travelerStore.cabinClassNm}`;
        }

        this.headerInit('flight-departure', headerTitle, headerTime);
        // ---------[헤더 초기화]
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
                    console.info('[API 호출 | 항공편 리스트(가는편) >]', res['result']);
                    this.transactionSetId = res['transactionSetId'];
                    this.resultList = _.cloneDeep(res);

                    console.info('[스토어에 flight-list-rs 저장]');
                    this.modelInit('airtel-list-rs', this.resultList);

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
    }

    /**
   * 더보기
   */
    async flightListIncrease() {
        // 리스트 총 갯수 < 리미트 시작 값
        if (!this.resultList && (this.resultList.result.totalFlightCount < this.flightSearhRQ.condition.limits[0] + 10)) {
            return false;
        }

        const flightsList: any = _.cloneDeep(this.resultList.result.flights);

        this.flightSearhRQ.condition.limits[0] += 10;
        this.flightSearhRQ.condition.limits[1] += 10;
        console.info('[limits >]', this.flightSearhRQ.condition.limits);

        // 재검색

        this.resultList.result.flights = [...flightsList, ...this.resultList.result.flights];
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
        this.store.dispatch(upsertAirtelSearchResult({
            airtelSearchResult: _.cloneDeep($obj)
        }));
    }

    /**
     * 항공 일정으로 이동
     */
    goToResultPage() {

    }

    resConvert() {
        console.info('[queryString to Integer Convert airtel-go-page 시작]');

        this.resolveData.rq.condition.adultCount = Number(this.resolveData.rq.condition.adultCount);
        this.resolveData.rq.condition.childCount = Number(this.resolveData.rq.condition.childCount);
        this.resolveData.rq.condition.infantCount = Number(this.resolveData.rq.condition.infantCount);
        this.resolveData.rq.condition.dynamicSearchYn = String(true) === this.resolveData.rq.condition.dynamicSearchYn ? true : false;

        // 직항
        if (_.has(this.resolveData.rq.condition, 'filter.stops')) {
            this.resolveData.rq.condition.filter.stops[0].viaCount = Number(this.resolveData.rq.condition.filter.stops[0].viaCount);
        }

        // 가격대
        if (_.has(this.resolveData.rq.condition, 'filter.amount')) {
            this.resolveData.rq.condition.filter.amount.lowestAmount = Number(this.resolveData.rq.condition.filter.amount.lowestAmount);
            this.resolveData.rq.condition.filter.amount.highestAmount = Number(this.resolveData.rq.condition.filter.amount.highestAmount);
        }

        // 소요시간
        if (_.has(this.resolveData.rq.condition, 'filter.time.duration')) {
            this.resolveData.rq.condition.filter.time.duration.maxMinutes = Number(this.resolveData.rq.condition.filter.time.duration.maxMinutes);
            this.resolveData.rq.condition.filter.time.duration.minMinutes = Number(this.resolveData.rq.condition.filter.time.duration.minMinutes);
        }

        // 경유지 체류시간
        if (_.has(this.resolveData.rq.condition, 'filter.time.ground')) {
            this.resolveData.rq.condition.filter.time.ground.maxMinutes = Number(this.resolveData.rq.condition.filter.time.ground.maxMinutes);
            this.resolveData.rq.condition.filter.time.ground.minMinutes = Number(this.resolveData.rq.condition.filter.time.ground.minMinutes);
        }

        // 페이징 값
        const limits = _
            .chain(this.resolveData)
            .get('rq.condition.limits')
            .value()
            .map((o) => {
                return Number(o);
            });
        this.resolveData.rq.condition.limits = limits;

        console.info('[queryString to Integer Convert 끝]');
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

    onChangeBtnClick($ctx) {
        console.info('[변경 버튼 클릭]');

        $ctx.bsModalChangeRef = $ctx.bsModalService.show(AirtelModalResearchComponent, { ...this.configInfo });

        this.subscriptionList.push(
            $ctx.bsModalService.onHide
                .pipe(takeWhile(() => $ctx.rxAlive))
                .subscribe(
                    () => {
                        const path = $ctx.bsModalChangeRef.content.naviPath;
                        if (!_.isEmpty(path)) {
                            $ctx.router.navigate([path], { relativeTo: this.route });
                        }
                    }
                )
        );
    }

    async onScroll() {
        console.info('[무한스크롤 이벤트]');
        await this.flightListIncrease();
    }

    /**
     * 항공편(가는편) 선택
     * @param flight
     */
    onSchedule(flight: any) {
        console.info('[항공편 선택 | 가는편]', flight);

        // transactionSetId 추가(검색-예약 트랜잭션을 묶어주는값)
        this.flightStepRQ.transactionSetId = this.transactionSetId;

        // 필터에 선택한 여정의 itineraryIndex 추가
        const itineraryIndex: number[] = [flight.itinerary.itineraryIndex];

        if (_.has(this.flightStepRQ, 'condition.filter')) {
            this.flightStepRQ.condition.filter.itineraryIndexes = itineraryIndex;
        } else {
            const addItem: any = {
                'itineraryIndexes': itineraryIndex
            };
            this.flightStepRQ.condition.filter = addItem;
        }

        // 페이지 ID
        this.flightStepRQ.pageId = 'airtelSearchResultGoPage';

        console.info('[flightStepRQ >>]', this.flightStepRQ);

        this.goToResultPage();
    }
}
