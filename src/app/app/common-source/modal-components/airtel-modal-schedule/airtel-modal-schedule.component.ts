import { Component, OnInit, Input, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertFlightSessionStorage } from 'src/app/store/flight-common/flight-session-storage/flight-session-storage.actions';
import { upsertFlightSearchResult } from 'src/app/store/flight-common/flight-search-result/flight-search-result.actions';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { ApiFlightService } from 'src/app/api/flight/api-flight.service';
import { ApiAlertService } from '../../services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../enums/header-types.enum';

import { AirtelModalStepPageComponent } from '../airtel-modal-step-page/airtel-modal-step-page.component';
import { AirtelModalPaymentComponent } from 'src/app/pages/airtel-search-result-come-page/modal-components/airtel-modal-payment/airtel-modal-payment.component';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-airtel-modal-schedule',
    templateUrl: './airtel-modal-schedule.component.html',
    styleUrls: ['./airtel-modal-schedule.component.scss']
})
export class AirtelModalScheduleComponent extends BaseChildComponent implements OnInit, OnDestroy {
    /**
     * 공통 > 개인정보처리방침
     * 팝업(예정)
     * html 로 관리 or 직접 수정관리
     *
     */
    @Input() rq: any;
    @Input() vm: any;

    headerType: any;                        // 헤더 타입
    headerConfig: any;                      // 헤더 Config

    storeModel: any;                     // 항공 스토어 모델

    resultList: any;                       // 항공일정 리스트
    flightSelectedRQ: any;                 // 항공일정 리스트 API RQ
    transactionSetId: any;                 // transactionSetId

    goDetailShow: Boolean = false;
    comeDetailShow: Boolean = false;
    priceShow: Boolean = true;
    isPay: Boolean = false;

    pageId: any;
    loadingBool: Boolean;
    naviPath: any;                          // 네비게이션 경로

    bsModalPaymentRef: BsModalRef;

    rxAlive: any = true;

    configInfo = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<any>,
        private apiflightSvc: ApiFlightService,
        public bsModalRef: BsModalRef,
        private bsModalService: BsModalService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit() {
        console.info('[ngOnInit | 예약 정보 확인(항공일정)]');
        super.ngOnInit();

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        console.info('[1. 데이터 전달 받기]', this.rq);
        this.flightSelectedRQ = _.cloneDeep(this.rq);
        this.pageId = this.rq.pageId;

        console.info('[2. 헤더 초기화 시작]');
        this.pageInit();

        this.pageScheduleInit(this.flightSelectedRQ);           // 페이지 초기화
        this.flightSearch(this.flightSelectedRQ);               // 항공일정 검색
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }


    modalClose() {
        this.bsModalRef.hide();
    }

    /**
     * 페이지 초기화
     * 2. 헤더 초기화
     */
    async pageInit() {
        // ---------[헤더 초기화]
        const headerTitle = `항공 일정`;
        const headerClass = `modal-header`;

        this.headerInit(headerTitle, headerClass);
        // ---------[헤더 초기화]
        console.info('[2. 헤더 초기화 끝]');
    }

    /**
     * 헤더 초기화
     */
    headerInit($headerTitle, $headerClass) {
        this.headerType = HeaderTypes.MODAL;
        this.headerConfig = {
            step: {
                title: $headerTitle,
                class: $headerClass
            }
        };
    }

