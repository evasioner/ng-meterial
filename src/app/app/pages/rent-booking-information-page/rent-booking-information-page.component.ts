import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, take, takeWhile, finalize } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertRentBookingInformationPage } from '../../store/rent-booking-information-page/rent-booking-information-page/rent-booking-information-page.actions';
import { deleteCommonUserInfo, upsertCommonUserInfo } from '../../store/common/common-user-info/common-user-info.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { ApiBookingService } from '../../api/booking/api-booking.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { UtilUrlService } from '../../common-source/services/util-url/util-url.service';
import { ApiRentService } from '../../api/rent/api-rent.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { RentModalAgreementComponent } from './modal-components/rent-modal-agreement/rent-modal-agreement.component';
import { RentModalFlightInfoComponent } from './modal-components/rent-modal-flight-info/rent-modal-flight-info.component';
import { RentModalBranchofficeComponent } from './modal-components/rent-modal-branchoffice/rent-modal-branchoffice.component';
import { CommonModalAlertComponent } from '../../common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';

@Component({
    selector: 'app-rent-booking-information-page',
    templateUrl: './rent-booking-information-page.component.html',
    styleUrls: ['./rent-booking-information-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RentBookingInformationPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('phoneInput') phoneInput: ElementRef;
    @ViewChild('emailInput') emailInput: ElementRef;
    element: any;
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    vm: any = {
        userName: null,
        userPhone: null,
        userEmail: null,

        driverNameKr: null,
        driverLastName: null,
        driverFirstName: null,
        driverBirthday: null,
        driverGender: null,

        flightArrivalName: null,
        flightArrivalTime: null
    };

    isLogin: boolean = false;
    loadingBool: boolean = false;
    isKo: boolean = false;

    resolveData: any;

    rentRuleRs: any;
    listFilterRs: any;

    mainForm: FormGroup; // 생성된 폼 저장

    userInfo: any;
    traveler: any;
    commonUserInfo$: any;
    private subscriptionList: Subscription[];

    locationType: boolean = true;

    public bookingLoading: boolean;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        @Inject(DOCUMENT) private document: Document,
        public rentUtilSvc: RentUtilService,
        private store: Store<any>,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private apiRentService: ApiRentService,
        private apiBookingService: ApiBookingService,
        private bsModalService: BsModalService,
        private el: ElementRef,
        public jwtService: JwtService,
        public utilUrlService: UtilUrlService,
        private loadingBar: LoadingBarService,
        private comValidator: CommonValidatorService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.element = this.el.nativeElement;
        this.subscriptionList = [];
        this.bookingLoading = true;
    }

    ngOnInit() {
        super.ngOnInit();
        this.observableInit();
        this.subscribeInit();
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기 > data]', data);
                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.vm = _.cloneDeep(data.resolveData.vm);

                        const limits = _
                            .chain(this.resolveData)
                            .get('listFilterRq.condition.limits')
                            .value()
                            .map((o) => {
                                return Number(o);
                            });
                        this.resolveData.listFilterRq.condition.limits = limits;
                        this.resolveData.listFilterRq.condition.filter.vehicleIndex = Number(this.resolveData.listFilterRq.condition.filter.vehicleIndex);

                        this.resolveData.rq.condition.vehicleIndex = Number(this.resolveData.rq.condition.vehicleIndex);
                        this.resolveData.rq.condition.vendorAmountSum = Number(this.resolveData.rq.condition.vendorAmountSum);
                        if (_.has(this.resolveData.rq.condition, 'rateIdentifier'))
                            this.resolveData.rq.condition.rateIdentifier = (this.resolveData.rq.condition.rateIdentifier.length === 0) ? null : this.resolveData.rq.condition.rateIdentifier;
                        else
                            this.resolveData.rq.condition.rateIdentifier = null;

                        console.info('[1. route 통해 데이터 전달 받기 > resolveData]', this.resolveData);

                        if (this.isBrowser) {
                            console.info('[this.isBrowser]', this.isBrowser);
                            const curUrl = this.route.snapshot['_routerState'].url;
                            console.info('[this.isBrowser > curUrl]', curUrl);
                            this.jwtService.loginGuardInit(curUrl).then(
                                (e) => {
                                    console.info('[jwtService.loginGuardInit > ok]', e);
                                    if (e) {
                                        this.pageInit();
                                    }
                                },
                                (err) => {
                                    console.info('[jwtService.loginGuardInit > err]', err);
                                });

                            //로그인 체크
                            // this.loginGuardInit().then(
                            //     (e) => {
                            //         console.info('[loginGuardInit > ok]');
                            //         this.pageInit(this.resolveData);
                            //     },
                            //     (err) => {
                            //         console.info('[loginGuardInit > err]', err);
                            //     });
                        }
                    }
                )
        );

    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );

        this.rxAlive = false;
        this.closeAllModals();
    }


    observableInit() {
        this.commonUserInfo$ = this.store.pipe(
            select(commonUserInfoSelectors.getSelectId(['commonUserInfo']))
        );
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.commonUserInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.userInfo = ev.userInfo;
                            this.traveler = ev.traveler;
                            console.info('[userInfo]', ev.userInfo);
                            console.info('[traveler]', ev.traveler);
                        }
                    }
                )
        );
    }

    /**
     * 로그인 가드
     */
    async loginGuardInit() {
        console.info('[loginGuardInit]');
        const curUrl = this.route.snapshot['_routerState'].url;
        const isLogin = this.jwtService.checkedLogin();

        if (isLogin) {
            console.info('[isLogin 1]', isLogin);
            this.jwtService.loginInit();
            const userInfoRes = await this.jwtService.getUserInfo();
            if (userInfoRes.succeedYn) {
                console.info('[로그인]');
                /**
                 * 로그인을 완료후 여행자 정보를 가져온다.
                 */
                const travelerReq = {
                    stationTypeCode: environment.STATION_CODE,
                    currency: 'KRW',
                    language: 'KO',
                    condition: {
                        userNo: userInfoRes.result.user.userNo
                    }
                };
                const travelerRes = await this.apiBookingService.POST_BOOKING_TRAVELER(travelerReq)
                    .toPromise()
                    .then((res: any) => {
                        if (res.succeedYn) {
                            return res;
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    })
                    .catch((err) => {
                        this.alertService.showApiAlert(err);
                    });

                console.info('[travelerRes]', travelerRes);

                const commonUserInfo: any = {
                    id: 'commonUserInfo',
                    userInfo: userInfoRes['result'],
                    traveler: travelerRes['result'].travelers
                };

                this.store.dispatch(upsertCommonUserInfo({
                    commonUserInfo: commonUserInfo
                }));
            } else {
                console.info('[로그아웃]');
                this.jwtService.logoutInit();
                this.store.dispatch(deleteCommonUserInfo({ id: 'commonUserInfo' }));
                this.goToLogin(curUrl);
            }
        } else {
            console.info('[isLogin 2]', isLogin);
            this.goToLogin(curUrl);
        }
    }  // end 로그인 가드

    goToLogin($stateUrl) {
        const routeURL = $stateUrl;
        const returnUrl = this.utilUrlService.getOrigin();
        const res = this.jwtService.getLoginUrl(returnUrl + routeURL);
        console.info('[routeURL]', routeURL);
        console.info('[returnUrl]', returnUrl);
        console.info('[res]', res);
        this.document.location.href = res;
    }


    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     * @param $resolveData
     */
    async pageInit() {
        console.info('[pageInit > this.resolveData.rq.condition]', this.resolveData.rq.condition);
        // ---------[rent-list-rq-info 스토어에 저장]
        this.upsertOne({
            id: 'rent-booking-infomation-rq-info',
            result: this.resolveData
        });
        // ---------[헤더 초기화]
        const headerTitle = `예약 정보 입력`;
        const pickupDatetime = moment(this.resolveData.rq.condition.pickup.datetime).format('MM.DD(HH:mm)');
        const returnDatetime = moment(this.resolveData.rq.condition.return.datetime).format('MM.DD(HH:mm)');
        const headerTime = `${pickupDatetime}-${returnDatetime}`;


        console.info('[resolveData > pickupDatetime]', this.resolveData.rq.condition.pickup.datetime);
        console.info('[resolveData > returnDatetime]', this.resolveData.rq.condition.return.datetime);
        console.info('[pickupDatetime]', pickupDatetime);
        console.info('[returnDatetime]', returnDatetime);

        this.headerInit('user-information', headerTitle, headerTime);
        // ---------[ end 헤더 초기화]

        this.loadingBool = false;
        this.loadingBar.start();
        this.subscriptionList.push(
            forkJoin([
                this.apiRentService.POST_RENT_RENTRULE(this.resolveData.rq),
                this.apiRentService.POST_RENT_LIST(this.resolveData.listFilterRq)
            ])
                .pipe(
                    takeWhile(() => this.rxAlive),
                    catchError(([err1, err2]) => of([err1, err2])),
                    finalize(() => { this.bookingLoading = false; })
                )
                .subscribe(
                    ([res1, res2]: any) => {
                        /**
                         * res1 : 예약자 입력 정보
                         * res2 : 선택한 자동차 정보
                         */
                        this.rentRuleRs = res1['result'];
                        this.listFilterRs = res2['result'];
                        //국내여부
                        this.isKo = _.isEqual(this.listFilterRs.pickup.countryCode, 'KR');

                        const res = {
                            rentRuleRs: this.rentRuleRs,
                            listFilterRs: this.listFilterRs
                        };
                        this.upsertOne({
                            id: 'rent-booking-infomation-rs',
                            result: res
                        });

                        this.loadingBool = true;
                        this.loadingBar.complete();
                        this.mainFormInit();
                        console.log(this.listFilterRs, 'listFilterRs');
                        console.log(this.rentRuleRs, 'this.rentRuleRs');

                        if (this.rentRuleRs.vendorCurrencyCode === 'KRW')
                            this.locationType = true;
                        else {
                            this.locationType = false;
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
        console.info('[mainFormInit > userInfo]', this.userInfo);
        console.info('[mainFormInit > mobileNo]', this.userInfo.user.mobileNo);
        this.mainForm.patchValue({
            userNo: this.userInfo.user.userNo,
            userName: this.userInfo.user.nameKo,
            userPhone: _.replace(this.userInfo.user.mobileNo, new RegExp('-', 'g'), ''),
            userEmail: this.userInfo.user.emailAddress,

            driverNameKr: '',
            driverLastName: '',
            driverFirstName: '',
            driverGender: ''
        });
    }

    /**
     * 폼 생성
     */
    mainFormCreate() {
        console.info('[mainFormCreate]');
        this.mainForm = this.fb.group({
            userNo: [''],
            userName: ['', [Validators.required, this.comValidator.customPattern({ pattern: /^[가-힣a-zA-Z]*$/, msg: '한글 또는 영문으로만 입력해주세요.' })]],
            userPhone: ['', [Validators.required, this.comValidator.customPattern({ pattern: /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })]],
            userEmail: ['', [Validators.required, Validators.email]],

            driverNameKr: new FormControl('', [
                Validators.required,
                Validators.maxLength(33),
                this.comValidator.customPattern({ pattern: /^[가-힣]*$/, msg: '한글만 입력해주세요.' })
            ]),
            driverLastName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            driverFirstName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            driverGender: ['M'],

            arrivalFlightNumber: ['', [this.comValidator.customPattern({ pattern: /^([A-Z]{2})([0-9]{3})$/, msg: '항공편(영문 2자리)과 숫자(3자리) 조합만으로 입력해주세요.' })]],
            arrivalTime: ['', [this.comValidator.customPattern({ pattern: /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/, msg: '도착 시간을 올바르게 입력해주세요. 예) 23:00' })]],

            agreeList: this.fb.array([new FormControl(false), new FormControl(false), new FormControl(false)], [this.comValidator.validateAgreeList]),

            selectTraveler: ['NOTHING']
        });
    }

    get agreeList(): FormArray { return this.mainForm.get('agreeList') as FormArray; }

    isValidError(fieldName: any, submitted: boolean): boolean {
        return this.mainForm.controls[fieldName].errors && (submitted || this.mainForm.controls[fieldName].dirty || this.mainForm.controls[fieldName].touched);
    }

    onSubmit($form: any) {

        setTimeout(() => {

            console.info('[onSubmit]', $form, $form.value);

            if ($form.valid) {
                const selectTraveler = this.mainForm.get('selectTraveler').value;
                //조회 검색 조건 > 생년월일 과 여행자 > 생년월일 데이터 모두 있을시
                if (!(_.isEmpty(this.resolveData.listFilterRq.condition.driverBirthday) || _.isEmpty(selectTraveler.birthday))) {
                    const driverBirthday = moment(this.resolveData.listFilterRq.condition.driverBirthday).format('YYYY-MM-DD').toString();
                    const travelerBirthday = moment(selectTraveler.birthday).format('YYYY-MM-DD').toString();
                    // 생년월일 일치하지 않다면 invalid
                    if (driverBirthday !== travelerBirthday) {
                        this.inValidAlert('driverInfo', '조회한 생년월일과 운전자 생년월일이 일치하지 않습니다.', '운전자 정보를 다시 선택하거나 신규 운전자를 추가하여 주세요.');
                        return false;
                    }
                }
                console.info('[1. 유효성 체크 성공]');
                this.rxAlive = false;
                this.doBooking($form);
            } else {
                _.forEach($form.controls, ($val, $key) => {
                    if (!$val.valid) {
                        console.info('[$key | 유효성 체크 실패]', $key);
                        const targetId = $key;
                        this.inValidAlert(targetId);
                        return false;
                    }
                });
            }

        }); // end setTimeout

    } // end onSubmit

    /**
     * 예약 진행
     */
    async doBooking($form) {
        console.info('[예약진행]', $form.value);
        const vehicles = this.listFilterRs.vehicles[0]; // 렌터카 1건 조회
        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                domainAddress: 'minim', // 추후 수정
                deviceTypeCode: 'MA', // MA: Mobile App, MW: Mobile Web, PC: PC
                booker: {
                    userNo: $form.value.userNo,
                    email: $form.value.userEmail,
                    mobileNo: _.replace($form.value.userPhone, new RegExp('-', 'g'), ''),
                    name: $form.value.userName
                },
                travelers: [
                    {
                        travelerIndex: 1, // 고정값
                        userNo: $form.value.userNo,
                        name: $form.value.driverNameKr,
                        gender: $form.value.driverGender,
                        ageTypeCode: this.listFilterRs.driver.ageTypeCode,
                        nationalityCode: 'KR', // 고정값
                        lastName: _.upperCase($form.value.driverLastName),
                        middleName: '',
                        firstName: _.upperCase($form.value.driverFirstName),
                        birthday: this.resolveData.listFilterRq.condition.driverBirthday
                    }
                ],
                rentItems: [
                    {
                        travelerIndex: 1, // 고정값
                        vehicleIndex: vehicles.vehicleIndex,
                        vendorCurrencyCode: vehicles.vendorCurrencyCode,
                        vehicleVendorCode: vehicles.vehicleVendorCode,
                        vendorAmountSum: vehicles.vendorAmountSum,
                        sippCode: vehicles.sippCode,
                        baseRateTypeCode: vehicles.baseRateTypeCode,
                        vehicleTypeOwner: vehicles.vehicleTypeOwner,
                        accessLevel: vehicles.accessLevel,
                        pickup: {
                            datetime: vehicles.pickup.datetime,
                            cityCodeIata: vehicles.pickup.cityCodeIata,
                            locationCode: vehicles.pickup.locationCode
                        },
                        fareTypeCode: vehicles.fareTypeCode,
                        referenceCode: vehicles.referenceCode,
                        return: {
                            datetime: vehicles.return.datetime,
                            cityCodeIata: vehicles.return.cityCodeIata,
                            locationCode: vehicles.return.locationCode
                        },
                        rateCategoryCode: vehicles.rateCategoryCode
                    }
                ]
            }
        };

        this.postBooking(rq);
    }

    /**
     * booking api 호출
     * @param rq
     */
    postBooking(rq) {
        this.subscriptionList.push(
            this.apiBookingService.POST_BOOKING(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[예약진행 > res]', res);
                        if (res.succeedYn) {
                            const completeRq = {
                                userInfo: this.userInfo,
                                result: res['result']
                            };

                            // const qsStr = qs.stringify(res['result']);
                            const qsStr = qs.stringify(completeRq);
                            const path = '/rent-booking-complete/' + qsStr;
                            const extras = {
                                relativeTo: this.route
                            };
                            this.location.replaceState('/rent-main'); // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.router.navigate([path], extras);
                        } else {
                            console.info('[예약 실패]');
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (error: any) => {
                        console.info('[booking error]', error);
                        this.alertService.showApiAlert(error.error.errorMessage);
                    }
                )
        );
    }

    // doAlert($str: string) {
    //     const initialState = {
    //         titleTxt: $str,
    //         closeObj: null
    //     };
    //     // ngx-bootstrap config
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: false
    //     };
    //     this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    // }

    inValidAlert(targetId, titleTxt?, alertHtml?) {
        console.info('inValidAlert', targetId);

        const defalutTxt = '입력 값이 올바르지 않은 항목이 있습니다.';
        const txt = titleTxt ? titleTxt : defalutTxt;

        const initialState: any = {
            titleTxt: txt,
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
        this.subscriptionList.push(
            this.bsModalService.onHidden
                .subscribe(
                    () => {
                        this.comValidator.scrollToTarget(targetId);
                    }
                )
        );
    }

    /**
     * 헤더 초기화
     */
    headerInit($iconType, $headerTitle, $headerTime) {
        console.info('[headerInit]', $headerTime);
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: $iconType,
            step: {
                title: $headerTitle
            },
            detail: $headerTime,
            ctx: this.ctx
        };
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertRentBookingInformationPage({
            rentBookingInformationPage: $obj
        }));
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    doAlert($str: string) {
        const initialState = {
            titleTxt: $str,
            closeObj: null
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
     * 요금, 취소수수료 규정
     * @param e
     * @param $storeId normal:일반규정 | cancel:취소규정 | personalInfo:개인정보취급방침
     */
    onAgreementClick(e, $storeId) {
        console.info('[요금, 취소수수료 규정]', e);
        let tabNumber: number;

        // 모달 전달 데이터
        const initialState = {
            countryType: this.rentRuleRs.vendorCurrencyCode,
            storeId: $storeId,
            okFun: (($store) => {
                console.info('[okFun]',);
                if ($store === 'agreementNormal')
                    tabNumber = 0;
                else if ($store === 'agreementFlight')
                    tabNumber = 1;
                else if ($store === 'agreementHotel')
                    tabNumber = 2;
                //     this.doCheckboxChecked($idx, 'agreeTotChk', 'agreeList');
                this.onChangeAgreement(tabNumber);
            })
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(RentModalAgreementComponent, { initialState, ...configInfo });
    }

    /**
     * 동의하기 체크박스 이벤트
     * @param idx
     * @param e
     */
    onChangeAgreement(idx, e?) {
        let chkBool: boolean = true;

        //checkbox change 이벤트 발생 시
        if (!_.isEmpty(e)) {
            //checked false 경우
            if (!e.target.checked)
                chkBool = false;
        }

        //form update
        {
            this.agreeList.controls[idx].setValue(chkBool);
        }

        //모든 동의 checkbox checked
        const isTotChk = _.every(this.agreeList.value);
        const totChk = this.element.querySelector(`[data-target="agreeTotChk"] input[type='checkbox']`);
        if (isTotChk) { // 모두 동의
            totChk.checked = true;
        } else {
            totChk.checked = false;
        }

        console.info(idx, '[onChangeAgreement formArray]', this.agreeList);
    }

    /**
     * 모든 약관에 동의 체크박스 이벤트
     * @param e
     */
    onChangeAllAgreement(e) {
        const tgElList = this.element.querySelectorAll(`[data-target="agreeChk"] input[type='checkbox']`);
        if (e.target.checked) {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = true;
                this.agreeList.controls[index].setValue(true);
            });
        }
        else {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = false;
                this.agreeList.controls[index].setValue(false);
            });
        }
    }


    /**
     * 렌터카 지정 정보
     */
    onLocationClick(event: MouseEvent, $idx: number) {
        event && event.preventDefault();

        let idx = 0;
        if ($idx > 0 && this.listFilterRs.locations[1]) {
            idx = 1;
        }

        // 모달 전달 데이터
        const initialState = {
            latitude: this.listFilterRs.locations[idx].latitude,
            longitude: this.listFilterRs.locations[idx].longitude,
            openningHours: this.listFilterRs.locations[idx].openningHours,
            address: this.listFilterRs.locations[idx].address,
            vehicleName: this.listFilterRs.vehicles[0].vehicleName,
            vehicleVendorCode: this.listFilterRs.vehicles[0].vehicleVendorCode,
        };


        // ngx-bootstrap configlongitude
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalBranchofficeComponent, { initialState, ...configInfo });
    }

    /**
     * 내 항공 예약 정보 찾기
     */
    onFlightInfoClick() {
        console.info('[내 항공 예약 정보 찾기]');

        // 모달 전달 데이터
        const initialState = {};

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalFlightInfoComponent, { initialState, ...configInfo });

    }

    /**
     * 운전자 정보 셀렉트 박스 이벤트
     */
    onTravelerChange(event: MouseEvent) {
        event && event.preventDefault();
        const selectData = this.mainForm.get('selectTraveler');
        console.info('[onTravelerChange]', selectData);

        if (selectData.value === 'NOTHING') {
            this.mainForm.patchValue({
                driverNameKr: '',
                driverLastName: '',
                driverFirstName: '',
                driverGender: 'M'
            });
        } else {
            this.mainForm.patchValue({
                driverNameKr: selectData.value.name,
                driverLastName: selectData.value.lastName,
                driverFirstName: selectData.value.firstName,
                driverGender: selectData.value.gender
            });

        }
    }

    nameDelClick(e?) {
        console.info('[검색영역 x 버튼 클릭]', e);
        this.nameInput.nativeElement.value = '';
    }

    phoneDelClick(e?) {
        console.info('[검색영역 x 버튼 클릭]', e);
        this.phoneInput.nativeElement.value = '';
    }

    emailDelClick(e?) {
        console.info('[검색영역 x 버튼 클릭]', e);
        this.emailInput.nativeElement.value = '';
    }

    /**
    * resetText
    * 텍스트 박스 리셋
    *
    * @param event? 돔 이벤트
    * @param idx
    */
    public userInfoReset(event?: any, num?: number) {
        event && event.preventDefault();
        if (num === 1) this.mainForm.get('userName').patchValue('');
        else if (num === 2) this.mainForm.get('userPhone').patchValue('');
        else if (num === 3) this.mainForm.get('userEmail').patchValue('');
    }

}