import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertHotelMainSearch } from '@/app/store/hotel-main-page/hotel-main-search/hotel-main-search.actions';
import { clearHotelModalDestinations } from '@/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
import { clearHotelModalCalendars } from '@/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { clearHotelModalTravelerOptions } from '@/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';

import * as hotelModalDestinationSelectors from '@/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.selectors';
import * as hotelModalCalendarSelectors from '@/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.selectors';
import * as hotelModalTravelerOptionSelectors from '@/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as qs from 'qs';

import { HotelComService } from '@/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { environment } from '@/environments/environment';

//enum
import { DestinationState } from '@/app/common-source/enums/destination-state.enum';
import { CalendarState } from '@/app/common-source/enums/calendar-state.enum';
import { HotelSearchType } from '@/app/common-source/enums/hotel-search-type.enum';

//store
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-hotel-main-search',
    templateUrl: './hotel-main-search.component.html',
    styleUrls: ['./hotel-main-search.component.scss']
})
export class HotelMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup;
    calendarInfo: any;
    headerType: any;
    headerConfig: any;

    // 캘린더
    calendarObj: any = {
        storeCategoryType: 'HOTEL',
        typeId: null,
        state: CalendarState.IS_DEFAULT,
        right: 0,
        top: 0,
        initialState: null,
        closeEvt: this.onCalendarClose
    };

    // 도시검색 Rq
    majorDestinationRq: any = {
        rq: {
            currency: 'KRW',
            language: 'KO',
            stationTypeCode: environment.STATION_CODE,
            condition: {
                itemCategoryCode: 'IC02',
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
                itemCategoryCode: 'IC02',
                keyword: null,
                limits: [0, 20]
            }
        }
    };

    // 여행자 옵션
    travelerObj: any = {
        state: CalendarState.IS_DEFAULT,
        position: 'absolute',
        zIndex: 1000,
        right: 0,
        top: 0,
        childAgeList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        closeEvt: this.onTravelerClose
    };


    /**
     * 목적지 검색 : 도시검색 + 자동검색
     */
    destinationObj: any = null;


    vm: any = {
        city: null,
        calendarState: null,
        checkInOut: null,
        checkInOutStr: null,
        travelerOption: null,
        travelerInfo: null
    };



    rxAlive: boolean = true;
    isBlurClose: boolean = true;
    modalDestination$: Observable<any>; // 인수장소
    modalCalendar$: Observable<any>; // 캘린더
    modalTravelerOption$: Observable<any>; //인원 선택

    beforeCity: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private bsModalService: BsModalService,
        private comService: HotelComService,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        console.info('[ngOnInit > 호텔 메인]');
        super.ngOnInit();
        this.storeHotelCommonInit(); // store > hotel-common 초기화
        this.destinationObjInit();
        this.vmInit();
        this.mainFormInit(); //폼 초기화
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
    }

    /**
     * vm 초기화
     */
    vmInit() {
        this.rxAlive = true;
        this.vm.city = {
            id: '',
            nameLn: '',
            nameEn: '',
            val: '',
            airports: []
        };

        //체크인, 체크아웃
        this.vm.checkInOut = {
            in: '',
            out: ''
        };
        //객실, 인원 옵션
        this.vm.travelerOption = {
            id: '',
            roomList: '2^0^'
        };
        this.vm.travelerInfo = this.comService.getTravelerInfo(this.vm.travelerOption.roomList);

        console.info('[vm]', this.vm);

    }

    /**
    * 옵져버블 초기화
    */
    observableInit() {
        this.modalDestination$ = this.store.pipe(
            select(hotelModalDestinationSelectors.getSelectId(['hotelCity']))
        );

        // 캘린더
        this.modalCalendar$ = this.store.pipe(
            select(hotelModalCalendarSelectors.getSelectId(['hotel-main']))
        );

        this.modalTravelerOption$ = this.store.pipe(
            select(hotelModalTravelerOptionSelectors.getSelectId(['hotelTraveler']))
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        /**
         * 렌터카 인수 장소
         */
        this.subscriptionList.push(
            this.modalDestination$
                .pipe(takeWhile(val => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalDestination$ > subscribe]', ev);
                        if (ev) {
                            this.vm.city = _.cloneDeep(ev);
                            this.beforeCity = _.cloneDeep(ev);

                            this.mainForm.patchValue({
                                hotelCity: this.vm.city,
                                hotelCityName: ev.name
                            });

                            this.destinationObj.state = DestinationState.IS_DEFAULT;
                        }
                    }
                )
        );

        /**
         * 인수날짜 ~ 반납날짜
         */
        this.subscriptionList.push(
            this.modalCalendar$
                .pipe(takeWhile(val => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            const checkDate = _.cloneDeep(ev.result);
                            const lang = this.translateService.getDefaultLang();
                            const chkIn = moment(checkDate.selectList[0], 'YYYY-MM-DD');
                            const chkOut = moment(checkDate.selectList[1], 'YYYY-MM-DD');
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

                            this.vm.checkInOut.in = moment(String(checkDate.selectList[0])).format('YYYY-MM-DD');
                            this.vm.checkInOut.out = moment(String(checkDate.selectList[1])).format('YYYY-MM-DD');
                            this.vm.checkInOutStr = moment(checkDate.selectList[0].toString()).locale(lang).format('MM/DD (ddd)');
                            this.vm.checkInOutStr += '-';
                            this.vm.checkInOutStr += moment(checkDate.selectList[1].toString()).locale(lang).format('MM/DD (ddd)');
                            this.vm.checkInOutStr += ', ' + dayDiff + dayTxt;
                            console.info('[modalCalendar$ > subscribe] checkInOutStr : ', this.vm.checkInOutStr);
                            this.mainForm.patchValue({
                                checkInOut: this.vm.checkInOut,
                                checkInOutStr: this.vm.checkInOutStr
                            });
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.modalTravelerOption$
                .pipe(takeWhile(val => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelModalTravelerOption$ > subscribe]', ev);
                        if (ev) {
                            this.vm.travelerOption = _.cloneDeep(ev);
                            this.vm.travelerInfo = this.comService.getTravelerInfo(this.vm.travelerOption.roomList);
                            this.mainForm.patchValue({
                                travelerOption: this.vm.travelerOption,
                                travelerInfo: this.vm.travelerInfo
                            });
                        }
                    }
                )
        );
    }

    /**
     * 폼 초기화
     */
    mainFormInit() {
        this.mainFormCreate();
    }

    /**
     * 폼 생성
     * 빌더를 통해 폼을 생성한다.
     * key : html에서 [formControlName] 통해 전달 받은 문자열과 맵핑한다.
     * value : 셋팅할 데이터 정의 한다.
     *
     */
    mainFormCreate() {
        this.mainForm = this.fb.group({
            hotelCity: ['', Validators.required], // 목적지
            hotelCityName: ['', Validators.required], // 목적지 name
            checkInOut: ['', Validators.required],
            checkInOutStr: ['', Validators.required],
            travelerOption: [this.vm.travelerOption, Validators.required],
            travelerInfo: [this.vm.travelerInfo, Validators.required]
        });

    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelMainSearch({
            hotelMainSearch: $obj
        }));
    }

    /**
     * store > Hotel-common 초기화
     */
    storeHotelCommonInit() {
        console.info('[0. store > Hotel-common 초기화]');
        this.store.dispatch(clearHotelModalDestinations());
        this.store.dispatch(clearHotelModalCalendars());
        this.store.dispatch(clearHotelModalTravelerOptions());
    }

    msgAlert($titleTxt) {
        const initialState = {
            titleTxt: $titleTxt,
            okObj: {
                fun: () => {
                    // this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                    //   () => {
                    //     this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                    //   });
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

    /**
     * 1. 유효성 체크
     * 2. vm 스토어에 저장
     * 3. 결과페이지로 페이지 이동
     * @param $form
     */
    onSubmit($form: any) {
        console.info('[onSubmit]', $form, $form.value);
        console.info('[vm]', this.vm);

        if ($form.valid) {
            this.rxAlive = false;
            console.info('[1. 유효성 체크 성공]');

            const codeName = this.vm.city.codeName;
            if (codeName == 'hotels') {
                // 3. 호텔 룸타입 선택 페이지 이동
                this.comService.onDstinationHotelDtl(this.vm, false);
            } else {
                // 3. 결과페이지로 페이지 이동
                this.goToResultPage($form);
            }

        } else {
            const msg = '검색조건이 모두 입력되지 않았습니다.<br>검색 조건을 확인해주세요.';
            this.msgAlert(msg);
            _.forEach($form.controls,
                ($val, $key) => {
                    if (!$val.valid) {
                        console.info('[$key | 유효성 체크 실패]', $key);
                        switch ($key) {
                            case 'hotelCity':
                                console.info('도시');
                                break;
                            case 'hotelCityName':
                                console.info('도시');
                                break;
                            case 'checkInOut':
                                console.info('체크인 / 체크아웃');
                                break;
                            case 'checkInOutStr':
                                console.info('체크인 / 체크아웃');
                                break;
                            case 'travelerOption':
                                console.info('객실 or 여행자 옵션');
                                break;
                            case 'travelerInfo':
                                console.info('객실 or 여행자 옵션');
                                break;
                        }
                        return false;
                    }

                }
            );
        }

        return false;
    } // end onSubmit


    goToResultPage($form) {
        console.info('goToResultPage' + $form.value);
        const checkInDate = `${moment($form.value.checkInOut.in).format('YYYY-MM-DD')}`;
        const checkOutDate = `${moment($form.value.checkInOut.out).format('YYYY-MM-DD')}`;
        /**
         * 호텔 결과 페이지 Request Data Model
         * environment.STATION_CODE
         */

        const rqInfo = {
            city: _.omit(this.vm.city, 'id'),
            chkIn: this.vm.checkInOut.in,
            chkOut: this.vm.checkInOut.out,
            roomList: this.vm.travelerOption.roomList,
            limits: [0, 10]
        };

        // const rqInfo2 = {
        //   cVal: this.vm.city.val,
        //   cCodeName: this.vm.city.codeName,
        //   cNameEn: this.vm.city.nameEn,
        //   cNameLn: this.vm.city.nameLn,
        //   in: this.vm.checkInOut.in,
        //   out: this.vm.checkInOut.out,
        //   room: this.vm.travelerOption.roomList
        // };
        console.info('[데이터 rqInfo]', rqInfo);

        const qsStr = qs.stringify(rqInfo);
        const path = '/hotel-search-result/' + qsStr;
        this.router.navigate([path], { relativeTo: this.route });
    }



    //------------------------------[목적지 검색]
    /**
     * 목적지 검색 데이터 초기화
     */
    destinationObjInit() {
        console.info('[destinationObjInit]');
        this.destinationObj = {
            storeCategoryType: 'HOTEL', // 카테고리 선택 | FLIGHT, HOTEL, AIRTEL, RENT, ACTIVITY, MY
            state: null,
            storeId: null,
            inputId: null,
            left: 0,
            top: 0,
            initialState: null,
            closeEvt: this.onDestinationClose,
            majorDestinationRq: this.majorDestinationRq,
            destinationRq: this.destinationRq
        };
    }

    onDestinationFocus(e) {
        console.info('onDestinationFocus', e);
        // 열린창 닫기
        this.closeOpenModals(HotelSearchType.FORM_DESTINATION);

        // 데이터 초기화
        this.beforeCity = _.cloneDeep(this.vm.city);
        this.destinationObjInit();
        e.target.value = '';


        // 폼 데이터 초기화
        this.vm.city = null;
        this.mainForm.patchValue({
            hotelCity: '',
            hotelCityName: ''
        });

        // 데이터 셋팅
        this.destinationObj.storeId = 'hotelCity'; // pickup, return
        this.destinationObj.inputId = 'tgDesInput'; // tgDesInput
        this.destinationObj.top = 0;
        this.destinationObj.state = DestinationState.IS_CITY;

        const tgWrapName = 'tg-search-area-form';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.destinationObj.top = tgWrap.clientHeight + 107;
    }

    onDestinationKeyup(e) {
        console.info('[onDestinationPickupKeyup]', this.destinationObj, e.target.value.length);
        const tgVal = e.target.value;
        if (tgVal.length === 0) {  // 도시검색
            this.destinationObj.state = DestinationState.IS_CITY;
        } else if (tgVal.length > 0) { // 자동검색
            this.destinationObj.state = DestinationState.IS_AUTO;
        }
    }

    onDestinationClose(event?: any) {
        event && event.preventDefault();
        this.vm.city = _.cloneDeep(this.beforeCity);

        if (_.has(this.beforeCity, 'name')) {
            this.mainForm.patchValue({
                hotelCity: this.beforeCity,
                hotelCityName: this.beforeCity.name
            });
        } else {
            this.mainForm.patchValue({
                hotelCity: '',
                hotelCityName: ''
            });
        }

        this.destinationObj.state = DestinationState.IS_DEFAULT;
    }

    onDesMouseout() {
        console.info('[onDesMouseout]');
        this.isBlurClose = false;
    }

    onDesMouseleave() {
        console.info('[onDesMouseleave]');
        this.isBlurClose = true;
        console.info('>>>>>>> onDesMouseleave', this.isBlurClose);
    }
    //------------------------------[end 목적지 검색]

    //------------------------------[캘린더]
    /**
    * 여행 일정
    */
    onDateClick(e) {
        console.info('[여행 일정]', e);
        //열린창 닫기
        this.closeOpenModals(HotelSearchType.FORM_CALENDAR);

        this.calendarObj.typeId = 'from';
        this.calendarObj.state = CalendarState.IS_OPEN;

        const tgWrapName = 'tg-search-area-form';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.calendarObj.top = tgWrap.clientHeight + 107;
        this.openCalendar(0);
    }

    /**
     * 달력 팝업
     */
    openCalendar($tgNum) {
        console.info('[달력 팝업 > $tgNum]', $tgNum);

        const itemCategoryCode = 'IC02';
        const storeId = 'hotel-main';

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

        console.info('[initialState]', initialState);

        this.subscriptionList.push(
            this.modalCalendar$
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            initialState.step = $tgNum;
                            initialState.totStep = ev.result.totStep;
                            initialState.tabTxtList = ev.result.tabTxtList;
                            initialState.selectList = _.slice(ev.result.selectList, 0, $tgNum);
                            console.info('[initialState 2]', initialState);
                        }

                        this.calendarObj.initialState = initialState;
                    }
                )
        );

    }
    onCalendarClose($ctx) {
        console.info('[onCalendarClose]');
        $ctx.calendarObj.state = CalendarState.IS_DEFAULT;
    }
    //------------------------------[end 캘린더]

    //------------------------------[여행자 옵션]
    onTravelerClick(e) {
        console.info('[여행자 옵션]', e);

        // 열린창 닫기
        this.closeOpenModals(HotelSearchType.FORM_TRAVELER);

        this.travelerObj.state = CalendarState.IS_OPEN;

        const tgWrapName = 'tg-search-area-form';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.travelerObj.top = tgWrap.clientHeight + 107;
    }

    onTravelerClose($ctx) {
        console.info('[onTravelerClose]');
        $ctx.travelerObj.state = CalendarState.IS_DEFAULT;
    }
    //------------------------------[end 여행자 옵션]

    clickOutsideDest(event?: any) {
        event && event.preventDefault();
        this.onDestinationClose();
    }

    private closeOpenModals(type: any) {
        const searchType = _.cloneDeep(type);
        if (searchType !== HotelSearchType.FORM_DESTINATION) this.onDestinationClose();

        if (searchType !== HotelSearchType.FORM_CALENDAR) this.onCalendarClose(this);

        if (searchType !== HotelSearchType.FORM_TRAVELER) this.onTravelerClose(this);
    }
}
