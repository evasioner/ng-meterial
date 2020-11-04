import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@/environments/environment';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as rentModalDestinationSelectors from '../../../../store/rent-common/rent-modal-destination/rent-modal-destination.selectors';
import * as rentModalCalendarSelectors from '../../../../store/rent-common/rent-modal-calendar/rent-modal-calendar.selectors';
import { take, takeWhile } from 'rxjs/operators';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { clearRentModalDestinations } from '../../../../store/rent-common/rent-modal-destination/rent-modal-destination.actions';
import { RentUtilService } from '../../../../common-source/services/rent-com-service/rent-util.service';
import { clearRentModalCalendars } from '../../../../store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';
import { ModalDestinationComponent } from '@/app/common-source/modal-components/modal-destination/modal-destination.component';

import * as qs from 'qs';
import { CommonModalCalendarComponent } from '../../../../common-source/modal-components/common-modal-calendar/common-modal-calendar.component';
import { StoreCategoryTypes } from '../../../../common-source/enums/store-category-types.enum';
import { CommonModalAlertComponent } from '../../../../common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { upsertRentMainSearch, clearRentMainSearchs } from '../../../../store/rent-main-page/rent-main-search/rent-main-search.actions';
import * as rentMainSearchSelectors from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.selectors';
import { upsertRentModalCalendar } from 'src/app/store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';

