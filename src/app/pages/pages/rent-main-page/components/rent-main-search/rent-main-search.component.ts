import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeWhile } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';

import { clearRentModalDestinations } from '@/app/store/rent-common/rent-modal-destination/rent-modal-destination.actions';
import { upsertRentMainSearch } from '@/app/store/rent-main-page/rent-main-search/rent-main-search.actions';
import { clearRentModalCalendars } from '@/app/store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';

import * as rentModalDestinationSelectors from '@/app/store/rent-common/rent-modal-destination/rent-modal-destination.selectors';
import * as rentModalCalendarSelectors from '@/app/store/rent-common/rent-modal-calendar/rent-modal-calendar.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as qs from 'qs';

import { RentUtilService } from '@/app/common-source/services/rent-com-service/rent-util.service';

import { environment } from '@/environments/environment';

import { DestinationState } from '@/app/common-source/enums/destination-state.enum';
import { CalendarState } from '@/app/common-source/enums/calendar-state.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { RentModalAmericaComponent } from '../../components/rent-modal-america/rent-modal-america.component';
import { RentModalCanadaComponent } from '../../components/rent-modal-canada/rent-modal-canada.component';
import { RentModalDemandsComponent } from '../../components/rent-modal-demands/rent-modal-demands.component';
import { RentModalEuropeComponent } from '../../components/rent-modal-europe/rent-modal-europe.component';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-rent-main-search',
    templateUrl: './rent-main-search.component.html',
    styleUrls: ['./rent-main-search.component.scss']
})
export class RentMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup; // 생성된 폼 저장

    /**
     * 캘린더 타임 | from
     */
    calendarTimeObjFrom: any = {
        typeId: 'from',
        state: CalendarState.IS_DEFAULT,
        left: 0,
        top: 0,
        initialState: null,
        closeEvt: this.onCanlendarTimeFromClose
    };

    /**
     * 캘린더 타임 | to
     */
    calendarTimeObjTo: any = {
        typeId: 'to',
        state: CalendarState.IS_DEFAULT,
        left: 0,
        top: 0,
        initialState: null,
        closeEvt: this.onCanlendarTimeToClose
    };

    // 도시검색 Rq
    majorDestinationRq: any = {
        rq: {
            currency: 'KRW',
            language: 'KO',
            stationTypeCode: environment.STATION_CODE,
            condition: {
                itemCategoryCode: 'IC03',
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
                itemCategoryCode: 'IC03',
                keyword: null,
                limits: [0, 20]
            }
        }
    };

    /**
     * 목적지 검색 : 도시검색 + 자동검색
     */
    destinationPickup: any = null;
    isDestinationPickup: boolean = null;

    destinationReturn: any = null;
    isDestinationReturn: boolean = null;


    vm: any = {
        locationAccept: null,
        locationReturn: null,
        locationReturnBool: true, // 동일한 장소에서 반납

        formDateStr: null, // 인수 날짜
        formTimeList: null,
        formTimeVal: '10:00',

        toDateStr: null, // 반납 날짜
        toTimeList: null,
        toTimeVal: '10:00',

        driverBirthday: null
    };

    rxAlive: boolean = true;
    modalDestinationPickup$: Observable<any>; // 인수장소
    modalDestinationReturn$: Observable<any>; // 반납장소
    modalCalendar$: Observable<any>; // 캘린더
    modalCalendarTimeFrom$: Observable<any>; // 캘린더
    modalCalendarTimeTo$: Observable<any>; // 캘린더

    ROUTER_LINK: any = {
        RENT: '/rent-main',
        FLIGHT: '/flight-main',
        HOTEL: '/hotel-main',
        AIRTEL: '/airtel-main',
        ACTIVITY: '/activity-main',
    };

    beforeCity: any;
    locationType: boolean = true;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public rentUtilSvc: RentUtilService,
        private bsModalService: BsModalService,
        private comValidS: CommonValidatorService,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.beforeCity = {};
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.storeRentCommonInit(); // store > rent-common 초기화
        this.destinationObjInit();
        this.vmInit(); // vm 초기화
        this.mainFormInit(); // 폼 초기화
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );

        this.rxAlive = false;
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
    }

    /**
     * vm 초기화
     */
    vmInit() {
        this.rxAlive = true;
        this.vm.locationAccept = {
            id: '',
            name: '',
            val: '',
            airports: []
        };
        this.vm.locationReturn = {
            id: '',
            name: '',
            val: '',
            airports: []
        };

        this.vm.formTimeList = this.rentUtilSvc.getSelectTimeList();
        this.vm.toTimeList = this.rentUtilSvc.getSelectTimeList();

        console.info('[vm]', this.vm);
    }

    /**
     * 옵져버블 초기화
     */
    observableInit() {
        this.modalDestinationPickup$ = this.store.pipe(
            select(rentModalDestinationSelectors.getSelectId(['pickup']))
        );

        this.modalDestinationReturn$ = this.store.pipe(
            select(rentModalDestinationSelectors.getSelectId(['return']))
        );

        // 캘린더
        this.modalCalendar$ = this.store.pipe(
            select(rentModalCalendarSelectors.getSelectId(['rent-main']))
        );

        // 인수 캘린더+시간
        this.modalCalendarTimeFrom$ = this.store.pipe(
            select(rentModalCalendarSelectors.getSelectId(['from']))
        );

        // 반납 캘린더+시간
        this.modalCalendarTimeTo$ = this.store.pipe(
            select(rentModalCalendarSelectors.getSelectId(['to']))
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
            this.modalDestinationPickup$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalDestinationPickup$ > subscribe]', ev);

                        if (ev) {
                            this.vm.locationAccept = ev;
                            this.mainForm.patchValue({
                                locationAccept: this.vm.locationAccept.name
                            });
                            this.isDestinationPickup = false;

                            this.changeLocationReturnBool();

                        }
                    }
                )

        );
        if (this.vm.locationAccept.countryCode === 'KR')
            this.locationType = true;
        else {
            this.locationType = false;
        }
        /**
         * 렌터카 반납 장소
         */
        this.subscriptionList.push(
            this.modalDestinationReturn$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalDestinationReturn$ > subscribe]', ev);
                        if (ev) {
                            this.vm.locationReturn = ev;
                            this.mainForm.patchValue({
                                locationReturn: this.vm.locationReturn.name
                            });
                            this.isDestinationReturn = false;
                        }
                    }
                )
        );

        /**
         * 인수날짜 ~ 반납날짜
         */
        this.subscriptionList.push(
            this.modalCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            this.vm.formDateStr = ev.result.selectList[0];
                            this.vm.toDateStr = ev.result.selectList[1];
                            this.mainForm.patchValue({
                                formDateStr: this.vm.formDateStr,
                                toDateStr: this.vm.toDateStr
                            });
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.modalCalendarTimeFrom$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendarTimeFrom$ > subscribe]', ev);
                        if (ev) {
                            this.vm.formDateStr = ev.result.selectList[0];
                            this.vm.formTimeVal = ev.result.timeVal;
                            this.mainForm.patchValue({
                                formDateStr: this.vm.formDateStr,
                                formTimeVal: this.vm.formTimeVal
                            });
                        }
                    }
                )
        );
        this.subscriptionList.push(
            this.modalCalendarTimeTo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendarTimeTo$ > subscribe]', ev);
                        if (ev) {
                            this.vm.toDateStr = ev.result.selectList[0];
                            this.vm.toTimeVal = ev.result.timeVal;
                            this.mainForm.patchValue({
                                toDateStr: this.vm.toDateStr,
                                toTimeVal: this.vm.toTimeVal
                            });
                        }
                    }
                )
        );
    }

    /**
     * 렌터카 이용목적 radio 다국어 처리
     */
    purposeListInit() {
        this.subscriptionList.push(
            this.translateService.getTranslation(this.translateService.getDefaultLang())
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        this.vm.purposeList[0].htmlTxt = ev.MAIN_SEARCH.PURPOSE_TRAVEL;
                        this.vm.purposeList[1].htmlTxt = ev.MAIN_SEARCH.PURPOSE_LEAVE;
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
            locationAccept: ['', Validators.required], // 렌터카 인수 장소
            locationReturn: ['', Validators.required], // 렌터카 반남 장소

            locationReturnBool: [this.vm.locationReturnBool], // 동일한 장소 반납 체크

            driverBirthday: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    this.comValidS.customPattern({ pattern: /^(((19|20)([2468][048]|[13579][26]|0[48])|2000)0229|((19|20)[0-9]{2}(0[4678]|1[02])(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}(0[1359]|11)(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}02(0[1-9]|1[0-9]|2[0-8])))/, msg: '입력한 형식이 올바르지 않습니다.' })
                ]
            ),
            driverBirthdayBool: new FormControl(true, [Validators.requiredTrue]),
            formDateStr: ['', Validators.required], // 인수 날짜
            formTimeVal: [this.vm.formTimeVal, Validators.required], // 선택한 인수 시간
            //
            toDateStr: ['', Validators.required], // 반납 날짜
            toTimeVal: [this.vm.toTimeVal, Validators.required], // 선택한 반납 시간


        });

        this.onFormValueChanges();

    }

    onFormValueChanges(): void {
        this.subscriptionList = [
            this.mainForm.get('driverBirthday').valueChanges
                .subscribe(
                    () => {
                        this.mainForm.get('driverBirthdayBool').patchValue(true);
                    }
                )
        ];
    }

    isValidError(fieldName: any, submitted: boolean): boolean {
        let validError: boolean;
        switch (fieldName) {
            case 'driverBirthday':
                validError = !_.isEmpty(this.mainForm.get('driverBirthday').errors || this.mainForm.get('driverBirthdayBool').errors);
                break;
            case 'formDateStr':
                validError = !_.isEmpty(this.mainForm.get('formDateStr').errors || this.mainForm.get('formTimeVal').errors);
                break;
            case 'toDateStr':
                validError = !_.isEmpty(this.mainForm.get('toDateStr').errors || this.mainForm.get('toTimeVal').errors);
                break;
            default:
                validError = !_.isEmpty(this.mainForm.get(fieldName).errors);
                break;
        }
        return validError && submitted;
    }

    customPatternValid(config: any): ValidatorFn {
        return (control: FormControl) => {
            const regExp: RegExp = config.pattern;
            console.info('[control.value >]', control.value);
            if (control.value && !String(control.value).match(regExp)) {
                return {
                    invalidMsg: config.msg
                };
            } else {
                return null;
            }
        };
    }
    /**
     * 3. 결과페이지로 페이지 이동
     */
    goToResultPage($form) {
        console.info('[goToResultPage]', this.vm.locationAccept, this.vm.locationReturn);

        const pickupDatetime = `${moment($form.value.formDateStr).format('YYYY-MM-DD')} ${$form.value.formTimeVal}`;
        const returnDatetime = `${moment($form.value.toDateStr).format('YYYY-MM-DD')} ${$form.value.toTimeVal}`;
        const driverBirthday = moment(String($form.value.driverBirthday)).format('YYYY-MM-DD');
        /**
         * 렌터카 결과 페이지 Request Data Model
         * environment.STATION_CODE
         */
        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                pickupCityCodeIata: this.vm.locationAccept.val,
                pickupDatetime: pickupDatetime,
                returnCityCodeIata: this.vm.locationReturn.val,
                returnDatetime: returnDatetime,
                driverBirthday: driverBirthday,
                limits: [0, 12],
                sortOrder: 'Recommend',
                filter: {}

            }
        };

        const rqInfo = {
            locationAccept: this.vm.locationAccept,
            locationReturn: this.vm.locationReturn,
            locationReturnBool: this.vm.locationReturnBool,
            formDateStr: this.vm.formDateStr, // 인수 날짜
            formTimeVal: this.vm.formTimeVal,
            toDateStr: this.vm.toDateStr, // 반납 날짜
            toTimeVal: this.vm.toTimeVal,
            driverBirthday: driverBirthday,
            rq: rq
        };

        if (this.vm.locationReturnBool) {
            rqInfo.rq.condition.returnCityCodeIata = rqInfo.rq.condition.pickupCityCodeIata;
            rqInfo.locationReturn = rqInfo.locationAccept;
        }

        console.info('[데이터 rqInfo]', rqInfo);

        const qsStr = qs.stringify(rqInfo);
        const path = '/rent-search-result/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    /**
     * 동일한 장소 반납 체크박스 변경시
     */
    changeLocationReturnBool() {
        console.info('[동일한 장소 반납 체크박스2]', this.vm.locationReturnBool);
        const tgLaInput = document.querySelector(`[data-target="tgLaInput"]`);
        const tgLrInput = document.querySelector(`[data-target="tgLrInput"]`);


        if (this.vm.locationReturnBool) {
            console.info('[this.vm.locationAccept 1]', this.vm.locationAccept);
            this.vm.locationReturn = this.vm.locationAccept;
            this.mainForm.patchValue({
                locationReturn: this.vm.locationAccept && this.vm.locationAccept.name
            });

            // this.mainForm.controls.locationReturn.setValidators(null);
            // this.mainForm.controls.locationReturn.updateValueAndValidity();
        } else {
            console.info('[this.vm.locationAccept 2]', this.vm.locationAccept);
            // this.mainForm.controls.locationReturn.setValidators([Validators.required]);
            // this.mainForm.controls.locationReturn.updateValueAndValidity();
        }
        if (this.vm.locationAccept.countryCode === 'KR')
            this.locationType = true;
        else {
            this.locationType = false;
        }
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertRentMainSearch({
            rentMainSearch: $obj
        }));
    }

    /**
     * store > rent-common 초기화
     */
    storeRentCommonInit() {
        console.info('[0. store > rent-common 초기화]');
        this.store.dispatch(clearRentModalDestinations());
        this.store.dispatch(clearRentModalCalendars());
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

        let ageBool: Boolean = false;
        /**
         * 인수일 기준 아래 기준 인 경우, Alert 출력
         * - 국내 : 만 21세 미만
         * - 해외 : 만 18세 미만
         */
        if (_.has(this.vm.locationAccept, 'countryCode')) {
            ageBool = this.comValidS.rentAgeValidator(
                $form.value.formDateStr,
                $form.value.driverBirthday,
                this.vm.locationAccept.countryCode
            );
        }

        if (ageBool) {
            this.mainForm.get('driverBirthdayBool').patchValue(false);
            this.inValidAlert('입력하신 연령 조건으로는 예약이 불가능합니다.');
            return false;
        } else {
            this.mainForm.get('driverBirthdayBool').patchValue(true);
        }

        if ($form.valid) {
            this.rxAlive = false;
            console.info('[1. 유효성 체크 성공]');
            this.goToResultPage($form); // 3. 결과페이지로 페이지 이동
        } else {
            let titleTxt = '검색조건이 모두 입력되지 않았습니다. 검색 조건을 확인해주세요.';
            let alertHtml: string;
            _.forEach($form.controls,
                ($val, $key) => {
                    if (!$val.valid) {
                        console.info('[$key | 유효성 체크 실패]', $key);
                        if ($key === 'driverBirthday') {
                            titleTxt = '입력하신 운전자의 생년월일이 잘못되었습니다.';
                            alertHtml = '다시 확인하시고 입력해주세요.';
                        }
                        return false;
                    }
                }
            );

            if (alertHtml)
                this.inValidAlert(titleTxt, alertHtml);
            else
                this.inValidAlert(titleTxt);

            return false;
        }

    } // end onSubmit

    inValidAlert(titleTxt, alertHtml?) {
        const initialState: any = {
            titleTxt: titleTxt,
            closeObj: { fun: () => { } },
        };

        if (alertHtml)
            initialState.alertHtml = alertHtml;

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
     * 동일한 장소 반납 체크박스
     * 유효성 체크 업데이트
     */
    onReturnChkClick() {
        console.info('[동일한 장소 반납 체크박스]', this.vm.locationReturnBool);
        (this.vm.locationReturnBool) ? this.vm.locationReturnBool = false : this.vm.locationReturnBool = true;
        this.changeLocationReturnBool();
    }

    /**
     * 인수날짜 클릭
     */
    onFromDateClick(e) {
        // this.isDestinationPickup = false;
        // this.isDestinationReturn = false;
        // this.calendarTimeObjTo.state = CalendarState.IS_DEFAULT;
        this.calendarTimeObjFrom.state = CalendarState.IS_OPEN;

        const tgWrapName = 'tg-wrap-date-time';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.calendarTimeObjFrom.top = tgWrap.clientHeight + 10;

        const tgDateTimeName = 'tg-form-date';
        const tgDateTime = document.querySelector(`[data-target="${tgDateTimeName}"]`);
        this.calendarTimeObjFrom.left = tgDateTime['offsetLeft'];
        this.openCalendarTimeFrom();
    }

    /**
     * 반납 날짜 클릭
     */
    onToDateClick(e) {
        console.info('[반납 날짜]', e);
        this.isDestinationPickup = false;
        this.isDestinationReturn = false;
        this.calendarTimeObjFrom.state = CalendarState.IS_DEFAULT;
        this.calendarTimeObjTo.state = CalendarState.IS_OPEN;

        const tgWrapName = 'tg-wrap-date-time';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.calendarTimeObjTo.top = tgWrap.clientHeight + 10;
        this.calendarTimeObjTo.left = 706;

        this.openCalendarTimeTo();
    }

    /**
     * 인수 캘린더 + 시간
     */
    openCalendarTimeFrom() {
        const itemCategoryCode = 'IC03';
        const storeId = 'from';


        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,

            step: 0,
            totStep: 1,
            tabTxtList: ['인수일'],
            selectList: [],
            timeList: this.vm.formTimeList,
            timeVal: '10:00',

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
            this.modalCalendarTimeFrom$
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendarTimeFrom$ > subscribe]', ev);

                        if (ev) {
                            initialState.step = ev.result.step;
                            initialState.totStep = ev.result.totStep;
                            initialState.tabTxtList = ev.result.tabTxtList;
                            initialState.selectList = ev.result.selectList;
                            initialState.timeList = ev.result.timeList;
                            initialState.timeVal = ev.result.timeVal;
                            console.info('[initialState 2]', initialState);
                        }
                        this.calendarTimeObjFrom.initialState = initialState;
                        if (!_.isEmpty(initialState.selectList)) {
                            initialState.selectList = [];
                            initialState.step = 0;
                        }

                    }
                )
        );
    }

    /**
     * 반납 캘린더 + 시간
     */
    openCalendarTimeTo() {
        const itemCategoryCode = 'IC03';
        const storeId = 'to';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,

            step: 0,
            totStep: 1,
            tabTxtList: ['반납일'],
            selectList: [],
            timeList: this.vm.formTimeList,
            timeVal: '10:00',

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
            this.modalCalendarTimeTo$
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendarTimeTo$ > subscribe]', ev);

                        if (ev) {
                            initialState.step = ev.result.step;
                            initialState.totStep = ev.result.totStep;
                            initialState.tabTxtList = ev.result.tabTxtList;
                            initialState.selectList = ev.result.selectList;
                            initialState.timeList = ev.result.timeList;
                            initialState.timeVal = ev.result.timeVal;
                            console.info('[initialState 2]', initialState);
                        }

                        this.calendarTimeObjTo.initialState = initialState;

                        if (!_.isEmpty(initialState.selectList)) {
                            initialState.selectList = [];
                            initialState.step = 0;
                        }
                    }
                )
        );
    }

    //------------------------------[목적지 검색]
    /**
     * 목적지 검색 데이터 초기화
     */
    destinationObjInit() {
        console.info('[destinationObjInit]');
        this.destinationPickup = {
            storeCategoryType: 'RENT', // 카테고리 선택 | FLIGHT, HOTEL, AIRTEL, RENT, ACTIVITY, MY
            state: null,
            storeId: null,
            inputId: null,
            left: 0,
            top: 0,
            initialState: null,
            closeEvt: null,
            majorDestinationRq: this.majorDestinationRq,
            destinationRq: this.destinationRq
        };

        this.destinationReturn = {
            storeCategoryType: 'RENT', // 카테고리 선택 | FLIGHT, HOTEL, AIRTEL, RENT, ACTIVITY, MY
            state: null,
            storeId: null,
            inputId: null,
            left: 0,
            top: 0,
            initialState: null,
            closeEvt: null,
            majorDestinationRq: this.majorDestinationRq,
            destinationRq: this.destinationRq
        };
    }

    /**
     * 목적지 검색 | 인수 장소 | focus
     */
    onDestinationPickupFocus(e) {
        console.info('[onDestinationPickupFocus]', this.isDestinationPickup);
        this.calendarTimeObjTo.state = CalendarState.IS_DEFAULT;
        this.calendarTimeObjFrom.state = CalendarState.IS_DEFAULT;

        // 데이터 초기화
        this.beforeCity.pickUp = _.cloneDeep(this.vm.locationAccept);
        this.destinationObjInit();
        e.target.value = '';

        // 폼 데이터 초기화
        this.vm.locationAccept = null;
        this.mainForm.patchValue({
            locationAccept: ''
        });

        // 데이터 셋팅
        this.destinationPickup.storeId = 'pickup'; // pickup, return
        this.destinationPickup.inputId = 'tgLaInput'; // tgLaInput, tgLrInput
        this.destinationPickup.top = 0;
        this.destinationPickup.state = DestinationState.IS_CITY;

        const tgWrapName = 'tg-wrap-date-time';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.destinationPickup.top = tgWrap.clientHeight + 10;

        this.isDestinationPickup = true;
    }

    onDestinationPickupKeyup(e) {
        console.info('[onDestinationPickupKeyup]', this.destinationPickup, e.target.value.length);
        const tgVal = e.target.value;
        if (tgVal.length === 0) {  // 도시검색
            this.destinationPickup.state = DestinationState.IS_CITY;
        } else if (tgVal.length > 0) { // 자동검색
            this.destinationPickup.state = DestinationState.IS_AUTO;
        }
    }

    /**
     * 목적지 검색 | 반납 장소 | focus
     */
    onDestinationReturnFocus(e) {
        console.info('[onDestinationReturnFocus]', this.destinationReturn);
        this.calendarTimeObjTo.state = CalendarState.IS_DEFAULT;
        this.calendarTimeObjFrom.state = CalendarState.IS_DEFAULT;

        // 데이터 초기화
        this.beforeCity.return = _.cloneDeep(this.vm.locationReturn);
        this.destinationObjInit();
        e.target.value = '';

        // 폼 데이터 초기화
        this.vm.locationReturn = null;
        this.mainForm.patchValue({
            locationReturn: ''
        });

        // 데이터 셋팅
        this.destinationReturn.storeId = 'return'; // pickup, return
        this.destinationReturn.inputId = 'tgLrInput'; // tgLaInput, tgLrInput
        this.destinationReturn.top = 0;
        this.destinationReturn.state = DestinationState.IS_CITY;

        const tgWrapName = 'tg-wrap-date-time';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.destinationReturn.top = tgWrap.clientHeight + 10;

        this.isDestinationReturn = true;
    }

    onDestinationReturnKeyup(e) {
        console.info('[onDestinationReturnKeyup]', this.destinationReturn, e.target.value.length);
        const tgVal = e.target.value;
        if (tgVal.length === 0) {  // 도시검색
            this.destinationReturn.state = DestinationState.IS_CITY;
        } else if (tgVal.length > 0) { // 자동검색
            this.destinationReturn.state = DestinationState.IS_AUTO;
        }
    }

    onDestinationClose(e?) {
        this.isDestinationPickup = false;
        this.isDestinationReturn = false;
        this.vm.locationAccept = _.cloneDeep(this.beforeCity.pickUp);
        this.vm.locationReturn = _.cloneDeep(this.beforeCity.return);

        if (_.has(this.vm.locationAccept, 'name')) {
            this.mainForm.patchValue({
                locationAccept: this.vm.locationAccept.name
            });
        }

        if (_.has(this.vm.locationReturn, 'name')) {
            this.mainForm.patchValue({
                locationReturn: this.vm.locationReturn.name
            });
        }

        this.changeLocationReturnBool();
    }

    //------------------------------[end 목적지 검색]

    //------------------------------[캘린더]
    onCanlendarTimeFromClose($ctx) {
        $ctx.calendarTimeObjFrom.state = CalendarState.IS_DEFAULT;
    }

    onCanlendarTimeToClose($ctx) {
        $ctx.calendarTimeObjTo.state = CalendarState.IS_DEFAULT;
    }

    //------------------------------[end 캘린더]
    demandClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalDemandsComponent, { initialState, ...configInfo });
    }
    americaClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalAmericaComponent, { initialState, ...configInfo });
    }
    canadaClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalCanadaComponent, { initialState, ...configInfo });
    }
    europeClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalEuropeComponent, { initialState, ...configInfo });
    }

}
