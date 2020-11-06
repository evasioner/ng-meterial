import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { clearFlightModalDestinations } from '../../../store/flight-common/flight-modal-destination/flight-modal-destination.actions';
import { clearFlightModalCalendars } from '../../../store/flight-common/flight-modal-calendar/flight-modal-calendar.actions';

import * as FlightModalTravelerOptionSelector from '@/app/store/flight-common/flight-modal-traveler-option/flight-modal-traveler-option.selectors';
import * as FlightModalDestinationSelector from '@/app/store/flight-common/flight-modal-destination/flight-modal-destination.selectors';
import * as FlightModalCalendarSelector from '@/app/store/flight-common/flight-modal-calendar/flight-modal-calendar.selectors';
import * as FlightMainSearchSelector from '@/app/store/flight-common/flight-search-result/flight-search-result.selectors';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { StoreCategoryTypes } from '../../enums/store-category-types.enum';

import { CommonModalCalendarComponent } from '../common-modal-calendar/common-modal-calendar.component';
import { CommonModalAlertComponent } from '../common-modal-alert/common-modal-alert.component';
import { ModalDestinationComponent } from '../modal-destination/modal-destination.component';
import { FlightModalTravelerOptionComponent } from '../flight-modal-traveler-option/flight-modal-traveler-option.component';
import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-flight-modal-research',
    templateUrl: './flight-modal-research.component.html',
    styleUrls: ['./flight-modal-research.component.scss']
})
export class FlightModalResearchComponent extends BaseChildComponent implements OnInit, OnDestroy {

    mainForm: FormGroup;                      // 폼
    @ViewChild('f') private formGroupDirective: FormGroupDirective;

    modalTravelerOption$: Observable<any>;    // 좌석등급, 인원 수
    modalOrigin$: Observable<any>;            // 목적지(출발)
    modalDestination$: Observable<any>;       // 목적지(도착)
    modalCalendar$: Observable<any>;          // 여행날짜
    searchMain$: Observable<any>;             // 항공메인(vm)

    destinationMdIndex: number = 0;           // 다구간 Index (여정 1,2,3,4)

    naviPath: any;                            // 네비게이션 이동경로

    rxAlive: any = true;                      // 구독 생명주기

    // 여행 타입
    tripType: any = [
        { code: 'RT', name: '왕복' },
        { code: 'OW', name: '편도' },
        { code: 'MD', name: '다구간' }
    ];