    /**
     * 모델 초기화 & 스토어 업데이트
     * @param id
     * @param option
     */
    modelInit(id: string, option: any, isSession?: any) {
        this.storeModel = {
            id: id,
            option: option
        };
        if (isSession) {
            this.upsertOneSession(this.storeModel);
        } else {
            this.upsertOne(this.storeModel);
        }
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
     * 세션스토리지에 저장되는 스토어에 값 수정 및 저장
     * @param $obj
     */
    upsertOneSession($obj) {
        this.store.dispatch(upsertFlightSessionStorage({
            flightSessionStorage: _.cloneDeep($obj)
        }));
    }

    /**
     * 항공일정 검색
     * @param $request 항공 리스트 RQ
     */
    async flightSearch($request) {
        // ---------[api 호출 | 항공편 리스트(가는편)]
        await this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY($request)
            .toPromise()
            .then((res: any) => {
                console.info('[항공일정 리스트 > res]', res);
                if (res.succeedYn) {
                    this.resultList = _.cloneDeep(res['result']);    // 항공 검색결과(RS)
                    this.transactionSetId = res['transactionSetId'];

                    this.loadingBool = true;

                    console.info('[스토어에 flight-list-rs 저장]');
                    this.modelInit('flight-list-rs', res);
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err: any) => {
                this.alertService.showApiAlert(err);
            });
    }

    promotionRqCreate(flight: any) {
        const flightObj = _.cloneDeep(flight);

        // Promotion RQ에 groundMinutes는 필요없으니 삭제처리...
        _.forEach(flightObj.itineraries, item => {
            _.forEach(item.segments, item2 => {
                delete item2.groundMinutes;
            });
        });

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

    /**
     * RS의 flight를 -> fareRule RQ flight 스키마에 맞춰서 수정(RS의 flight를 RQ의 flight에서 그대로 사용안함)
     * @param flight 선택한 여정들의 RS ( result.selected.flight )
     */
    fareRuleRqCreate(flight: any) {
        const flightObj = _.cloneDeep(flight);
        console.info('[flightObj >]', flightObj);

        const passengerFares: Array<any> = [];
        const itineraries: Array<any> = [];

        _.forEach(flightObj.price.fares[0].passengerFares, (val, idx) => {
            const passengerFare: any = {
                ageTypeCode: val.ageTypeCode,
                paxCount: val.paxCount,
                fareAmount: val.fareAmount,
                taxAmount: val.taxAmount,
                amountSum: val.amountSum,
                itineraries: []
            };
            passengerFares.push(passengerFare);

            _.forEach(val.itineraries, (val2, idx2) => {
                const itinerarie: any = {
                    itineraryNo: val2.itineraryNo,
                    gdsCompCode: val2.gdsCompCode,
                    gdsOfficeId: val2.gdsOfficeId,
                    promotionSeq: _.toNumber(val2.promotionSeq),
                    segments: []
                };
                // null일경우 삭제(not required)
                if (_.isEmpty(itinerarie.promotionSeq)) {
                    delete itinerarie.promotionSeq;
                }

                passengerFares[idx].itineraries.push(itinerarie);

                _.forEach(val2.segments, val3 => {
                    const segment: any = {
                        segmentNo: val3.segmentNo,
                        fareTypeCode: val3.fareTypeCode,
                        cabinClassCode: val3.cabinClassCode,
                        bookingClassCode: val3.bookingClassCode,
                        fareBasisCode: val3.fareBasisCode,
                        freeBaggage: val3.freeBaggage
                    };
                    passengerFares[idx].itineraries[idx2].segments.push(segment);
                });
            });

        });

        _.forEach(flightObj.itineraries, (val, idx) => {
            const itinerarie: any = {
                itineraryNo: val.itineraryNo,
                segments: []
            };
            itineraries.push(itinerarie);

            _.forEach(val.segments, val2 => {
                const segment: any = {
                    segmentNo: val2.segmentNo,
                    origin: {
                        airportCode: val2.origin.airportCode,
                        departureDate: val2.origin.departureDate,
                        departureTime: val2.origin.departureTime
                    },
                    destination: {
                        airportCode: val2.destination.airportCode,
                        arrivalDate: val2.destination.arrivalDate,
                        arrivalTime: val2.destination.arrivalTime
                    },
                    marketing: {
                        airlineCode: val2.marketing.airlineCode,
                        flightNo: val2.marketing.flightNo
                    }
                };
                itineraries[idx].segments.push(segment);
            });
        });

        const fareRuleRq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.transactionSetId,
            condition: {
                tripTypeCode: flightObj.tripTypeCode,
                flight: {
                    flightIndex: flightObj.flightIndex,
                    airlineCode: flightObj.airlineCode,
                    price: {
                        priceIndex: flightObj.price.priceIndex,
                        fare: {
                            fareIndex: flightObj.price.fares[0].fareIndex,
                            fareAmountSum: flightObj.price.fares[0].fareAmountSum,
                            taxAmountSum: flightObj.price.fares[0].taxAmountSum,
                            tasfAmountSum: flightObj.price.fares[0].tasfAmountSum,
                            amountSum: flightObj.price.fares[0].amountSum,
                            brandedCode: flightObj.price.fares[0].brandedCode,
                        }
                    },
                }
            }
        };

        // null일경우 삭제(not required)
        if (_.isEmpty(fareRuleRq.condition.flight.price.fare.brandedCode)) {
            delete fareRuleRq.condition.flight.price.fare.brandedCode;
        }

        if (!_.isEmpty(flightObj.allianceCode)) {
            fareRuleRq.condition.flight.allianceCode = flightObj.allianceCode;
        }

        fareRuleRq.condition.flight.price.fare.passengerFares = passengerFares;
        fareRuleRq.condition.flight.itineraries = itineraries;

        return fareRuleRq;
    }

    /**
     * 스케쥴 초기화 셋팅
     * @param $request
     */
    pageScheduleInit($request) {

        switch ($request.pageId) {
            case 'airtelSearchResultGoPage':
                this.onGoDetailShow();
                break;
            case 'airtelSearchResultComePage':
                this.onComeDetailShow();
                break;
            default:
                break;
        }

        //(최초 pageScheduleInit에서 사용)
        if (_.has($request, 'pageId')) {
            delete $request.pageId;
            console.log('[$request >]', $request);
        }
    }
    onGoDetailShow() {
        this.goDetailShow = !this.goDetailShow;
    }
    onComeDetailShow() {
        this.comeDetailShow = !this.comeDetailShow;
    }
    onPirceShow() {
        this.priceShow = !this.priceShow;
        console.log(this.priceShow);
    }

    /**
     * 예약 계속 or 결제 진행
     */
    onReserve() {
        const rqInfo = {
            rq: this.flightSelectedRQ
        };
        console.info('[rqInfo >>]', rqInfo);

        let path: string = '';        // 경로

        //오는편 항공조회
        path = '/airtel-search-result-come/';
        if (rqInfo.rq.condition.itineraries.length === rqInfo.rq.condition.filter.itineraryIndexes.length) {
            this.isPay = true;
        }

        // 여정선택 완료
        if (this.isPay) {
            const initialState: any = {
                promotionRq: this.promotionRqCreate(this.resultList.selected.flight)
            };

            console.log('initialState promotionRq >>', initialState);

            // 결제 수단 선택모달
            this.bsModalPaymentRef = this.bsModalService.show(AirtelModalPaymentComponent, { initialState, ...this.configInfo });
            this.subscriptionList.push(
                // 모달 닫힘
                this.bsModalService.onHide
                    .pipe(takeWhile(() => this.rxAlive))
                    .subscribe(
                        () => {
                            const isClose = this.bsModalPaymentRef.content.isClose; // 예약하기 클릭(true) 여부( 닫기버튼으로 닫을경우 false)
                            console.log('isClose> ', isClose);

                            if (isClose) {
                                const fareRuleRq = this.fareRuleRqCreate(this.resultList.selected.flight);
                                console.info('[fareRuleRq>]', fareRuleRq);
                                rqInfo['fareRuleRq'] = fareRuleRq;

                                path = '/flight-booking-information/';

                                // session storage 에 항공 예약자 정보 RQ 저장( for 재검색 )
                                console.info('[스토어에 flight-booking-information RQ 저장 시작]');
                                this.modelInit('flight-booking-information', rqInfo, true);

                                // 모달 닫기
                                this.modalClose();

                                // 페이지 이동
                                this.router.navigate([path], { relativeTo: this.route });
                            }
                        }
                    )
            );
            //묶음할인(오는편) 진행
        } else {
            rqInfo['vm'] = this.vm;

            const incodingOpt = {
                encodeValuesOnly: true
            };

            const queryString = qs.stringify(rqInfo, incodingOpt);
            path += queryString;

            const initialState: any = {
                path: path,
                step: 'flight-come'
            };

            const bsModalAirtelModalStep = this.bsModalService.show(AirtelModalStepPageComponent, { initialState, ...this.configInfo });

            this.subscriptionList.push(
                this.bsModalService.onHide
                    .pipe(takeWhile(() => this.rxAlive))
                    .subscribe(
                        () => {
                            const isClose = bsModalAirtelModalStep.content.isClose;
                            console.log(isClose);
                            const ctx = bsModalAirtelModalStep.content.ctx;
                            ctx.stopStepMove();
                            if (isClose) {
                                console.log('step 끝');
                                this.modalClose();
                            }
                        }
                    )
            );
        }
    }
}
