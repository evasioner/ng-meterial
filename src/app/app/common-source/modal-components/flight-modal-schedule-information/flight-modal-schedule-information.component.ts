import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';


import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { CabinClass } from '../../enums/flight/cabin-class.enum';
import { TravelerTypeKr } from '../../enums/common/traveler-type.enum';

@Component({
    selector: 'app-flight-modal-schedule-information',
    templateUrl: './flight-modal-schedule-information.component.html',
    styleUrls: ['./flight-modal-schedule-information.component.scss']
})
export class FlightModalScheduleInformationComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private scheduleList: any;  // 항공일정 리스트

    rs: any;
    rq: any;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit() {
        super.ngOnInit();
        console.info('[ngOnInit | 가격 알림 설정]');
        if (this.isBrowser) {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.add('overflow-none');
        }

        this.viewModel = {
            selectedList: [],
            flightPirceText: '왕복 요금',
            flightPirceUserList: [],
            totalAmountSum: 0,
            flightTripType: ''
        };

        this.scheduleList = _.cloneDeep(this.rs);
        this.dataModel = {
            rq: _.cloneDeep(this.rq)
        };
        this.setViewModel();
    }

    ngOnDestroy() {
        if (this.isBrowser) {
            const bodyEl = document.getElementsByTagName('body')[0];
            bodyEl.classList.remove('overflow-none');
        }
    }

    private setViewModel() {
        if (_.has(this.scheduleList, 'selected')) {
            this.viewModel.selectedList = this.scheduleList.selected.detail.itineraries.map(
                (itineraryItem: any, itineraryIndex: number) => {
                    return this.makeFlightViewData(itineraryItem, itineraryIndex);
                }
            );

            this.makeBaggageViewData();
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

        switch (this.dataModel.rq.condition.tripTypeCode) {
            case 'OW':
                this.viewModel.flightPirceText = '편도 요금';
                newItineraryItem.wayText = '가는편';
                break;

            case 'RT':
                this.viewModel.flightPirceText = '왕복 요금';
                if ((this.viewModel.selectedList.length === 1)) {
                    newItineraryItem.wayText = '오는편';
                } else {
                    newItineraryItem.wayText = '가는편';
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

                        this.scheduleList.selected.detail.price.fare.passengerFares.map(
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

    public modalClose(event?: MouseEvent) {
        event && event.preventDefault();

        this.bsModalRef.hide();
    }

    public onDetailShow(event: MouseEvent, item: any) {
        event && event.preventDefault();

        item.detailFlag = !item.detailFlag;
    }
}