    vm: any = {
        tripTypeCode: 'RT', // 항공편 종류( 왕복 : RT, 편도 : OW, 다구간 : MT ) default : RT
        nonStop: false, // 직항 여부
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
                    dest: { name: '', val: '' }
                },
                {
                    date: '',
                    origin: { name: '', val: '' },
                    dest: { name: '', val: '' }
                }
            ]
        },
        // 좌석등급, 인원 수 ( 스토어 -> travelerStore)
        travelerStore: {
            cabinClassTxt: '일반석, 성인1',
            cabinClassCode: 'Y',
            adultCount: 1,
            childCount: 0,
            infantCount: 0
        }
    };

    // ngx-bootstrap config
    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

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

    ngOnInit() {
        super.ngOnInit();
        console.info('[ngOnInit | 검색조건 변경]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.storeFlightCommonInit(); // store > flight-common 초기화
        this.vmInit();                // vm 초기화(메인화면 선택(목적지, 날짜, 인원 수) 데이터)
        this.formInit();              // 폼 초기화
        this.storeInit();             // 스토어 초기화
        this.storeSubscribe();        // 스토어 구독
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
        console.info('[0. store > flight-common 초기화]');
        this.store.dispatch(clearFlightModalCalendars());
        this.store.dispatch(clearFlightModalDestinations());
    }

    vmInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(FlightMainSearchSelector.getSelectId(['flight-list-rq-info'])),
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[searchMain$ > subscribe]', ev);
                        if (ev) {
                            this.vm = _.cloneDeep(ev.option.vm);
                            // string to boolean
                            this.vm.nonStop = this.vm.nonStop === 'false' ? false : true;
                        }
                    }
                )
        );
    }

    storeInit() {
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

        /**
         * 여행날짜 스토어 셀렉트
         */
        this.modalCalendar$ = this.store.select(
            FlightModalCalendarSelector.getSelectId(['flight-calendar'])
        );

        /**
         * 좌석옵션 스토어 셀렉트
         */
        this.modalTravelerOption$ = this.store.select(
            FlightModalTravelerOptionSelector.getSelectId(['travelerOption'])
        );
    }

    storeSubscribe() {
        this.subscriptionList.push(
            // 여행 날짜
            this.modalCalendar$
                .pipe(takeWhile(() => this.rxAlive))
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
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
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
                    (ev: any) => {
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
                    (ev: any) => {
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
            console.log('다구간 여정셋팅');
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
                }
            }
        };

        console.info('[initialState]', initialState);

        this.bsModalService.show(ModalDestinationComponent, { initialState, ...this.configInfo });
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
                tripTypeCode: this.vm.tripTypeCode,                      // 여행종류(RT : 왕복, OW : 편도, MT : 다구간)
                adultCount: this.vm.travelerStore.adultCount,            // 성인(명) 수
                childCount: this.vm.travelerStore.childCount,            // 아동(명) 수
                infantCount: this.vm.travelerStore.infantCount,          // 유아(명) 수
                laborCount: 0,                                           // b2c에서 사용 안함..
                studentCount: 0,                                         // b2c에서 사용 안함..
                cabinClassCode: this.vm.travelerStore.cabinClassCode,    // 좌석등급
                deviceTypeCode: 'MA',                                    // MA: Mobile App, MW: Mobile Web, PC: PC
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
        // const base64Str = this.base64Svc.base64EncodingFun(rqInfo);
        const incodingOpt = {
            encodeValuesOnly: true
        };

        const queryString = qs.stringify(rqInfo, incodingOpt);
        let path = '/flight-search-result-go/';

        //항공(다구간)으로 이동
        if (this.vm.tripTypeCode === 'MD') {
            path = '/flight-search-result-multi/';
        }

        path += queryString;

        this.naviPath = path;

        this.modalClose();
    }

    validationAlert() {
        const initialState = {
            titleTxt: '검색조건이 모두 입력되지 않았습니다. 검색 조건을 확인해주세요.',
            closeObj: null
        };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...this.configInfo });
    }

    dateValSet(ev: any) {
        // 왕복
        if (this.vm.tripTypeCode === 'RT') {
            this.vm.trip.destination[0].date = ev.result.selectList[0];
            this.vm.trip.destination[1].date = ev.result.selectList[1];
            // from - to
            this.vm.trip.destination[0].dateRange = `${moment(ev.result.selectList[0]).format('MM.DD (ddd)')} - ${moment(ev.result.selectList[1]).format('MM.DD (ddd)')}`;
            // 편도
        } else if (this.vm.tripTypeCode === 'OW') {
            this.vm.trip.destination[0].date = ev.result.selectList[0];

            // 다구간
        } else {
            for (let i = 0; i < this.vm.trip.destination.length; i++) {
                this.vm.trip.destination[i].date = ev.result.selectList[i];
            }
            // from - to
            this.vm.trip.destination[0].dateRange = `${moment(ev.result.selectList[0]).format('MM.DD (ddd)')} - ${moment(ev.result.selectList[1]).format('MM.DD (ddd)')}`; // 다구간 -> 왕복으로 변경시 Range(다구간 구간 1,2가 표시됨)
        }
    }

    /**
     * 목적지 데이터 -> vm에 셋팅
     * @param $dest 선택한 목적지 데이터(도시코드, 공항코드)
     * @param option option => origin : 출발지, dest : 도착지
     */
    destValSet($dest, option: string) {
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
    }

    /**
     * 모달 닫기
     */
    modalClose() {
        this.bsModalRef.hide();
        console.log('modalClose()');
    }

    /**
     * 출발지 선택
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onOrigin($index: number) {
        this.destinationMdIndex = $index;
        console.info('[목적지 검색 | 가는날]');
        this.goToFlightModalDestination('IC01', 'origin');
    }

    /**
     * 도착지 선택
     * @param $index $index => 다구간 출/도착지 인덱스( 여정 1,2,3,4 )
     */
    onDestination($index: number) {
        this.destinationMdIndex = $index;
        console.info('[목적지 검색 | 오는날]');
        this.goToFlightModalDestination('IC01', 'destination');
    }

    onCalendar(calIdx?: number) {
        console.info('[달력 팝업]');

        const itemCategoryCode = 'IC01';
        const storeId = 'flight-calendar';

        const initialState: any = {
            storeCategoryType: StoreCategoryTypes.FLIGHT,
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

        // 왕복
        if (this.vm.tripTypeCode === 'RT') {
            initialState.totStep = 2;
            initialState.tabTxtList = ['가는날', '오는날'];
            // 편도
        } else if (this.vm.tripTypeCode === 'OW') {
            initialState.totStep = 1;
            initialState.tabTxtList = ['가는날'];
            // 다구간
        } else {
            _.forEach(this.vm.trip.destination, (val, idx) => {
                initialState.tabTxtList.push(`여정${idx + 1}`);
                initialState.totStep += 1;
            });
        }

        for (const [idx, val] of this.vm.trip.destination.entries()) {
            // 캘린더에 선택한 값이 있으면
            if (!_.isEmpty(this.vm.trip.destination[idx].date)) {

                initialState.selectList = [];
                initialState.step = 0;
            }
        }

        console.info('[initialState]', initialState);

        this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...this.configInfo });
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

        this.bsModalService.show(FlightModalTravelerOptionComponent, { initialState, ...this.configInfo });
    }

    /**
     * 항공편 선택( 왕복(RT), 편도(OW), 다구간(MT))
     * @param ticket
     */
    onTicketType(ticket: string) {
        if (this.vm.tripTypeCode !== ticket) {
            this.mainForm.reset();               // Reset form data
            this.formGroupDirective.resetForm(); // Reset the ugly validators
            this.vm.tripTypeCode = ticket;
            this.formInit();
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
     * 출발지 도착지 변경
     * @param changeItem
     */
    onChangeDest(changeItem: any) {
        const temp: any = changeItem.origin;
        changeItem.origin = changeItem.dest;
        changeItem.dest = temp;
    }

    onNonstop(e) {
        this.vm.nonStop = !this.vm.nonStop;
    }

    /**
     * 항공 검색(mainForm 전송)
     */
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
            this.validationAlert();
        }
    }
}
