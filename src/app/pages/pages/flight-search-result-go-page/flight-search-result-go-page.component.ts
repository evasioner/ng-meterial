import { Component, OnInit, Inject, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { take, debounceTime, distinctUntilChanged, switchMap, finalize, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { upsertFlightSearchResult, clearFlightSearchResults } from '@/app/store/flight-common/flight-search-result/flight-search-result.actions';

import * as FlightMainSearchSelector from '@store/flight-common/flight-search-result/flight-search-result.selectors';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';

import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiFlightService } from '@/app/api/flight/api-flight.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '@/app/common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { FlightModalScheduleComponent } from '@/app/common-source/modal-components/flight-modal-schedule/flight-modal-schedule.component';
import { FlightModalPaymentMethodComponent } from '@/app/common-source/modal-components/flight-modal-payment-method/flight-modal-payment-method.component';

@Component({
    selector: 'app-flight-search-result-go-page',
    templateUrl: './flight-search-result-go-page.component.html',
    styleUrls: ['./flight-search-result-go-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlightSearchResultGoPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    resolveData: any;                         // route 통해 데이터 전달받은 데이터
    vmInfo: any;                              // 항공 메인 vm 데이터(for 재검색)
    transactionSetId: any;                    // transactionSetId(검색결과RS 트랜잭션 ID. 정렬, 필터시 빠른검색에 사용)

    flightStepRQ: any;                        // 항공Step API RQ(다음 페이지에서 사용되는 Request. 정렬 및 필터값 적용 X)

    loadingBool: Boolean = false;             // 화면 로딩 제어변수

    researchBool: Boolean = false;         // 재검색 컴포넌트 제어변수(true/false)

    title: any = '';

    // modal 호출시 넘겨주는 클래스 값
    configInfo = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    private subscriptionList: Subscription[];
    private flightListSubject$: Subject<any>;
    private selectedItem: any;

    public apiLoadingBool: boolean;
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
        private apiflightSvc: ApiFlightService,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
        private countdownTimerService: CountdownTimerService,
        private location: Location,
        private alertService: ApiAlertService,
        private storageS: StorageService,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.storeClear();
        this.flightListSubject$ = new Subject<any>();
        this.flightSearch();
        this.routeInit();
        this.subscribeInit();
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';

        this.headerInit();
        this.timerInit();
    }

    ngOnDestroy() {
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private storeClear() {
        console.log('go 왜 너는 효과가 없냐?');
        this.store.dispatch(clearFlightSearchResults());
    }


    /**
    * 모든 bsModalService 닫기
    */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * 항공 검색
     * 3. api 호출
     */
    private flightSearch() {
        this.subscriptionList = [
            this.flightListSubject$
                .pipe(
                    map(req => req),
                    debounceTime(300),
                    distinctUntilChanged(
                        (before: any, now: any) => {
                            console.info('[API 호출 | 항공편 리스트(가는편) >]', before, now);
                            return _.isEqual(before, now);
                        }
                    ),
                    switchMap(
                        req => {
                            this.apiLoadingBool = false;
                            this.errorFlag = false;
                            this.loadingBar.start();
                            this.resolveData.rq = _.cloneDeep(req);
                            const modelData: any = _.cloneDeep(this.resolveData);

                            // 스토어에 modelData 저장
                            console.info('[스토어에 flight-list-rq-info 저장 시작]');
                            this.modelInit('flight-list-rq-info', modelData, 'flightSearchResultGoPage');
                            console.log(req, 'req');


                            return this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY(this.resolveData.rq)
                                .pipe(
                                    finalize(() => {
                                        console.log('POST_FLIGHT_LIST_ITINERARY completed.', this.resolveData);

                                        this.loadingBool = true;
                                        this.apiLoadingBool = true;
                                        this.loadingBar.complete();
                                    })
                                );
                        }
                    )
                )
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.transactionSetId = resp.transactionSetId;

                            console.info('[스토어에 flight-list-rs 저장]');
                            this.resolveData.rs = _.cloneDeep(resp);
                            this.modelInit('flight-list-rs', _.cloneDeep(resp), 'flightSearchResultGoPage');


                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.errorFlag = true;
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        ];

        console.info('[3. API 호출 끝]');
    }

    private routeInit() {
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.vmInfo = _.cloneDeep(data.resolveData.vm);
                        this.resConvert(this.resolveData.rq);
                        this.flightListSubject$.next(_.cloneDeep(this.resolveData.rq));

                        this.storageS.makeRecentData(
                            'local',
                            { ...this.resolveData, ...{ alignUpdate: undefined, detailUpdate: undefined } },
                            'flight'
                        );
                    }
                )
        );
    }

    /**
    * subscribeInit
    * 구독 사항 모음
    */
    private subscribeInit() {
        this.subscriptionList.push(
            this.store.select(
                FlightMainSearchSelector.getSelectId(['flight-selected-item'])
            )
                .subscribe(
                    (resp: any) => {
                        if (resp && this.resolveData.rs) {
                            console.info('[flight-search-result-go > flight-selected-item subscribe]', resp);
                            this.selectedItem = _.cloneDeep(resp.option);
                            console.log(this.selectedItem, 'this.selectedItem');
                            console.log(this.resolveData, 'this.resolveData');

                            this.onSchedule();
                        }
                    },
                    (error: any) => {
                        console.info('[flight-search-result-go > flight-selected-item subscribe error]', error);
                    }
                )
        );
    }

    /**
     * 모델 초기화 & 스토어 업데이트
     * @param id
     * @param option
     */
    modelInit(id: string, option: any, pageId: string = '') {
        const storeModel = {
            id: id,
            option: option,
            pageId: pageId
        };
        this.upsertOne(storeModel);
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
                    status => {
                        if (status === 'END') {
                            console.info('[status]', status);
                            console.info('[timerValue]', this.countdownTimerService.timerValue);
                            this.timerAlert();
                        }
                    }
                )
        );
    }

    // 헤더 초기화
    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_FLIGHT
        };
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

    goToResultPage() {
        const initialState: any = {
            rq: this.flightStepRQ,
            vm: this.vmInfo,
            rs: this.resolveData.rs,
            item: this.selectedItem
        };

        const bsModalRef: BsModalRef = this.bsModalService.show(FlightModalScheduleComponent, { initialState, ...this.configInfo });
        this.subscriptionList.push(
            bsModalRef.content.onClose
                .subscribe(
                    (flag: boolean) => {
                        console.log('[flight-search-result-go > flight-modal-schedule] ', bsModalRef.content.dataModel.returnData);

                        // 페이지 이동 시 모달용 store는 초기화 꼭 해줄것
                        if (flag) {
                            if (!bsModalRef.content.dataModel.returnData.complete) {
                                const newPath = (bsModalRef.content.dataModel.returnData.path + qs.stringify(bsModalRef.content.dataModel.returnData.rqInfo));
                                this.router.navigate([newPath], { relativeTo: this.route });
                            } else {
                                initialState.promotionRq = this.promotionRqCreate(this.selectedItem);
                                initialState.cabinClassTxt = this.vmInfo.travelerStore.cabinClassTxt;

                                console.log('flight-search-result-com > initialState promotionRq >>', initialState);
                                const payModalRef: BsModalRef = this.bsModalService.show(FlightModalPaymentMethodComponent, { initialState, ...this.configInfo });
                                this.subscriptionList.push(
                                    payModalRef.content.onClose
                                        .subscribe(
                                            () => {
                                                console.log('[flight-search-result-come > flight-modal-payment] ');
                                                this.closeAllModals();
                                            }
                                        )
                                );
                            }
                        }
                    }
                )
        );
    }

    promotionRqCreate(flights: any): any {
        const flightObj = _.cloneDeep(flights);

        // Promotion RQ에 groundMinutes는 필요없으니 삭제처리...
        _.forEach(flightObj.itineraries, item => {
            _.forEach(item.segments, item2 => {
                delete item2.groundMinutes;
            });
        });

        console.log('flightObj >', flightObj);

        const promotionRq: any = {
            transactionSetId: this.transactionSetId,
            currency: 'KRW',
            language: 'KO',
            stationTypeCode: environment.STATION_CODE,
            condition: {
                tripTypeCode: flightObj.tripTypeCode,
                fare: flightObj.price.fares[0],
                itineraries: flightObj.itineraries
            }
        };

        return promotionRq;
    }

    onSchedule() {
        console.info('[항공편 선택 | 가는편]', this.selectedItem);

        // transactionSetId 추가(검색-예약 트랜잭션을 묶어주는값)
        this.flightStepRQ = this.resolveData.rq;
        this.flightStepRQ.transactionSetId = this.transactionSetId;
        this.flightStepRQ.condition.limits = [0, 10];
        _.omit(this.flightStepRQ, 'condition.filter');

        if (!_.has(this.flightStepRQ.condition.filter, 'itineraryIndexes')) {
            this.flightStepRQ.condition.filter = {
                itineraryIndexes: [Number(this.selectedItem.itinerary.itineraryIndex)]
            };
        }

        console.info('[flight-search-result-go flightStepRQ >>]', this.flightStepRQ);
        this.goToResultPage();
    }

    /**
    * 스크롤 이동
    * @param id
    */
    private moveScrollTo(id: string) {
        const doc = document.documentElement;
        const targetOffset = document.getElementById(id).getBoundingClientRect();
        const windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        const top = targetOffset.top + windowScrollTop - 54;
        window.scrollTo(0, top);
    }

    public onSearchOutEvt(data: any) {
        // 재 검색(필터 적용)
        this.location.replaceState(`/flight-search-result-go/${encodeURIComponent(qs.stringify(data))}`);
        this.flightListSubject$.next(_.cloneDeep(data.rq));
    }

    /**
   * hotel-search-form Output Evt
   * 재검색 모달창 오픈
   * @param data
   */
    public openResearchEvt(data: any) {
        this.researchBool = true;
    }

    public goPageEvt(data: any) {
        this.moveScrollTo('contents');
        this.flightListSubject$.next(_.cloneDeep(data));
    }

    public closeResearchEvt(data: any) {
        this.researchBool = false;
    }
}
