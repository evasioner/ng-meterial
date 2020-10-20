import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { Store } from '@ngrx/store';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import * as FlightModalCalendarSelector from 'src/app/store/flight-common/flight-modal-calendar/flight-modal-calendar.selectors';
import * as FlightModalDestinationSelector from 'src/app/store/flight-common/flight-modal-destination/flight-modal-destination.selectors';
import * as FlightModalTravelerOptionSelector from 'src/app/store/flight-common/flight-modal-traveler-option/flight-modal-traveler-option.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as qs from 'qs';
import * as moment from 'moment';

import { environment } from '@/environments/environment';

import { CalendarState } from '@/app/common-source/enums/calendar-state.enum';
import { DestinationState } from '../../../../common-source/enums/destination-state.enum';
import { TravelerOptionState } from '@/app/common-source/enums/traveler-option-state.enum';

@Component({
    selector: 'app-flight-main-search',
    templateUrl: './flight-main-search.component.html',
    styleUrls: ['./flight-main-search.component.scss']
})
export class FlightMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup;                    // 폼
    @ViewChild('f') private formGroupDirective: FormGroupDirective;

    rxAlive: boolean = true;                // 구독 제어 값

    destinationMdIndex: number = 0;         // 다구간 Index (여정 1,2,3,4)

    modalCalendar$: Observable<any>;        // 여행날짜
    modalOrigin$: Observable<any>;          // 목적지(출발)
    modalDestination$: Observable<any>;     // 목적지(도착)
    modalTravelerOption$: Observable<any>;  // 좌석등급, 인원 수

    /**
     * 목적지 검색 : 도시검색 + 자동검색
     */
    originObj: any = null;
    isOriginObj: boolean = null;

    destinationObj: any = null;
    isDestinationObj: boolean = null;

    // 여행 타입
    tripType: any = [
        {
            code: 'RT',
            name: '왕복'
        },
        {
            code: 'OW',
            name: '편도'
        },
        {
            code: 'MD',
            name: '다구간'
        }
    ];

    // 메인페이지에 선택한 값들 저장
    vm: any = {
        tripTypeCode: 'RT', // 항공편 종류( 왕복 : RT, 편도 : OW, 다구간 : MT ) default : RT
        nonStop: false,     // 직항 여부
        trip: {
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
        // 좌석등급, 인원 수
        travelerStore: {
            cabinClassTxt: '일반석, 성인1명',
            cabinClassNm: '일반석',
            cabinClassCode: 'Y',
            adultCount: 1,
            childCount: 0,
            infantCount: 0
        }
    };

    // 캘린더 Rq
    calendarObj: any = {
        storeCategoryType: 'FLIGHT',
        typeId: null,
        state: CalendarState.IS_DEFAULT,
        right: 0,
        top: 182,
        initialState: null,
        closeEvt: this.onCanlendarClose
    };

    // 여행인원
    travelerObj: any = {
        state: TravelerOptionState.IS_DEFAULT,
        selectedOption: null,
        right: 0,
        top: 182,
        closeEvt: this.onTravelerClose
    };

    // 도시검색 Rq
    majorDestinationRq: any = {
        rq: {
            currency: 'KRW',
            language: 'KO',
            stationTypeCode: environment.STATION_CODE,
            condition: {
                itemCategoryCode: 'IC01',
                compCode: environment.COMP_CODE
            }
        }
    };

    // 자동검색 Rq
    destinationRq: any = {
        rq: {
            currency: 'KRW',
            language: 'KO',
            stationTypeCode: environment.STATION_CODE,
            condition: {
                itemCategoryCode: 'IC01',
                keyword: null,
                limits: [0, 20]
            }
        }
    };
    beforeCity: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.subscriptionList = [];
        this.beforeCity = _.cloneDeep(this.vm.trip.destination);
    }

    ngOnInit() {
        super.ngOnInit();
        this.formInit();            // 폼 초기화
        this.destinationObjInit();  // 목적지 검색 데이터 초기화
        this.storeInit();           // 스토어 초기화
        this.storeSubscribe();      // 스토어 구독
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }
    /**
    * 폼 초기화 (3가지 타입(왕복, 편도, 다구간)) for Validation
    */
    formInit() {
        this.mainForm = this.fb.group({
            destinations: this.fb.array([]),
            travelerOption: ['', Validators.required]
        });

        this.addDest();

        // 왕복
        if (this.vm.tripTypeCode === 'RT') {
            this.mainForm.addControl('dateCome', this.fb.control('', Validators.required));
        } else if (this.vm.tripTypeCode === 'MD') {
            // 다구간은 여정1,2가 기본 default 셋팅
            this.addDest();
        }
    }

    get destinations(): FormArray {
        return this.mainForm.get('destinations') as FormArray;
    }

    newDest(): FormGroup {
        return this.fb.group({
            originCd: new FormControl('', Validators.required),
            destCd: new FormControl('', Validators.required),
            dateGo: new FormControl('', Validators.required)
        });
    }

    addDest() {
        this.destinations.push(this.newDest());
    }

    /**
     * 폼 데이터 셋팅(vm => validation)
     */
    formDataSetting() {
        // vm 데이터 가공
        if (this.vm.tripTypeCode === 'RT' || this.vm.tripTypeCode === 'OW') { // 왕복, 편도
            const destination = this.vm.trip.destination;
            if (destination.length > 2)
                this.vm.trip.destination = _.slice(destination, 0, 2);

            if (this.vm.tripTypeCode === 'OW') {
                this.vm.trip.destination[0].dateRange = '';
                this.vm.trip.destination[1].date = '';
                this.vm.trip.destination[1].dest = { name: '', val: '' };
            }
        }

        //form data setting
        _.forEach(this.destinations.controls, (item: FormArray, idx) => {
            item.get('originCd').patchValue(this.vm.trip.destination[idx].origin.val);
            item.get('destCd').patchValue(this.vm.trip.destination[idx].dest.val);
            item.get('dateGo').patchValue(this.vm.trip.destination[idx].date);
            this.mainForm.patchValue({ travelerOption: this.vm.travelerStore.cabinClassTxt });

        });

        if (this.vm.tripTypeCode === 'RT') {
            this.mainForm.patchValue({ dateCome: this.vm.trip.destination[1].date });
        }
    }

    dateValSet(ev: any) {
        // 왕복
        if (this.vm.tripTypeCode === 'RT') {
            this.vm.trip.destination[0].date = ev.result.selectList[0];
            this.vm.trip.destination[1].date = ev.result.selectList[1];
            // from - to
            this.vm.trip.destination[0].dateRange = `${moment(ev.result.selectList[0]).locale('ko').format('MM.DD(dd)')} - ${moment(ev.result.selectList[1]).locale('ko').format('MM.DD(dd)')}`;
            // 편도
        } else if (this.vm.tripTypeCode === 'OW') {
            this.vm.trip.destination[0].date = ev.result.selectList[0];

            // 다구간
        } else {
            for (let i = 0; i < this.vm.trip.destination.length; i++) {
                this.vm.trip.destination[i].date = ev.result.selectList[i];
            }
            // from - to
            this.vm.trip.destination[0].dateRange = `${moment(ev.result.selectList[0]).locale('ko').format('MM.DD(dd)')} - ${moment(ev.result.selectList[1]).locale('ko').format('MM.DD(dd)')}`; // 다구간 -> 왕복으로 변경시 Range(다구간 구간 1,2가 표시됨)
        }
    }

    /**
     * 목적지 데이터 -> vm에 셋팅
     * @param $dest 선택한 목적지 데이터(도시코드, 공항코드)
     * @param option option => origin : 출발지, dest : 도착지
     */
    destValSet($dest, option: string) {
        console.log($dest);

        const destType = option === 'origin' ? 'dest' : 'origin';

        // 왕복, 편도
        if (this.vm.tripTypeCode === 'RT' || this.vm.tripTypeCode === 'OW') {
            this.vm.trip.destination[0][option] = $dest;

            if (destType === 'origin') {
                this.vm.trip.destination[1][destType] = $dest;
            }

            // 다구간
        } else {
            this.vm.trip.destination[this.destinationMdIndex][option] = $dest;

            // 다음 여정이 있을시 (선택한 여정(여정 1)의 목적지가 다음 여정(여정 2)의 출발지로 선택)
            if (_.has(this.vm.trip.destination[this.destinationMdIndex + 1], 'origin')) {
                if (destType === 'origin') {
                    this.vm.trip.destination[this.destinationMdIndex + 1][destType] = $dest;
                }
            }
        }

        this.isOriginObj = false;
        this.isDestinationObj = false;
    }

    /**
     * 여정에 맞는 topSize를 반환
     * @param idx 다구간 여정의 값(1,2,3,4)
     */
    topSize(idx: any) {
        let topSize = 0;
        switch (idx) {
            case 0:
                topSize = 169;
                break;

            case 1:
                topSize = 269;
                break;

            case 2:
                topSize = 369;
                break;

            case 3:
                topSize = 469;
                break;
        }
        return topSize;
    }

    closeModal() {
        this.onCanlendarClose(this);
        this.onTravelerClose(this);
    }

    storeInit() {
        /**
         * 좌석옵션 스토어 셀렉트
         */
        this.modalTravelerOption$ = this.store.select(
            FlightModalTravelerOptionSelector.getSelectId(['travelerOption'])
        );

        /**
         * 여행날짜 스토어 셀렉트
         */
        this.modalCalendar$ = this.store.select(
            FlightModalCalendarSelector.getSelectId(['flight-main'])
        );

        /**
         * 목적지(출발) 스토어 셀렉트
         */
        this.modalOrigin$ = this.store.select(
            FlightModalDestinationSelector.getSelectId(['origin'])
        );

        /**
         * 목적지(도착) 스토어 셀렉트
         */
        this.modalDestination$ = this.store.select(
            FlightModalDestinationSelector.getSelectId(['destination'])
        );
    }

    storeSubscribe() {
        this.subscriptionList.push(
            // 여행 날짜
            this.modalCalendar$
                .pipe(takeWhile((() => this.rxAlive)))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            // 여행 날짜 -> vm 셋팅
                            this.dateValSet(_.cloneDeep(ev));
                        }
                    }
                )
        );

        this.subscriptionList.push(
            // 출발 목적지
            this.modalOrigin$
                .pipe(takeWhile((() => this.rxAlive)))
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

        this.subscriptionList.push(
            // 도착 목적지
            this.modalDestination$
                .pipe(takeWhile((() => this.rxAlive)))
                .subscribe(
                    (ev) => {
                        console.info('[modalDestination$ > subscribe]', ev);
                        if (ev) {
                            // 목적지 -> vm 셋팅(오는편)
                            this.destValSet(ev, 'dest');
                        }
                    }
                )
        );

        this.subscriptionList.push(
            // 좌석 및 인원 옵션
            this.modalTravelerOption$
                .pipe(takeWhile((() => this.rxAlive)))
                .subscribe(
                    (ev) => {
                        console.info('[travelOption$ > subscribe]', ev);
                        if (ev) {
                            this.vm.travelerStore.cabinClassCode = ev.option.cabinClassCode;
                            this.vm.travelerStore.adultCount = ev.option.adultCount;
                            this.vm.travelerStore.childCount = ev.option.childCount;
                            this.vm.travelerStore.infantCount = ev.option.infantCount;
                            this.vm.travelerStore.cabinClassTxt = ev.option.cabinClassTxt;
                            this.vm.travelerStore.cabinClassNm = ev.option.cabinClassNm;
                            this.mainForm.patchValue({ travelerOption: ev.option.cabinClassTxt });
                        }
                    }
                )
        );
    }

    goToResultPage() {
        const tripTypeCode = this.vm.tripTypeCode;
        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                tripTypeCode: this.vm.tripTypeCode,                      // 여행종류(RT : 왕복, OW : 편도, MT : 다구간)
                adultCount: this.vm.travelerStore.adultCount,            // 성인(명) 수
                childCount: this.vm.travelerStore.childCount,            // 아동(명) 수
                infantCount: this.vm.travelerStore.infantCount,          // 유아(명) 수
                laborCount: 0,                                           // b2c에서 사용 안함..
                studentCount: 0,                                         // b2c에서 사용 안함..
                cabinClassCode: this.vm.travelerStore.cabinClassCode,    // 좌석등급
                deviceTypeCode: 'PC',                                    // MA: Mobile App, MW: Mobile Web, PC: PC
                itineraries: [],                                         // 항공 여정
                dynamicSearchYn: false,                                  // 항공+호텔 동시검색 여부(묶음할인만 true)
                limits: [                                                // 페이징
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

        //항공(가는편)으로 이동(왕복, 편도)
        const queryString = qs.stringify(rqInfo);
        let path = '/flight-search-result-go/';

        //항공(다구간)으로 이동
        if (this.vm.tripTypeCode === 'MD') {
            path = '/flight-search-result-multi/';
        }

        path += queryString;
        const extras = {
            relativeTo: this.route
        };

        // 페이지 이동
        this.router.navigate([path], extras);
    }


    /**
     * 항공편 선택( 왕복(RT), 편도(OW), 다구간(MT))
     * @param selectedType
     */
    onSelTripType(selectedType: string) {
        console.info('[onSelTripType]', this.vm.tripTypeCode);
        if (this.vm.tripTypeCode !== selectedType) {
            this.mainForm.reset();               // Reset form data
            this.formGroupDirective.resetForm(); // Reset the ugly validators
            this.vm.tripTypeCode = selectedType;
            this.formInit();
            this.closeModal();
        }
    }

    /**
     * 다구간 여정추가
     */
    onAdd() {
        console.info('[여정추가]');

        const addItem = {
            date: '',
            origin: {
                val: '',
                name: ''
            },
            dest: {
                val: '',
                name: ''
            }
        };

        // 다구간 여정은 최대 4개까지
        if (this.vm.trip.destination.length < 4) {
            addItem.origin = _.cloneDeep(this.vm.trip.destination[this.vm.trip.destination.length - 1].dest);
            this.vm.trip.destination.push(addItem);

            //mainForm에 validatoin 영역 추가
            this.addDest();

        } else {
            alert('다구간 여정은 4구간 까지 추가 가능합니다.');
        }
    }

    /**
     * 다구간 여정제거
     * @param index
     */
    onDelete(index: number) {
        console.info('[여정제거]');
        //mainForm에 validatoin 영역 제거
        this.destinations.removeAt(index);

        if (index === 0) {
            this.vm.trip.destination.splice(2, 1);
        } else {
            this.vm.trip.destination.pop();
        }
    }

    /**
     * 직항 유무
     * @param e
     */
    onNonstop(event: MouseEvent) {
        event && event.preventDefault();

        this.vm.nonStop = !this.vm.nonStop;
    }

    /**
     * 출발지 도착지 변경
     * @param changeItem
     */
    onChangeDest(changeItem: any) {
        console.log('change');
        const temp = changeItem.origin;
        changeItem.origin = changeItem.dest;
        changeItem.dest = temp;
    }

    //------------------------------[날짜 검색]
    /**
     *
     * @param calIdx 캘린더 인덱스(다구간)
     */
    onCalendar(calIdx?: any) {
        // 열린 창 닫기
        this.closeModal();
        if (this.vm.tripTypeCode === 'MD') {
            this.calendarObj.top = this.topSize(calIdx);
        }

        this.calendarObj.state = CalendarState.IS_OPEN;
        console.info('[달력 팝업]', this.calendarObj.state);

        const itemCategoryCode = 'IC01';
        const storeId = 'flight-main';

        const initialState: any = {
            storeId: storeId,

            step: 0,
            totStep: 0,
            tabTxtList: [],
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

        if (this.vm.tripTypeCode === 'RT') {
            initialState.totStep = 2;
            initialState.tabTxtList = ['가는날', '오는날'];

        } else if (this.vm.tripTypeCode === 'OW') {
            initialState.totStep = 1;
            initialState.tabTxtList = ['가는날'];

        } else {
            _.forEach(this.vm.trip.destination, (val, idx) => {
                initialState.tabTxtList.push(`여정${idx + 1}`);
                initialState.totStep += 1;
            });
        }

        for (const [idx] of this.vm.trip.destination.entries()) {
            // 캘린더 선택값이 있으면
            if (!_.isEmpty(this.vm.trip.destination[idx].date)) {
                initialState.selectList = [];
                initialState.step = 0;
            }
        }


        console.info('[initialState]', initialState);
        this.calendarObj.initialState = initialState;
    }

    onCanlendarClose($ctx) {
        console.info('[onCanlendarClose]');
        $ctx.calendarObj.state = CalendarState.IS_DEFAULT;
    }

    //------------------------------[날짜 검색]

    //------------------------------[여행인원 검색]
    onTraveler($index?: number) {
        // 열린 창 닫기
        this.closeModal();
        if (this.vm.tripTypeCode === 'MD') {
            this.travelerObj.top = this.topSize($index);
        }
        this.travelerObj.state = TravelerOptionState.IS_OPEN;
        this.travelerObj.selectedOption = { ...this.vm.travelerStore };
    }

    onTravelerClose($ctx) {
        console.info('[onTravelerClose]');
        $ctx.travelerObj.state = TravelerOptionState.IS_DEFAULT;
    }

    //------------------------------[목적지 검색]

    /**
     * 목적지 검색 데이터 초기화
     */
    destinationObjInit() {
        console.info('[destinationObjInit]');
        this.originObj = {
            storeCategoryType: 'FLIGHT', // 카테고리 선택 | FLIGHT, HOTEL, AIRTEL, RENT, ACTIVITY, MY
            state: null,
            storeId: null,
            inputId: null,
            left: 0,
            top: 0,
            initialState: null,
            closeEvt: this.onCanlendarClose,
            majorDestinationRq: this.majorDestinationRq,
            destinationRq: this.destinationRq
        };

        this.destinationObj = {
            storeCategoryType: 'FLIGHT', // 카테고리 선택 | FLIGHT, HOTEL, AIRTEL, RENT, ACTIVITY, MY
            state: null,
            storeId: null,
            inputId: null,
            left: 0,
            top: 0,
            initialState: null,
            closeEvt: this.onCanlendarClose,
            majorDestinationRq: this.majorDestinationRq,
            destinationRq: this.destinationRq
        };
    }

    /**
     *
     * @param e 이벤트
     * @param $inputId dataTarget ID
     * @param storeId store 저장 ID
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onOriginStateFocus(e, $inputId, storeId: string, $index?: number) {
        this.destinationMdIndex = $index;

        console.info('[onOriginStateFocus]', this.originObj);
        console.info('[onOriginStateFocus]', this.vm.trip.destination);
        // 열린 창 닫기
        this.closeModal();

        this.beforeCity = _.cloneDeep(this.vm.trip.destination);
        this.destinationObjInit();
        e.target.value = '';
        const origin: any = {
            name: '',
            val: ''
        };
        this.vm.trip.destination[$index].origin = _.cloneDeep(origin);
        this.originObj.storeId = storeId;
        this.originObj.inputId = $inputId;
        this.originObj.top = 0;
        this.originObj.state = DestinationState.IS_CITY;

        const tgWrapName = 'tg-wrap-date-time';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.originObj.top = tgWrap.clientHeight + 10;

        if (this.vm.tripTypeCode === 'MD') {
            this.originObj.top = this.topSize($index);
        }

        this.isOriginObj = true;
        console.log('originObj', this.originObj);
    }

    onOriginStateKeyup(e) {
        console.info('[onOriginStateKeyup]', this.originObj, e.target.value.length);
        const tgVal = e.target.value;
        console.log('tgVal >', tgVal);
        if (tgVal.length === 0) {  // 도시검색
            this.originObj.state = DestinationState.IS_CITY;
        } else if (tgVal.length > 0) { // 자동검색
            this.originObj.state = DestinationState.IS_AUTO;
        }
    }

    /**
     *
     * @param e 이벤트
     * @param $inputId dataTarget ID
     * @param storeId store 저장 ID
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onDestinationStateFocus(e, $inputId, storeId: string, $index?: number) {
        this.destinationMdIndex = $index;

        console.info('[onDestinationStateFocus]', this.destinationObj);
        console.info('[onDestinationStateFocus]', this.vm.trip.destination);
        // 열린 창 닫기
        this.closeModal();

        this.beforeCity = _.cloneDeep(this.vm.trip.destination);

        this.destinationObjInit();
        e.target.value = '';

        const dest: any = {
            name: '',
            val: ''
        };
        this.vm.trip.destination[$index].dest = _.cloneDeep(dest);

        this.destinationObj.storeId = storeId;
        this.destinationObj.inputId = $inputId;
        this.destinationObj.top = 0;
        this.destinationObj.state = DestinationState.IS_CITY;

        const tgWrapName = 'tg-wrap-date-time';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.destinationObj.top = tgWrap.clientHeight + 10;

        if (this.vm.tripTypeCode === 'MD') {
            this.destinationObj.top = this.topSize($index);
        }

        this.isDestinationObj = true;
        console.log('destinationObj', this.destinationObj, '시바 : ', this.vm.trip);
    }

    onDestinationStateKeyup(e) {
        console.info('[onDestinationStateKeyup]', this.destinationObj, e.target.value.length);
        const tgVal = e.target.value;
        console.log('tgVal >', tgVal);
        if (tgVal.length === 0) {  // 도시검색
            this.destinationObj.state = DestinationState.IS_CITY;
        } else if (tgVal.length > 0) { // 자동검색
            this.destinationObj.state = DestinationState.IS_AUTO;
        }
    }

    /**
     * 목적지 검색 close event
     * @param e
     */
    onDestinationClose(e?) {
        this.isOriginObj = false;
        this.isDestinationObj = false;

        console.info('[onDestinationClose]', e);
        console.info('[beforeCity]', this.beforeCity);
        // if (e) {
        //     this.vm.trip.destination = _.cloneDeep(this.beforeCity);
        // }
        console.info('[onDestinationClose]', _.cloneDeep(this.vm.trip.destination));
    }

    onStatfocusout(event: any) {
        event && event.preventDefault();
        console.info('focus out test >>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<');
        if (event) {
            this.vm.trip.destination = _.cloneDeep(this.beforeCity);
        }
    }
    //------------------------------[end 목적지 검색]

    onSubmit() {
        console.info('[0. vm데이터 mainForm에 셋팅]');
        this.formDataSetting();

        console.info('[mainForm>]', this.mainForm.value);
        console.info('[vm]', this.vm);

        //유효성 체크
        if (this.mainForm.valid) {
            console.info('[1. 유효성 체크 성공]');

            console.info('[2. 결과페이지로 이동]');
            this.goToResultPage();
        } else {
            alert('검색조건이 모두 입력되지 않았습니다. 검색 조건을 확인해주세요.');
            return;
        }
    }
}
