import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as AirtelModalTravelerOptionSelector from '@/app/store/airtel-common/airtel-modal-traveler-option/airtel-modal-traveler-option.selectors';
import * as AirtelModalDestinationSelector from '@/app/store/airtel-common/airtel-modal-destination/airtel-modal-destination.selectors';
import * as AirtelModalCalendarSelector from '@/app/store/airtel-common/airtel-modal-calendar/airtel-modal-calendar.selectors';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

import * as qs from 'qs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { StoreCategoryTypes } from '@app/common-source/enums/store-category-types.enum';
import { environment } from '@/environments/environment';
import { CommonModalCalendarComponent } from '@app/common-source/modal-components/common-modal-calendar/common-modal-calendar.component';
import { AirtelModalTravelerOptionComponent } from '@/app/common-source/modal-components/airtel-modal-traveler-option/airtel-modal-traveler-option.component';
import { AirtelModalStepPageComponent } from '@/app/common-source/modal-components/airtel-modal-step-page/airtel-modal-step-page.component';
import { ModalDestinationComponent } from '@/app/common-source/modal-components/modal-destination/modal-destination.component';
import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-airtel-main-search',
    templateUrl: './airtel-main-search.component.html',
    styleUrls: ['./airtel-main-search.component.scss']
})
export class AirtelMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup;                    // 폼

    modalTravelerOption$: Observable<any>;  // 좌석등급, 인원 수
    modalOrigin$: Observable<any>;          // 목적지(출발)
    modalDestination$: Observable<any>;     // 목적지(도착)
    modalCalendar$: Observable<any>;        // 여행날짜

    modalhotelCity$: Observable<any>;// 호텔 목적지
    modalHotelCalendar$: Observable<any>;   // 여행날짜

    loadingBool: Boolean = false;

    bsModalRef: BsModalRef;                 // 모달

    rxAlive: boolean = true;

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
            cabinClassNm: '일반석',
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
        public translateService: TranslateService,
        private store: Store<any>,
        private bsModalService: BsModalService,
        private fb: FormBuilder
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.vmInit();                // vm 초기화
        this.formInit();              // 폼 초기화
        this.storeInit();             // 스토어 초기화
        this.storeSubscribe();        // 스토어 구독
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
     * vm 초기화
     */
    vmInit() {
        this.vm.trip = _.cloneDeep(this.tripTypeCodes[0]);  // 항공 + 호텔
        this.vm.checkDate = {};
        this.vm.hotelCity = {};
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
     * 스토어 초기화
     */
    storeInit() {
        /**
         * 좌석옵션 스토어 셀렉트
         */
        this.modalTravelerOption$ = this.store.select(
            AirtelModalTravelerOptionSelector.getSelectId(['travelerOption'])
        );

        /**
         * 여행날짜 스토어 셀렉트
         */
        this.modalCalendar$ = this.store.select(
            AirtelModalCalendarSelector.getSelectId(['airtel-calendar'])
        );

        /**
         * 목적지(출발) 스토어 셀렉트
         */
        this.modalOrigin$ = this.store.select(
            AirtelModalDestinationSelector.getSelectId(['airtel-origin'])
        );

        /**
         * 목적지(도착) 스토어 셀렉트
         */
        this.modalDestination$ = this.store.select(
            AirtelModalDestinationSelector.getSelectId(['airtel-destination'])
        );

        /**
         * 호텔 목적지 스토어 셀렉트
         */
        this.modalhotelCity$ = this.store.select(
            AirtelModalDestinationSelector.getSelectId(['airtel-hotelCity'])
        );

        /**
         * 호텔 숙박날짜 스토어 셀렉트
         */
        this.modalHotelCalendar$ = this.store.select(
            AirtelModalCalendarSelector.getSelectId(['airtel-hotel-calendar'])
        );
    }

    /**
   * 스토어 구독
   */
    storeSubscribe() {
        // 좌석 및 인원 옵션
        this.subscriptionList.push(
            this.modalTravelerOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[travelOption$ > subscribe]', ev);
                        if (ev) {
                            this.vm.travelerStore.cabinClassCode = ev.option.cabinClassCode;
                            this.vm.travelerStore.adultCount = ev.option.adultCount;
                            this.vm.travelerStore.childCount = ev.option.childCount;
                            this.vm.travelerStore.infantCount = ev.option.infantCount;
                            this.vm.travelerStore.cabinClassTxt = ev.option.cabinClassTxt;
                            this.vm.travelerStore.cabinClassNm = ev.option.cabinClassNm;

                            this.mainForm.patchValue({
                                travelerOption: ev.option.cabinClassTxt
                            });
                        }
                    }
                )
        );

        // 여행 날짜
        this.subscriptionList.push(
            this.modalCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
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

        // 출발 목적지
        this.subscriptionList.push(
            this.modalOrigin$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalOrigin$ > subscribe]', ev);
                        if (ev) {
                            // 목적지 -> vm 셋팅(가는편)
                            this.destValSet(ev, 'origin');
                        }
                    }
                )
        );

        // 도착 목적지
        this.subscriptionList.push(
            this.modalDestination$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalDestination$ > subscribe]', ev);
                        if (ev) {
                            // 목적지 -> vm 셋팅(오는편)
                            this.destValSet(ev, 'dest');
                        }
                    }
                )
        );

        // 숙박 장소(호텔)
        this.subscriptionList.push(
            this.modalhotelCity$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalhotelCity$ > subscribe]', ev);
                        if (ev) {
                            this.vm.hotelCity = ev;
                            console.info('[vm.hotelCity]', this.vm.hotelCity);
                            this.mainForm.patchValue({
                                hotelCity: this.vm.hotelCity.val,
                                hotelCityName: this.vm.hotelCity.name
                            });
                        }
                    }
                )
        );

        // 숙박 날짜(호텔)
        this.subscriptionList.push(
            this.modalHotelCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelCalendar$ > subscribe]', ev);
                        if (ev) {
                            const lang = this.translateService.getDefaultLang();
                            this.vm.checkDate.in = moment(ev.result.selectList[0].toString()).format('YYYY-MM-DD');
                            this.vm.checkDate.out = moment(ev.result.selectList[1].toString()).format('YYYY-MM-DD');

                            const chkIn = moment(this.vm.checkDate.in, 'YYYY-MM-DD');
                            const chkOut = moment(this.vm.checkDate.out, 'YYYY-MM-DD');
                            const dayDiff = chkOut.diff(chkIn, 'days'); //여행일수
                            let dayTxt = '';
                            if (lang == 'ko') {
                                dayTxt = '박';
                            } else {
                                if (dayDiff > 1)
                                    dayTxt = 'nights';
                                else
                                    dayTxt = 'night';
                            }

                            this.vm.checkInOutDate = moment(this.vm.checkDate.in.toString()).locale(lang).format('MM/DD (ddd)');
                            this.vm.checkInOutDate += '-';
                            this.vm.checkInOutDate += moment(this.vm.checkDate.out.toString()).locale(lang).format('MM/DD (ddd)');
                            this.vm.checkInOutDate += ' ' + dayDiff + dayTxt;

                            this.mainForm.patchValue({
                                checkDate: this.vm.checkDate
                            });
                            this.mainForm.patchValue({
                                checkInOutDate: this.vm.checkInOutDate
                            });
                        }
                    }
                )
        );

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

        this.bsModalRef = this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
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
            step: 'flight-go'
        };

        this.bsModalRef = this.bsModalService.show(AirtelModalStepPageComponent, { initialState, ...configInfo });

        this.subscriptionList.push(
            this.bsModalService.onHide
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    () => {
                        const ctx = this.bsModalRef.content.ctx;
                        ctx.stopStepMove();
                    }
                )
        );

        // 페이지 이동
    }

    /**
     * 목적지 검색 이동
     */
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

        this.bsModalRef = this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
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
     * 출발지 선택
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onOrigin() {
        console.info('[목적지 검색 | 가는날]');
        this.goToFlightModalDestination('IC01', 'airtel-origin');
    }

    /**
     * 도착지 선택
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onDestination() {
        console.info('[목적지 검색 | 오는날]');
        this.goToFlightModalDestination('IC01', 'airtel-destination');
    }

    onCalendar() {
        console.info('[달력 팝업]');

        const itemCategoryCode = 'IC01';
        const storeId = 'airtel-calendar';

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

        this.bsModalRef = this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });
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

        this.bsModalRef = this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });
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

        this.bsModalRef = this.bsModalService.show(AirtelModalTravelerOptionComponent, { initialState, ...configInfo });
    }

    /**
     * 호텔 장소 검색 클릭
     */
    onHotelCity() {
        console.info('[호텔 장소 검색 클릭]');
        this.goToHotelModalDestination('IC02', 'airtel-hotelCity');
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

        if (this.vm.addHotel) {
            this.mainForm.addControl('hotelCity', this.fb.control(this.vm.hotelCity.val, Validators.required));
            this.mainForm.addControl('hotelCityName', this.fb.control(this.vm.hotelCity.name, Validators.required));
            this.mainForm.addControl('checkDate', this.fb.control(this.vm.checkDate, Validators.required));
            this.mainForm.addControl('checkInOutDate', this.fb.control(this.vm.checkInOutDate, Validators.required));
        } else {
            this.mainForm.removeControl('hotelCity');
            this.mainForm.removeControl('hotelCityName');
            this.mainForm.removeControl('checkDate');
            this.mainForm.removeControl('checkInOutDate');
        }
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

