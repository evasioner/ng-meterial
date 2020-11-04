import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertFlightSearchResult } from 'src/app/store/flight-common/flight-search-result/flight-search-result.actions';

import { TranslateService } from '@ngx-translate/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

import { ApiFlightService } from 'src/app/api/flight/api-flight.service';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { AirtelModalScheduleComponent } from 'src/app/common-source/modal-components/airtel-modal-schedule/airtel-modal-schedule.component';
import { FlightModalDetailFilterComponent } from 'src/app/common-source/modal-components/flight-modal-detail-filter/flight-modal-detail-filter.component';
import { FlightModalAlignFilterComponent } from 'src/app/common-source/modal-components/flight-modal-align-filter/flight-modal-align-filter.component';
import { FlightModalPriceAlarmComponent } from 'src/app/common-source/modal-components/flight-modal-price-alarm/flight-modal-price-alarm.component';
import { AirtelModalResearchComponent } from 'src/app/common-source/modal-components/airtel-modal-research/airtel-modal-research.component';

@Component({
    selector: 'app-airtel-search-result-come-page',
    templateUrl: './airtel-search-result-come-page.component.html',
    styleUrls: ['./airtel-search-result-come-page.component.scss']
})
export class AirtelSearchResultComePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;        // 헤더 타입
    headerConfig: any;      // 헤더 Config

    storeModel: object;     // 항공 스토어 모델
    flightStepRQ: any;      // 항공Step API RQ
    flightSearhRQ: any;     // 항공검색 API RQ
    resultList: any;        // 항공조회 결과 리스트
    vmInfo: any;

    resolveData: any;

    loadingBool: Boolean = true;
    detailUpdate: Boolean;
    alignUpdate: Boolean;

    bsModalFilterRef: any;
    bsModalAlignRef: any;
    bsModalChangeRef: any;
    bsModalAlarmRef: any;

    rxAlive: any = true;

    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    infiniteScrollConfig: any = {
        distance: 1,
        throttle: 150
    };
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private router: Router,
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

                        // stepRq 생성

                        const modelData: any = _.cloneDeep(this.resolveData);
                        modelData.stepRq = _.cloneDeep(this.resolveData.rq);

                        // 스토어에 modelData 저장
                        console.info('[스토어에 airtel-list-rq-info 저장 시작]');
                        this.modelInit('airtel-list-rq-info', modelData, 'airtelSearchResultComePage');

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
        const headerTitle = `${$resolveData.rq.condition.itineraries[0].originCityCodeIata}-${$resolveData.rq.condition.itineraries[0].destinationCityCodeIata} 오는편 선택`;
        const originDatetime = $resolveData.rq.condition.itineraries[0].departureDate;
        const destDateTime = $resolveData.rq.condition.itineraries[1].departureDate;
        const range = momentRange.range(originDatetime, destDateTime);
        const howMany = $resolveData.rq.condition.adultCount + $resolveData.rq.condition.childCount + $resolveData.rq.condition.infantCount;
        const headerTime = `${this.datePipe.transform(originDatetime, 'MM.dd')}-${this.datePipe.transform(destDateTime, 'MM-dd')}(${range.diff('days') + 1}일), ${howMany} 명, ${$resolveData.vm.travelerStore.cabinClassNm}`;

        this.headerInit('flight-destination', headerTitle, headerTime);
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
                backFun: this.onBackBtnClick,
            },
            detail: $headerTime,
            ctx: this.ctx
        };
    }

    /**
     * 항공 검색
     * 3. api 호출
     * @param $resolveData 항공 검색 flightSearhRQ
     */
    async flightSearch($resolveData) {
        // ---------[api 호출 | 항공편 리스트(오는편)]
        // const bsModalLoadingRef = this.bsModalService.show(CommonLoadingModalComponent, { ...this.configInfo });

        await this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY($resolveData)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info('[ 항공편 리스트(오는편) > res.result]', res['result']);
                    this.resultList = _.cloneDeep(res);

                    console.info('[스토어에 flight-list-rs 저장]');
                    this.modelInit('flight-list-rs', this.resultList);

                    this.loadingBool = false;
                    this.loadingBar.complete();
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
        // bsModalLoadingRef.hide();
        console.info('[3. API 호출 끝]');
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
            rq: this.flightStepRQ
        };

        const bsModalRef = this.bsModalService.show(AirtelModalScheduleComponent, { initialState, ...this.configInfo });

        this.subscriptionList.push(
            this.bsModalService.onHide
                .pipe(take(1))
                .subscribe(
                    () => {
                        const path = bsModalRef.content.naviPath;
                        if (!_.isEmpty(path)) {
                            this.router.navigate([path], { relativeTo: this.route });
                        }
                    }
                )
        );
    }

    resConvert($Request: any) {
        console.info('[queryString to Integer Convert airtel-come-page 시작]');

        console.info('$Request', $Request);


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
                .chain($Request)
                .get('condition.filter.itineraryIndexes')
                .value()
                .map((o) => {
                    return Number(o);
                });
            $Request.condition.filter.itineraryIndexes = indexes;
        }

        // 페이징 값
        const limits = _
            .chain($Request)
            .get('condition.limits')
            .value()
            .map((o) => {
                return Number(o);
            });
        $Request.condition.limits = limits;

        console.info('[queryString to Integer Convert 끝]');
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

    onBackBtnClick($ctx) {
        const path = 'flight-main';
        $ctx.router.navigate([path]);
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
     * 항공편(오는편) 선택
     * @param flight
     */
    onSchedule(flight: any) {
        console.info('[항공편 선택 | 가는편]', flight);

        // 필터에 선택한 여정의 itineraryIndex 추가
        const itineraryIndex: number = flight.itinerary.itineraryIndex;
        if (this.flightStepRQ.condition.filter.itineraryIndexes.length > 1) {
            this.flightStepRQ.condition.filter.itineraryIndexes.pop();
        }
        this.flightStepRQ.condition.filter.itineraryIndexes.push(itineraryIndex);

        // 페이지 ID
        this.flightStepRQ.pageId = 'flightSearchResultComePage';

        console.info('[flightStepRQ >>]', this.flightStepRQ);

        this.goToResultPage();
    }
}
