import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { clearAirtelModalCalendars } from '@/app/store/airtel-common/airtel-modal-calendar/airtel-modal-calendar.actions';
import { clearAirtelModalDestinations } from '@/app/store/airtel-common/airtel-modal-destination/airtel-modal-destination.actions';
import { clearAirtelModalTravelerOptions } from '@/app/store/airtel-common/airtel-modal-traveler-option/airtel-modal-traveler-option.actions';

import * as AirtelModalTravelerOptionSelector from '@/app/store/airtel-common/airtel-modal-traveler-option/airtel-modal-traveler-option.selectors';
import * as AirtelModalDestinationSelector from '@/app/store/airtel-common/airtel-modal-destination/airtel-modal-destination.selectors';
import * as AirtelModalCalendarSelector from '@/app/store/airtel-common/airtel-modal-calendar/airtel-modal-calendar.selectors';
import * as AirtelMainSearchSelector from '@/app/store/airtel-common/airtel-search-result/airtel-search-result.selectors';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';
import * as moment from 'moment';

import { environment } from '@/environments/environment';

import { StoreCategoryTypes } from '../../enums/store-category-types.enum';

import { AirtelModalTravelerOptionComponent } from '../airtel-modal-traveler-option/airtel-modal-traveler-option.component';
import { AirtelModalStepPageComponent } from '../airtel-modal-step-page/airtel-modal-step-page.component';
import { CommonModalCalendarComponent } from '../common-modal-calendar/common-modal-calendar.component';
import { ModalDestinationComponent } from '../modal-destination/modal-destination.component';
import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-airtel-modal-research',
    templateUrl: './airtel-modal-research.component.html',
    styleUrls: ['./airtel-modal-research.component.scss']
})
export class AirtelModalResearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    pCtx: any = this;
    mainForm: FormGroup;                    // 폼

    rxAlive: boolean = true;                // 구독 제어변수

    modalTravelerOption$: Observable<any>;  // 좌석등급, 인원 수
    modalOrigin$: Observable<any>;          // 목적지(출발)
    modalDestination$: Observable<any>;     // 목적지(도착)
    modalCalendar$: Observable<any>;        // 여행날짜
    searchMain$: Observable<any>;           // 묶음할인 메인

    loadingBool: Boolean = false;

    vm: any = {
        tripTypeCode: 'RT', // 항공편 종류( 항공+호텔 : RT, 추천일정 : RC) default : RT
        nonStop: false,     // 직항 여부
        addHotel: false,    // 숙박할 도시, 일정 다름 여부
        tripType: [
            {
                code: 'RT',
                name: '항공+호텔'
            },
            {
                code: 'RC',
                name: '추천일정'
            }
        ],
        trip: {},

        hotelCity: null,
        checkDate: null,
        checkInOutDate: null,

        // 좌석등급, 인원 수 ( 스토어 -> travelerStore)
        travelerStore: {
            cabinClassTxt: '일반석, 성인1',
            cabinClassCode: 'Y',
            adultCount: 1,
            childCount: 0,
            infantCount: 0
        }
    };

    tripTypeCodes: any = [
        // 항공 + 호텔
        {
            destination: [
                {
                    dateRange: '',
                    date: '',
                    origin: {
                        id: 'destination',
                        name: '서울/인천',
                        val: 'SEL'
                    },
                    dest: {
                        name: '',
                        val: ''
                    }
                },
                {
                    date: '',
                    origin: {
                        name: '',
                        val: ''
                    },
                    dest: {
                        name: '',
                        val: ''
                    }
                }
            ]
        },
        // 추천일정
    ];

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        private fb: FormBuilder,
        public bsModalRef: BsModalRef,
        private bsModalService: BsModalService
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit | 검색조건 변경]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.storeFlightCommonInit(); // store > flight-common 초기화

        this.vmInit();
        this.formInit(); //폼 초기화
        this.storeInit(); //스토어 초기화
        this.storeSubscribe(); //스토어 구독
    }

    ngOnDestroy() {
        this.rxAlive = false;

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');

        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    storeFlightCommonInit() {
        console.info('[0. store > airtel-common 초기화]');
        this.store.dispatch(clearAirtelModalCalendars());
        this.store.dispatch(clearAirtelModalDestinations());
        this.store.dispatch(clearAirtelModalTravelerOptions());
    }

    vmInit() {
        this.vm.trip = _.cloneDeep(this.tripTypeCodes[0]);  // 항공 + 호텔
        this.vm.checkDate = {};
        this.vm.hotelCity = {};
        this.searchMain$ = this.store.select(
            AirtelMainSearchSelector.getSelectId(['airtel-list-rq-info'])
        );

        this.subscriptionList.push(
            this.searchMain$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[searchMain$ > subscribe]', ev);
                        if (ev) {
                            this.vm = _.cloneDeep(ev.option.vm);
                            // string to boolean
                            this.vm.nonStop = this.vm.nonStop === 'false' ? false : true;
                            this.vm.addHotel = this.vm.addHotel === 'false' ? false : true;
                        }
                    }
                )
        );
    }

    /**
     * 폼 초기화
     */
    formInit() {
        // 왕복
        if (this.vm.tripTypeCode === 'RT') {
            this.mainForm = this.fb.group({
                originCd: ['', Validators.required],     // 출발지
                destCd: ['', Validators.required],         // 도착지
                dateGo: ['', Validators.required],       // 출발 시간( = 항공편 출발시간)
                dateCome: ['', Validators.required],       // 도착 시간(왕복만 존재)
                travelerOption: ['', Validators.required]                                     // 좌석등급, 객실 수, 인원 수
            });
            //
        }

        console.log(this.mainForm);
        console.info('[formInit>]', this.mainForm);
        this.loadingBool = true;
    }

    storeInit() {
        this.modalOrigin$ = this.store.select(
            AirtelModalDestinationSelector.getSelectId(['airtel-origin'])
        );

        this.modalDestination$ = this.store.select(
            AirtelModalDestinationSelector.getSelectId(['airtel-destination'])
        );

        this.modalCalendar$ = this.store.select(
            AirtelModalCalendarSelector.getSelectId(['airtel-calendar'])
        );

        this.modalTravelerOption$ = this.store.select(
            AirtelModalTravelerOptionSelector.getSelectId(['travelerOption'])
        );

    }

    storeSubscribe() {
        this.subscriptionList.push(
            // 여행 날짜
            this.modalCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    ev => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            // 여행 날짜 -> vm 셋팅
                            this.vm.trip.destination[0].date = ev.result.selectList[0];
                            this.vm.trip.destination[1].date = ev.result.selectList[1];
                            this.vm.trip.destination[0].dateRange = `${moment(ev.result.selectList[0]).format('MM.DD (ddd)')} - ${moment(ev.result.selectList[1]).format('MM.DD (ddd)')}`;
                        }
                    }
                )
        );

        this.subscriptionList.push(
            // 출발 목적지
            this.modalOrigin$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    ev => {
                        console.info('[modalOrigin$ > subscribe]', ev);
                        if (ev) {
                            // 목적지 -> vm 셋팅
                            this.destValSet(ev, 'origin');
                        }
                    }
                )
        );

        this.subscriptionList.push(
            // 도착 목적지
            this.modalDestination$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    ev => {
                        console.info('[modalDestination$ > subscribe]', ev);
                        if (ev) {
                            this.destValSet(ev, 'dest');
                        }
                    }
                )
        );

        this.subscriptionList.push(
            // 좌석 및 인원 옵션
            this.modalTravelerOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    ev => {
                        console.info('[travelOption$ > subscribe]', ev);
                        if (ev) {
                            this.vm.travelerStore = ev.option;
                            this.mainForm.patchValue({ travelerOption: ev.option.cabinClassTxt });
                        }
                    }
                )
        );
    }

    /**
    * 폼 데이터 셋팅(vm => validation)
    */
    formDataSetting() {
        // 왕복
        if (this.vm.tripTypeCode === 'RT') {
            this.mainForm.patchValue({
                originCd: this.vm.trip.destination[0].origin.val,
                destCd: this.vm.trip.destination[0].dest.val,
                dateGo: this.vm.trip.destination[0].date,
                dateCome: this.vm.trip.destination[1].date,
                travelerOption: this.vm.travelerStore.cabinClassTxt
            });
        }
    }

    /**
    * 목적지 검색 이동
    * @param $itemCategoryCode
    * @param $storeId
    */
    goToFlightModalDestination($itemCategoryCode, $storeId) {
        /**
         * 아이템 카테고리 코드
         * IC01 항공
         * IC02 호텔
         * IC03 렌터카
         * IC04 액티비티
         * IC05 일정표
         */
        const itemCategoryCode = $itemCategoryCode;

        const initialState: any = {
            storeId: $storeId,
            majorDestinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: itemCategoryCode,
                        compCode: environment.COMP_CODE
                    }
                }
            },
            destinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: itemCategoryCode,
                        keyword: null,
                        limits: [0, 20]
                    }
                },
            }
        };

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
    }

    goToHotelModalDestination($itemCategoryCode, $storeId) {
        /**
         * 아이템 카테고리 코드
         * IC01 항공
         * IC02 호텔
         * IC03 렌터카
         * IC04 액티비티
         * IC05 일정표
         */
        const itemCategoryCode = $itemCategoryCode;
        const storeId = $storeId;

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            majorDestinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: itemCategoryCode,
                        compCode: environment.COMP_CODE
                    }
                }
            },
            destinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: itemCategoryCode,
                        keyword: null,
                        limits: [0, 20]
                    }
                },
            }
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
    }

    /**
     * 목적지 데이터 -> vm에 셋팅
     * @param $dest 선택한 목적지 데이터(도시코드, 공항코드)
     * @param option option => origin : 출발지, dest : 도착지
     */
    destValSet($dest, option: string) {
        const destType = option === 'origin' ? 'dest' : 'origin';

        this.vm.trip.destination[0][option] = $dest;

        if (destType === 'origin') {
            this.vm.trip.destination[1][destType] = $dest;
        }

        // 목적지 - 공항선택(공항코드로 표시)
        if (_.has($dest, 'airports[0]')) {
            this.vm.trip.destination[0][option] = $dest;

            if (destType === 'origin') {
                this.vm.trip.destination[1][destType] = $dest;
            }
            // 목적지 - 도시선택(도시코드로 표시)
        } else {
            this.vm.trip.destination[0][option] = $dest;

            if (destType === 'origin') {
                this.vm.trip.destination[1][destType] = $dest;
            }
        }
    }

    /**
    * 2. 결과페이지로 페이지 이동
    */
    goToResultPage() {
        const tripTypeCode = this.vm.tripTypeCode;
        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                tripTypeCode: this.vm.tripTypeCode,                   // 여행종류(RT : 왕복, OW : 편도, MT : 다구간)
                adultCount: this.vm.travelerStore.adultCount,         // 성인(명) 수
                childCount: this.vm.travelerStore.childCount,         // 아동(명) 수
                infantCount: this.vm.travelerStore.infantCount,       // 유아(명) 수
                laborCount: 0,                                        // b2c에서 사용 안함..
                studentCount: 0,                                      // b2c에서 사용 안함..
                cabinClassCode: this.vm.travelerStore.cabinClassCode, // 좌석등급
                deviceTypeCode: 'MA',                                 // MA: Mobile App, MW: Mobile Web, PC: PC
                itineraries: [],                                      // 항공 여정
                dynamicSearchYn: true,                                // 항공+호텔 동시검색 여부(묶음할인만 true)
                limits: [                                             // 페이징
                    0,
                    10
                ],
                filter: {}
            }
        };

        _.forEach(this.vm.trip.destination, key => {
            console.info('[key]', key);
            const itinerary: any = {
                originCityCodeIata: key.origin.val,      // 출발 도시코드
                destinationCityCodeIata: key.dest.val,   // 도착 도시코드
            };

            itinerary.departureDate = key.date;

            // 목적지 - 공항선택(도시코드&&공항코드)
            if (_.has(key, 'origin.airports[0]')) {
                itinerary.originAirportCode = key.origin.airports[0].airportCode;
            }
            // 목적지 - 공항선택(도시코드&&공항코드)
            if (_.has(key, 'dest.airports[0]')) {
                itinerary.destinationAirportCode = key.dest.airports[0].airportCode;
            }

            // 가는여정 추가
            rq.condition.itineraries.push(itinerary);

            // 왕복( 오는여정 추가 )
            if (tripTypeCode === 'RT') {
                const itineraryRT: any = {};

                itineraryRT.originCityCodeIata = itinerary.destinationCityCodeIata;
                itineraryRT.destinationCityCodeIata = itinerary.originCityCodeIata;

                // 오는 날짜
                itineraryRT.departureDate = this.vm.trip.destination[1].date;

                // 목적지 - 공항선택
                if (_.has(itinerary, 'originAirportCode')) {
                    itineraryRT.destinationAirportCode = itinerary.originAirportCode;
                }
                // 목적지 - 공항선택
                if (_.has(itinerary, 'destinationAirportCode')) {
                    itineraryRT.originAirportCode = itinerary.destinationAirportCode;
                }

                // 오는여정 추가
                rq.condition.itineraries.push(itineraryRT);
            }

            if (tripTypeCode === 'RT' || tripTypeCode === 'OW') {
                return false;
            }
        });

        // 일반석 이코노미가 아닐경우
        // if (this.vm.travelerStore.cabinClassCode !== "Y") {
        //   rq["condition"]["cabinClassCode"] = this.vm.travelerStore.cabinClassCode;
        // }
        // 항공 직항만 체크된경우 filter 추가
        if (this.vm.nonStop) {
            const stops: any = {
                'stops': [
                    {
                        'viaCount': 0     // viaCount => 0 : 직항, 1: 1회 경유, 2: 2회 경유
                    }
                ]
            };
            rq['condition']['filter'] = stops;
        }

        const rqInfo = {
            rq: rq,
            vm: this.vm
        };

        console.info('[rqInfo >>]', rqInfo);

        const incodingOpt = {
            encodeValuesOnly: true
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        //묶음할인(가는편)
        const queryString = qs.stringify(rqInfo, incodingOpt);
        let path = '/airtel-search-result-go/';

        path += queryString;

        const initialState: any = {
            path: path,
            parent: this.pCtx,
            step: 'flight-go'
        };

        const modalStepPage: BsModalRef = this.bsModalService.show(AirtelModalStepPageComponent, { initialState, ...configInfo });

        this.subscriptionList.push(
            this.bsModalService.onHide
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    () => {
                        const ctx = modalStepPage.content.ctx;
                        ctx.stopStepMove();
                    }
                )
        );

        // 페이지 이동
    }
    modalClose() {
        this.bsModalRef.hide();
        console.log('modalClose()');
    }

    /**
     * 출발지 선택
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onOrigin() {
        console.info('[목적지 검색 | 가는날]');
        this.goToFlightModalDestination('IC01', 'origin');
    }

    /**
     * 도착지 선택
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onDestination() {
        console.info('[목적지 검색 | 오는날]');
        this.goToFlightModalDestination('IC01', 'destination');
    }

    onCalendar() {
        console.info('[달력 팝업]');

        const itemCategoryCode = 'IC02';
        const storeId = 'airtel-hotel-calendar';

        const initialState: any = {
            storeCategoryType: StoreCategoryTypes.AIRTEL,
            storeId: storeId,
            step: 0,
            totStep: 2,
            tabTxtList: ['가는날', '오는날'],
            selectList: [],

            rq: {
                currency: 'KRW',
                language: 'KO',
                stationTypeCode: environment.STATION_CODE,
                condition: {
                    itemCategoryCode: itemCategoryCode
                }
            }
        };

        console.info('[initialState click]', initialState.selectList);

        for (const [idx, val] of this.vm.trip.destination.entries()) {
            if (!_.isEmpty(this.vm.trip.destination[idx].date)) {
                initialState.step += 1;
                initialState.selectList.push(val.date);
            }
        }
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });
    }

    /**
     * 달력 팝업
     */
    onHotelCalendar() {
        console.info('[달력 팝업]');

        const itemCategoryCode = 'IC02';
        const storeId = 'airtel-hotel-calendar';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,

            step: 0,
            totStep: 2,
            tabTxtList: ['체크인', '체크아웃'],
            selectList: [],

            rq: {
                currency: 'KRW',
                language: 'KO',
                stationTypeCode: environment.STATION_CODE,
                condition: {
                    itemCategoryCode: itemCategoryCode
                }
            }
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });
    }

    /**
     * 좌석, 인원 수 선택
     */
    onSeat() {
        console.info('[좌석 선택 | 옵션]');

        const initialState: any = {
            selectedOption: {
                ...this.vm.travelerStore
            }
        };

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(AirtelModalTravelerOptionComponent, { initialState, ...configInfo });
    }

    /**
     * 호텔 장소 검색 클릭
     */
    onHotelCity() {
        console.info('[호텔 장소 검색 클릭]');
        this.goToHotelModalDestination('IC02', 'hotelCity');
    }

    /**
    * 출발지 도착지 변경
    * @param changeItem
    */
    onChangeDest(changeItem: any) {
        const temp = changeItem.origin;
        changeItem.origin = changeItem.dest;
        changeItem.dest = temp;
    }

    /**
    * 직항 유무
    * @param e
    */
    onNonstop(event: MouseEvent) {
        event && event.preventDefault();

        this.vm.nonStop = !this.vm.nonStop;
    }

    onAddHotel(event: MouseEvent) {
        event && event.preventDefault();

        this.vm.addHotel = !this.vm.addHotel;

        // if (this.vm.addHotel) {
        //   this.mainForm.addControl('hotelCity', this.fb.control(this.vm.hotelCity.val, Validators.required));
        //   this.mainForm.addControl('hotelCityName', this.fb.control(this.vm.hotelCity.name, Validators.required));
        //   this.mainForm.addControl('checkDate', this.fb.control(this.vm.checkDate, Validators.required));
        //   this.mainForm.addControl('checkInOutDate', this.fb.control(this.vm.checkInOutDate, Validators.required));
        // } else {
        //   this.mainForm.removeControl('hotelCity');
        //   this.mainForm.removeControl('hotelCityName');
        //   this.mainForm.removeControl('checkDate');
        //   this.mainForm.removeControl('checkInOutDate');
        // }
    }

    /**
     * 항공 검색(mainForm 전송)
     */
    onSubmit() {
        console.info('[0. vm데이터 mainForm에 셋팅]');
        this.formDataSetting();

        console.info('[mainForm>]', this.mainForm.value);

        //유효성 체크
        if (this.mainForm.valid) {
            console.info('[1. 유효성 체크 성공]');

            console.info('[2. 결과페이지로 이동]');
            this.goToResultPage();
        } else {
            alert('fail');
            return;
        }
    }
}