@Component({
    selector: 'app-rent-main-search',
    templateUrl: './rent-main-search.component.html',
    styleUrls: ['./rent-main-search.component.scss']
})
export class RentMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup; // 생성된 폼 저장

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

    bsModalRef: BsModalRef;

    private subscriptionList: Subscription[];

    locationType: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        public rentUtilSvc: RentUtilService,
        private bsModalService: BsModalService,
        private comValidator: CommonValidatorService
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        const compare = ['under', 'below', 'above', 'unequal'];
        console.info('compare',
            _.find(compare, (val) => {
                const str = 'above';
                return val === str;
            }));
        this.storeRentCommonInit(); // store > rent-common 초기화
        this.vmInit(); // vm 초기화
        this.mainSearchAgainInit();
        this.mainFormInit(); // 폼 초기화
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
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
        console.info('[vm 초기화 222]');
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

    }

    /**
     * 검색 결과 >  에러 > 다시 검색 클릭 >  메인 이동 시,
     * store 저장된 데이터 불러오기
     * 1. search form 데이터 세팅
     * 2. store clear
     */
    mainSearchAgainInit() {
        this.subscriptionList.push(
            this.store.pipe(
                select(rentMainSearchSelectors.getSelectId('rent-search-again')),
                takeWhile(() => this.rxAlive)
            )
                .subscribe(
                    (ev: any) => {
                        console.info('rentMainSearchSelectors', ev);
                        if (ev) {
                            const search: any = _.cloneDeep(ev.search);
                            ///--- 1. search form 데이터 세팅----------------------------------
                            //인수장소 / 반납장소
                            this.vm.locationAccept = search.locationAccept;
                            this.vm.locationReturn = search.locationReturn;
                            //동일한 장소에서 반납 true or false
                            this.vm.locationReturnBool = _.isEqual(search.locationAccept, search.locationReturn);


                            //대여일, 반납일 store upsert
                            const calObj: any = {
                                id: 'rent-main',
                                result: {
                                    step: 2,
                                    totStep: 2,
                                    tabTxtList: ['대여일', '반납일'],
                                    selectList: [search.formDateStr, search.toDateStr]
                                }
                            };
                            this.store.dispatch(upsertRentModalCalendar({
                                rentModalCalendar: calObj
                            }));

                            //생년월일
                            const birthday = moment(search.driverBirthday);
                            this.vm.driverBirthday = birthday.format('YYYYMMDD');

                            ///--- 2. store clear ----------------------------------
                            this.store.dispatch(clearRentMainSearchs());
                        }
                    }
                )
        );
    }

    /**
     * 옵져버블 초기화
     */
    observableInit() {
        this.modalDestinationPickup$ = this.store
            .pipe(select(rentModalDestinationSelectors.getSelectId(['pickup'])));
        this.modalDestinationReturn$ = this.store
            .pipe(select(rentModalDestinationSelectors.getSelectId(['return'])));
        // 캘린더
        this.modalCalendar$ = this.store
            .pipe(select(rentModalCalendarSelectors.getSelectId(['rent-main'])));
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
                            setTimeout(() => {
                                this.changeLocationReturnBool();
                            });

                        }
                        if (this.vm.locationAccept.countryCode === 'KR')
                            this.locationType = true;
                        else {
                            this.locationType = false;
                        }
                    }
                )
        );

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
            locationAccept: [this.vm.locationAccept.val, Validators.required], // 렌터카 인수 장소
            locationReturn: [this.vm.locationReturn.val, Validators.required], // 렌터카 반남 장소

            locationReturnBool: [this.vm.locationReturnBool], // 동일한 장소 반납 체크

            formDateStr: [this.vm.formDateStr, Validators.required], // 인수 날짜
            formTimeVal: [this.vm.formTimeVal, Validators.required], // 선택한 인수 시간

            toDateStr: [this.vm.toDateStr, Validators.required], // 반납 날짜
            toTimeVal: [this.vm.toTimeVal, Validators.required], // 선택한 반납 시간

            driverBirthday: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    this.comValidator.customPattern({ pattern: /^(((19|20)([2468][048]|[13579][26]|0[48])|2000)0229|((19|20)[0-9]{2}(0[4678]|1[02])(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}(0[1359]|11)(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}02(0[1-9]|1[0-9]|2[0-8])))/, msg: '입력한 형식이 올바르지 않습니다.' })
                ]
            ),
            driverBirthdayBool: new FormControl(true, [Validators.requiredTrue])
        });

        this.onFormValueChanges();
    }

    onFormValueChanges(): void {
        this.subscriptionList.push(
            this.mainForm.get('driverBirthday').valueChanges
                .subscribe(
                    () => {
                        this.mainForm.get('driverBirthdayBool').patchValue(true);
                    }
                )
        );
    }

    isValidError(fieldName: any, submitted: boolean): boolean {
        let validError: boolean;
        if (_.isEqual(fieldName, 'driverBirthday'))
            validError = !_.isEmpty(this.mainForm.get('driverBirthday').errors || this.mainForm.get('driverBirthdayBool').errors);
        else
            validError = !_.isEmpty(this.mainForm.get(fieldName).errors);
        return validError && submitted;
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
                limits: [0, 10],
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
        console.info('[동일한 장소 반납 체크박스]', this.vm.locationReturnBool);
        const bool: boolean = this.mainForm.controls.locationReturnBool.value;
        this.vm.locationReturnBool = bool;
        if (bool) {
            this.vm.locationReturn = this.vm.locationAccept;
            this.mainForm.patchValue({
                locationReturn: this.vm.locationAccept.name
            });
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

    doAlert($str: string, alertHtml?) {
        const initialState: any = {
            titleTxt: $str,
            closeObj: null
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

    onFromTimeChange(e) {
        console.info('[onfromTimeChange]', e.target.value);
        const temp = e.target.value;
        const start = temp.indexOf(' ');
        const val = temp.substring(start + 1);
        this.vm.formTimeVal = val;
        // console.info('[start]', start);
        // console.info('[val]', val);
    }

    onToTimeChange(e) {
        console.info('[onfromTimeChange]', e.target.value);
        const temp = e.target.value;
        const start = temp.indexOf(' ');
        const val = temp.substring(start + 1);
        this.vm.toTimeVal = val;
        // console.info('[start]', start);
        // console.info('[val]', val);
    }

    /**
     * 1. 유효성 체크
     * 2. vm 스토어에 저장
     * 3. 결과페이지로 페이지 이동
     * @param $form
     */
    onSubmit($form: any) {

        setTimeout(() => {

            console.info('[onSubmit]', $form, $form.value);
            console.info('[vm]', this.vm);

            let ageBool: Boolean = false;
            /**
             * 인수일 기준 아래 기준 인 경우, Alert 출력
             * - 국내 : 만 21세 미만
             * - 해외 : 만 18세 미만
             */
            if (_.has(this.vm.locationAccept, 'countryCode')) {
                ageBool = this.comValidator.rentAgeValidator(
                    $form.value.formDateStr,
                    $form.value.driverBirthday,
                    this.vm.locationAccept.countryCode
                );
            }

            if (ageBool) {
                this.mainForm.get('driverBirthdayBool').patchValue(false);
                this.doAlert('입력하신 연령 조건으로는 예약이 불가능합니다.');
                return false;
            } else {
                this.mainForm.get('driverBirthdayBool').patchValue(true);
            }

            if ($form.valid) {

                this.rxAlive = false;
                console.info('[1. 유효성 체크 성공]');
                console.info('[driverBirthday]', $form.value.driverBirthday);
                console.info('[driverBirthday 2]', moment(String($form.value.driverBirthday)).format('YYYY-MM-DD'));
                this.goToResultPage($form); // 3. 결과페이지로 페이지 이동

            } else {

                let titleTxt = '검색조건이 모두 입력되지 않았습니다. 검색 조건을 확인해주세요.';
                _.forEach($form.controls,
                    ($val, $key) => {
                        if (!$val.valid) {
                            console.info('[$key | 유효성 체크 실패]', $key);
                            if ($key === 'driverBirthday') {
                                titleTxt = '입력하신 운전자의 생년월일이 잘못되었습니다. 다시 확인하시고 입력해주세요.';
                            }
                            return false;

                        }
                    }
                );

                this.doAlert(titleTxt);
                return false;
            }

        }); // end setTimeout

    } // end onSubmit

    /**
     * 렌터카 인수 장소 검색 클릭
     */
    onLocationAcceptClick() {
        console.info('[렌터카 인수 장소 검색 클릭]');

        /**
         * 아이템 카테고리 코드
         * IC01 항공
         * IC02 호텔
         * IC03 렌터카
         * IC04 액티비티
         * IC05 일정표
         */
        const itemCategoryCode = 'IC03';
        const storeId = 'pickup';

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
     * 렌터카 반납 장소 검색 클릭
     */
    onLocationReturnClick() {
        console.info('[렌터카 반납 장소 검색 클릭]');

        const itemCategoryCode = 'IC03';
        const storeId = 'return';

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
     * 동일한 장소 반납 체크박스
     * 유효성 체크 업데이트
     */
    onReturnChkClick() {
        setTimeout(() => {
            console.info('[동일한 장소 반납 체크박스]', this.vm.locationReturnBool);
            this.changeLocationReturnBool();
        });
    }

    /**
     * 인수날짜 클릭
     */
    onFromDateClick() {
        console.info('[인수 날짜]');
        this.openCalendar(0);
    }

    /**
     * 반납 날짜 클릭
     */
    onToDateClick() {
        console.info('[반납 날짜]');
        this.openCalendar(1);
    }

    /**
     * 달력 팝업
     */
    openCalendar($tgNum) {
        console.info('[달력 팝업 > $tgNum]', $tgNum);

        const itemCategoryCode = 'IC03';
        const storeId = 'rent-main';

        // 모달 전달 데이터
        const initialState = {
            storeCategoryType: StoreCategoryTypes.RENT,
            storeId: storeId,

            step: 0,
            totStep: 2,
            tabTxtList: ['대여일', '반납일'],
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
                            // initialState.selectList = ev.result.selectList;
                            initialState.selectList = _.slice(ev.result.selectList, 0, $tgNum);

                            console.info('[initialState]', initialState);
                        }

                        this.bsModalRef = this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });
                    }
                )
        );
    }
}
