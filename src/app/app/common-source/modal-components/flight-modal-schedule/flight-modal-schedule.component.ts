import { Component, OnInit, PLATFORM_ID, Inject, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { upsertFlightSessionStorage } from '@/app/store/flight-common/flight-session-storage/flight-session-storage.actions';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { ApiFlightService } from '@/app/api/flight/api-flight.service';
import { ApiAlertService } from '../../services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../enums/header-types.enum';
import { TravelerTypeKr } from '../../enums/common/traveler-type.enum';
import { FlightStore } from '../../enums/flight/flight-store.enum';
import { CabinClass } from '../../enums/flight/cabin-class.enum';
import { FlightCommon } from '../../enums/flight/flight-common.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { FlightModalPaymentComponent } from '../flight-modal-payment/flight-modal-payment.component';

@Component({
    selector: 'app-flight-modal-schedule',
    templateUrl: './flight-modal-schedule.component.html',
    styleUrls: ['./flight-modal-schedule.component.scss']
})
export class FlightModalScheduleComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() private rq: any;
    @Input() private vm: any;
    private dataModel: any;
    private subscriptionList: Subscription[];

    public headerType: any;                        // 헤더 타입
    public headerConfig: any;                      // 헤더 Config
    public viewModel: any;


    storeModel: any;                     // 항공 스토어 모델

    resultList: any;                       // 항공일정 리스트
    originResultList: any;
    flightSelectedRQ: any;                 // 항공일정 리스트 API RQ
    transactionSetId: any;                 // transactionSetId

    goDetailShow: Boolean = false;
    comeDetailShow: Boolean = false;
    multiDetailShow: Boolean[] = [];
    priceShow: Boolean = true;
    isPay: Boolean = false;

    passengerCountTxt: string;
    passengerDetailInfo = [];
    tmpPassengerCountTxt = [];
    pageId: any;
    loadingBool: Boolean = false;
    naviPath: any;                          // 네비게이션 경로

    bsModalPaymentRef: BsModalRef;

    rxAlive: any = true;

    configInfo = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalRef: BsModalRef,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<any>,
        private apiflightSvc: ApiFlightService,
        private bsModalSvc: BsModalService,
        private alertService: ApiAlertService
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit() {
        console.info('[ngOnInit | 예약 정보 확인(항공일정)]');
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        super.ngOnInit();

        this.dataModel = {
            rq: this.rq,
            vm: this.vm
        };
        this.dataModel.pageId = this.dataModel.rq.pageId;
        this.headerInit('항공 일정', 'modal-header');
        this.flightSearch();
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private initialize() {
        this.dataModel = {
            rq: {},
            vm: {}
        };
        this.viewModel = {
            selectedList: [],
            flightPirceText: '왕복 요금',
            flightPirceUserList: [],
            totalAmountSum: 0,
            flightTripType: ''
        };
    }

    /**
     * headerInit
     * 헤더 초기화
     */
    private headerInit($headerTitle, $headerClass) {
        this.headerType = HeaderTypes.MODAL;
        this.headerConfig = {
            step: {
                title: $headerTitle,
                class: $headerClass
            }
        };
    }

    /**
     * flightSearch
     * 항공일정 검색
     */
    private flightSearch() {
        this.dataModel.rq.pageId = undefined;
        this.subscriptionList = [
            this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY(this.dataModel.rq)
                .subscribe(
                    (res: any) => {
                        console.info('[항공일정 리스트 > res]', res);

                        if (res.succeedYn) {
                            this.dataModel.result = _.cloneDeep(res.result);    // 항공 검색결과(RS)
                            this.dataModel.transactionSetId = res.transactionSetId;
                            this.upsertOneSession({
                                id: FlightStore.STORE_FLIGHT_LIST_RS,
                                option: _.cloneDeep(res)
                            });
                            this.setViewModel();
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        ];
    }

    private setViewModel() {
        if (_.has(this.dataModel.result, 'selected')) {
            this.viewModel.selectedList = this.dataModel.result.selected.detail.itineraries.map(
                (itineraryItem: any, itineraryIndex: number) => {
                    return this.makeFlightViewData(itineraryItem, itineraryIndex);
                }
            );

            this.makeBaggageViewData();
            this.makePriceViewData();
        }

        this.viewModel.selectedList[this.viewModel.selectedList.length - 1].detailFlag = true;
    }

    /**
    * makeFlightViewData
    * 비행편 정보 만들기
    *
    * @param item 비행편 상세 정보 만들 원형
    */
    private makeFlightViewData(item: any, index: number): any {
        const endDestination = item.segments[item.segments.length - 1];
        const newItineraryItem: any = {
            detailFlag: false,
            originAirportNameLn: item.segments[0].origin.airportNameLn,
            originAirportCode: item.segments[0].origin.airportCode,
            originDate: item.segments[0].origin.departureDate,
            originTime: item.segments[0].origin.departureTime,
            destinationAirportNameLn: endDestination.destination.airportNameLn,
            destinationAirportCode: endDestination.destination.airportCode,
            destinationDate: endDestination.destination.arrivalDate,
            destinationTime: endDestination.destination.arrivalTime,
            totalDuration: item.totalDuration,
            segmentList: item.segments.map(
                (segItem: any, segIndex: number): any => {
                    const segNewItem: any = {
                        originAirportNameLn: segItem.origin.airportNameLn,
                        originAirportCode: segItem.origin.airportCode,
                        originDate: segItem.origin.departureDate,
                        originTime: segItem.origin.departureTime,
                        originCityNameLn: segItem.origin.cityNameLn,
                        originTerminal: segItem.origin.terminal,
                        airlineNameLn: segItem.marketing.airlineNameLn,
                        airlineCode: segItem.marketing.airlineCode,
                        flightNo: segItem.marketing.flightNo,
                        destinationAirportNameLn: segItem.destination.airportNameLn,
                        destinationAirportCode: segItem.destination.airportCode,
                        destinationDate: segItem.destination.arrivalDate,
                        destinationTime: segItem.destination.arrivalTime,
                        destinationCityNameLn: segItem.destination.cityNameLn,
                        destinationterminal: segItem.destination.terminal,
                        flyingMinutes: segItem.flyingMinutes,
                        groundMinutes: segItem.groundMinutes,
                        options: '',
                        operatingAirlineCode: segItem.operating?.airlineCode,
                        operatingAirlineNameLn: segItem.operating?.airlineNameLn,
                        operatingFlightNo: segItem.operating?.flightNo,
                        equipmentName: segItem.equipmentName,
                        cabinClassCode: segItem.cabinClassCode || 'Y',
                        freeBaggage: segItem.freeBaggage,
                        inFlightService: segItem.inFlightService || {}
                    };

                    if ((item.segments.length - 1) > segIndex) {
                        segNewItem.differentAirport = segItem.destination.airportCode !== item.segments[segIndex + 1].origin.airportCode;
                    }
                    return segNewItem;
                }
            )
        };

        switch (item.segments.length) {
            case 0:
            case 1:
                newItineraryItem.stops = '직항';
                newItineraryItem.stopsSimple = '직항';
                break;

            case 2:
                newItineraryItem.stops = `${item.segments.length - 1}회 경유`;
                newItineraryItem.stopsSimple = '경유';
                break;

            default:
                newItineraryItem.stops = `${item.segments.length - 1}회 경유`;
                newItineraryItem.stopsSimple = '경유';
                break;
        }

        this.viewModel.flightTripType = this.dataModel.rq.condition.tripTypeCode;
        switch (this.dataModel.rq.condition.tripTypeCode) {
            case 'OW':
                this.viewModel.flightPirceText = '편도 요금';
                newItineraryItem.wayText = '가는편';
                break;

            case 'RT':
                this.viewModel.flightPirceText = '왕복 요금';
                if (index === 0) {
                    newItineraryItem.wayText = '가는편';
                } else {
                    newItineraryItem.wayText = '오는편';
                }
                break;

            case 'MD':
                this.viewModel.flightPirceText = '다구간 요금';
                newItineraryItem.wayText = `${(index + 1)}구간`;
                break;
        }

        return newItineraryItem;
    }

    private makeBaggageViewData() {
        this.viewModel.selectedList.map(
            (itinaryItem: any) => {
                itinaryItem.segmentList.map(
                    (segItem: any) => {

                        this.dataModel.result.selected.detail.price.fare.passengerFares.map(
                            (passengerItem: any, passengerIndex: number) => {
                                if (passengerIndex === 0) {
                                    segItem.options = `${CabinClass[segItem.cabinClassCode]}/무료수하물/${TravelerTypeKr[passengerItem.ageTypeCode]} ${(segItem.freeBaggage || 0)}`;
                                } else {
                                    segItem.options += `/${TravelerTypeKr[passengerItem.ageTypeCode]} ${(segItem.freeBaggage || 0)}`;
                                }
                            }
                        );
                    }
                );
            }
        );
    }

    private makePriceViewData() {
        this.viewModel.flightPirceUserList = [
            { text: '', count: 0, amount: 0, fareAmount: 0, taxAmount: 0 },
            { text: '', count: 0, amount: 0, fareAmount: 0, taxAmount: 0 },
            { text: '', count: 0, amount: 0, fareAmount: 0, taxAmount: 0 }
        ];
        this.dataModel.result.selected.detail.price.fare.passengerFares.map(
            (item: any) => {
                this.viewModel.totalAmountSum += ((item.fareAmount + item.tasfAmount + item.taxAmount) * item.paxCount);

                switch (item.ageTypeCode) {
                    case 'ADT':
                        this.viewModel.flightPirceUserList[0].text = `${TravelerTypeKr[item.ageTypeCode]} 항공권`;
                        this.viewModel.flightPirceUserList[0].count = item.paxCount;
                        this.viewModel.flightPirceUserList[0].amount += (item.fareAmount + item.tasfAmount + item.taxAmount);
                        break;

                    case 'CHD':
                        this.viewModel.flightPirceUserList[1].text = `${TravelerTypeKr[item.ageTypeCode]} 항공권`;
                        this.viewModel.flightPirceUserList[1].count = item.paxCount;
                        this.viewModel.flightPirceUserList[1].amount += (item.fareAmount + item.tasfAmount + item.taxAmount);
                        break;

                    case 'INF':
                        this.viewModel.flightPirceUserList[2].text = `${TravelerTypeKr[item.ageTypeCode]} 항공권`;
                        this.viewModel.flightPirceUserList[2].count = item.paxCount;
                        this.viewModel.flightPirceUserList[2].amount += (item.fareAmount + item.tasfAmount + item.taxAmount);
                        break;
                }
            }
        );

        this.viewModel.flightPirceUserList = this.viewModel.flightPirceUserList.filter(
            (item: any) => item.count > 0
        );
    }

    private makeRequest(): void {
        let path = '';
        switch (this.viewModel.flightTripType) {
            case 'RT':
                path = FlightCommon.PAGE_SEARCH_RESULT_COME;
                break;

            case 'MD':
                path = FlightCommon.PAGE_SEARCH_RESULT_MULTI;
                break;
        }

        const rqInfo: any = { rq: this.dataModel.rq, vm: this.dataModel.vm };

        if (this.dataModel.rq.condition.itineraries.length === this.dataModel.rq.condition.filter.itineraryIndexes.length) {
            const initialState: any = {
                promotionRq: this.promotionRqCreate(this.dataModel.result.selected.flights),
                cabinClassTxt: this.vm.travelerStore.cabinClassTxt,
                rs: this.dataModel.result
            };

            console.log('initialState promotionRq >>', _.cloneDeep(initialState));

            // 결제 수단 선택모달
            this.bsModalPaymentRef = this.bsModalSvc.show(FlightModalPaymentComponent, { initialState, ...this.configInfo });
            // 모달 닫힘
            this.subscriptionList.push(
                this.bsModalSvc.onHide
                    .subscribe(
                        () => {
                            const isClose = this.bsModalPaymentRef.content.isClose; // 예약하기 클릭(true) 여부( 닫기버튼으로 닫을경우 false)
                            console.log('isClose> ', isClose);

                            if (isClose) {
                                const fareRuleRq = this.fareRuleRqCreate(this.dataModel.result.selected.flights);
                                console.info('[fareRuleRq>]', fareRuleRq);
                                rqInfo.fareRuleRq = fareRuleRq;

                                path = `${FlightCommon.PAGE_BOOKING_INFORMATION}/`;

                                // session storage 에 항공 예약자 정보 RQ 저장( for 재검색 )
                                console.info('[스토어에 flight-booking-information RQ 저장 시작]');
                                this.upsertOneSession(
                                    {
                                        id: FlightStore.STORE_FLIGHT_BOOKING_INFORMATION,
                                        option: _.cloneDeep(rqInfo)
                                    }
                                );

                                // 모달 닫기
                                this.modalClose();
                                this.router.navigate([path], { relativeTo: this.route });
                            }
                        }
                    )
            );
        } else {
            path += qs.stringify(rqInfo);
            this.router.navigate([path], { relativeTo: this.route });
        }

    }

    private promotionRqCreate(flights: any) {
        const flightArray = _.cloneDeep(flights);

        flightArray.map(
            (flightItem: any) => {
                flightItem.itineraries.map(
                    (itinItem: any) => {
                        itinItem.segments.map(
                            (segItem: any) => {
                                segItem.groundMinutes = undefined;
                                segItem.inFlightService = undefined;
                            }
                        );
                    }
                );
            }
        );

        return {
            transactionSetId: this.dataModel.transactionSetId,
            currency: 'KRW',
            language: 'KO',
            stationTypeCode: environment.STATION_CODE,
            condition: {
                tripTypeCode: this.viewModel.flightTripType,
                // fare: flightArray[0].price.fares[0],
                // itineraries: flightArray[0].itineraries
            }
        };
    }

    /**
     * RS의 flight를 -> fareRule RQ flight 스키마에 맞춰서 수정(RS의 flight를 RQ의 flight에서 그대로 사용안함)
     * @param flight 선택한 여정들의 RS ( result.selected.flight )
     */
    private fareRuleRqCreate(flights: any): any {
        console.log('다시 만들어 봅시다. ', flights);

        return flights.map(
            (item: any) => {

                console.log('이거는 로그가 언제 찍히냐? 짜증나 죽것네 : ', item);

                return {
                    stationTypeCode: environment.STATION_CODE,
                    currency: 'KRW',
                    language: 'KO',
                    transactionSetId: this.dataModel.transactionSetId,
                    condition: {
                        flight: {
                            airlineCode: item.airlineCode,
                            itineraries: item.itineraries.map(
                                (itineraryItem: any) => {
                                    return {
                                        itineraryNo: itineraryItem.itineraryNo,
                                        segments: itineraryItem.segments.map(
                                            (segItem: any) => {
                                                return {
                                                    segmentNo: segItem.segmentNo,
                                                    origin: {
                                                        airportCode: segItem.origin.airportCode,
                                                        departureDate: segItem.origin.departureDate,
                                                        departureTime: segItem.origin.departureTime
                                                    },
                                                    destination: {
                                                        airportCode: segItem.destination.airportCode,
                                                        arrivalDate: segItem.destination.arrivalDate,
                                                        arrivalTime: segItem.destination.arrivalTime
                                                    },
                                                    marketing: {
                                                        airlineCode: segItem.marketing.airlineCode,
                                                        flightNo: segItem.marketing.flightNo
                                                    }
                                                };
                                            }
                                        )
                                    };
                                }
                            ),
                            price: {
                                priceIndex: item.price.priceIndex,
                                fare: {
                                    amountSum: item.price.fares[0].amountSum,
                                    fareAmountSum: item.price.fares[0].fareAmountSum,
                                    fareIndex: item.price.fares[0].fareIndex,
                                    codedData: item.price.fares[0].codedData,
                                    passengerFares: item.price.fares[0].passengerFares.map(
                                        (passengerItem: any) => {
                                            return {
                                                ageTypeCode: passengerItem.ageTypeCode,
                                                paxCount: passengerItem.paxCount,
                                                fareAmount: passengerItem.fareAmount,
                                                taxAmount: passengerItem.taxAmount,
                                                amountSum: passengerItem.amountSum,
                                                paxTypeCode: passengerItem.paxTypeCode,
                                                productAmount: passengerItem.productAmount,
                                                tasfAmount: passengerItem.tasfAmount,
                                                codedData: passengerItem.codedData,
                                                itineraries: passengerItem.itineraries.map(
                                                    (itineraryItem: any) => {
                                                        return {
                                                            itineraryNo: itineraryItem.itineraryNo,
                                                            gdsCompCode: itineraryItem.gdsCompCode,
                                                            gdsOfficeId: itineraryItem.gdsOfficeId,
                                                            codedData: itineraryItem.codedData,
                                                            segments: itineraryItem.segments.map(
                                                                (segItem: any) => {
                                                                    return {
                                                                        codedData: segItem.codedData,
                                                                        segmentNo: segItem.segmentNo,
                                                                        fareTypeCode: segItem.fareTypeCode,
                                                                        cabinClassCode: segItem.cabinClassCode,
                                                                        bookingClassCode: segItem.bookingClassCode,
                                                                        fareBasisCode: segItem.fareBasisCode,
                                                                        freeBaggage: segItem.freeBaggage
                                                                    };
                                                                }
                                                            )
                                                        };
                                                    }
                                                )
                                            };
                                        }
                                    ),
                                    tasfAmountSum: item.price.fares[0].tasfAmountSum,
                                    taxAmountSum: item.price.fares[0].taxAmountSum
                                }
                            }
                        },
                        tripTypeCode: item.tripTypeCode
                    }
                };

            }
        );
    }


    /**
     * upsertOneSession
     * 세션스토리지에 저장되는 스토어에 값 수정 및 저장
     *
     * @param $data
     */
    private upsertOneSession(data: any) {
        this.store.dispatch(
            upsertFlightSessionStorage({ flightSessionStorage: data })
        );
    }

    public modalClose(event?: MouseEvent) {
        event && event.preventDefault();

        this.bsModalRef.hide();
    }

    public onDetailShow(event: MouseEvent, item: any) {
        event && event.preventDefault();

        item.detailFlag = !item.detailFlag;
    }

    public onPirceShow(event: MouseEvent) {
        event && event.preventDefault();

        this.priceShow = !this.priceShow;
    }

    public onReserve(event: MouseEvent) {
        event && event.preventDefault();

        this.makeRequest();
    }
}
