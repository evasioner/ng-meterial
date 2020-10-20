import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, take, takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertRentBookingInformationPage } from '../../store/rent-booking-information-page/rent-booking-information-page/rent-booking-information-page.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as qs from 'qs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { ApiRentService } from '../../api/rent/api-rent.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiBookingService } from '../../api/booking/api-booking.service';
import { UtilDateService } from '../../common-source/services/util-date/util-date.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { StorageService } from '@app/common-source/services/storage/storage.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { RentBookingInformationPageStoreIds } from './enums/rent-booking-information-page-store-ids.enum';

import { RentModalAgreementComponent } from './modal-components/rent-modal-agreement/rent-modal-agreement.component';
import { BasePageComponent } from '../base-page/base-page.component';
import { RentModalBranchofficeComponent } from './modal-components/rent-modal-branchoffice/rent-modal-branchoffice.component';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-rent-booking-information-page',
    templateUrl: './rent-booking-information-page.component.html',
    styleUrls: ['./rent-booking-information-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RentBookingInformationPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    headerConfig: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;

    vm: any;

    mainForm: FormGroup;
    submitted = false;

    locationType: boolean = true;

    private subscription: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private rentUtilSvc: RentUtilService,
        private store: Store<any>,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private apiRentService: ApiRentService,
        private apiBookingService: ApiBookingService,
        private bsModalService: BsModalService,
        private el: ElementRef,
        private jwtService: JwtService,
        private loadingBar: LoadingBarService,
        private utilDateService: UtilDateService,
        private comValidS: CommonValidatorService,
        private storageS: StorageService,
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
        this.subscription = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = '';

        this.routeInit();

    }

    ngOnDestroy() {
        this.subscription && this.subscription.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );

        this.rxAlive = false;
        this.closeAllModals();
    }

    commonUserInit() {
        this.subscription.push(
            this.store.pipe(
                select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])),
                takeWhile(() => this.rxAlive)
            )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[commonUserInit]', ev);
                            console.info('[this.vm]', this.vm);
                            const tempVm = _.cloneDeep(this.vm);
                            tempVm.userInfo = ev['userInfo'];
                            tempVm.traveler = ev['traveler'];
                            this.vm = tempVm;
                        }
                    }
                )
        );
    }

    /**
     * 라우트 초기화 : get으로 데이터 전달 받음
     */
    routeInit() {
        this.subscription.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveDataInit(data);
                        this.vmInit();
                        if (this.isBrowser) {
                            this.loginInit();
                        }
                    }
                )
        );
    }

    /**
     * url 통해 전달 받은 데이터 초기화
     * - 모든 데이터가 string 형태로 넘어오기때문에 형변환한다.
     *
     * @param $data
     */
    resolveDataInit($data) {
        console.info('[resolveDataInit]', $data);
        this.resolveData = _.cloneDeep($data.resolveData);

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

        console.log(this.vm, 'this.vm');


        console.info('[1. route 통해 데이터 전달 받기 > resolveData]', this.resolveData);
        console.log(typeof (this.resolveData), 'typeof');


    }

    vmInit() {
        const RESOLVE_DATA = this.resolveData;

        this.vm = {
            listFilterRq: RESOLVE_DATA.listFilterRq,
            rq: RESOLVE_DATA.rq,

            rentRuleRs: null,
            listFilterRs: null,

            userInfo: null,
            traveler: null
        };

        this.store.dispatch(
            upsertRentBookingInformationPage({
                rentBookingInformationPage: {
                    id: RentBookingInformationPageStoreIds.RENT_RESOLVE_DATA,
                    result: this.vm
                }
            })
        );

    }

    pageInit() {
        console.info('[pageInit]', this.vm);
        this.headerInit();
        this.loadingBool = false;
        this.loadingBar.start();
        this.subscription.push(
            forkJoin([
                this.apiRentService.POST_RENT_RENTRULE(this.vm.rq),
                this.apiRentService.POST_RENT_LIST(this.vm.listFilterRq)
            ])
                .pipe(
                    takeWhile(() => this.rxAlive),
                    catchError(([err1, err2]) => of([err1, err2]))
                )
                .subscribe(
                    ([res1, res2]: any) => {
                        /**
                         * res1 : 예약자 입력 정보
                         * res2 : 선택한 자동차 정보
                         */
                        // console.info('[res1]', res1['result']);
                        // console.info('[res2]', res2['result']);
                        if (res1.succeedYn && res2.succeedYn) {
                            const tempVm = _.cloneDeep(this.vm);
                            tempVm.rentRuleRs = res1['result'];
                            tempVm.listFilterRs = res2['result'];
                            // console.info('[tempVm]', tempVm);
                            this.vm = tempVm;
                            // console.info('[vm]', this.vm);
                            this.storageS.makeRecentData(
                                'local',
                                {
                                    resolveData: this.resolveData,
                                    dateRange: `${moment(tempVm.listFilterRs.pickup.datetime).format('MM.DD(ddd) HH:mm')}-${moment(tempVm.listFilterRs.return.datetime).format('MM.DD(ddd) HH:mm')}`,
                                    locationAccept: tempVm.listFilterRs.pickup.cityNameLn,
                                    locationReturn: tempVm.listFilterRs.return.cityNameLn,
                                    vehicleName: tempVm.listFilterRs.vehicles[0].vehicleName,
                                    photoUrls: tempVm.listFilterRs.vehicles[0].photoUrls

                                },
                                'rent'
                            );
                            this.store.dispatch(
                                upsertRentBookingInformationPage({
                                    rentBookingInformationPage: {
                                        id: RentBookingInformationPageStoreIds.RENT_BOOKING_INFORMATION,
                                        result: this.vm
                                    }
                                })
                            );

                            this.loadingBool = true;
                            this.loadingBar.complete();
                            this.mainFormInit();
                        } else {
                            if (res1.errorMessage) {
                                this.alertService.showApiAlert(res1.errorMessage);
                            } else {
                                this.alertService.showApiAlert(res2.errorMessage);
                            }
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );

        if (this.vm.rq.condition.vendorCurrencyCode === 'KRW')
            this.locationType = true;
        else {
            this.locationType = false;
        }
    }

    /**
     * 폼 초기화
     */
    mainFormInit() {
        this.mainFormCreate();
        console.info('[mainFormInit > userInfo]', this.vm.userInfo);
        console.info('[mainFormInit > mobileNo]', this.vm.userInfo.user.mobileNo);
        this.mainForm.patchValue({
            userNo: this.vm.userInfo.user.userNo,
            userName: this.vm.userInfo.user.nameKo,
            userPhone: this.vm.userInfo.user.mobileNo.replace(/-/gi, ''),
            userEmail: this.vm.userInfo.user.emailAddress,

            driverNameKr: '',
            driverLastName: '',
            driverFirstName: ''
        });
    }

    /**
     * 폼 생성
     */
    mainFormCreate() {
        console.info('[mainFormCreate]');
        this.mainForm = this.fb.group({
            userNo: [''],
            userName: ['', [Validators.required, this.comValidS.customPattern({ pattern: /^[가-힣a-zA-Z]*$/, msg: '한글 또는 영문으로만 입력해주세요.' })]],
            userPhone: ['', [Validators.required, this.comValidS.customPattern({ pattern: /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })]],
            userEmail: ['', [Validators.required, Validators.email]],

            driverNameKr: new FormControl('', [
                Validators.required,
                Validators.maxLength(33),
                this.comValidS.customPattern({ pattern: /^[가-힣]*$/, msg: '한글만 입력해주세요.' })
            ]),
            driverLastName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            driverFirstName: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
            ]),
            driverGender: new FormControl('M', Validators.required),

            arrivalFlightNumber: ['', [this.comValidS.customPattern({ pattern: /^([A-Z]{2})([0-9]{3})$/, msg: '항공편(영문 2자리)과 숫자(3자리) 조합만으로 입력해주세요.' })]],
            arrivalTime: ['', [this.comValidS.customPattern({ pattern: /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/, msg: '도착 시간을 올바르게 입력해주세요. 예) 23:00' })]],

            agreeList: this.fb.array([new FormControl(false), new FormControl(false), new FormControl(false)], [this.comValidS.validateAgreeList]),

            selectTraveler: ['NOTHING']

        });

    }

    isValidError(fieldName: any, submitted: boolean): boolean {
        return this.mainForm.controls[fieldName].errors && (submitted || this.mainForm.controls[fieldName].dirty || this.mainForm.controls[fieldName].touched);
    }

    onSubmit($form: any) {

        this.submitted = true;

        console.info('[onSubmit]', $form, $form.value);

        if ($form.valid) {
            const selectTraveler = this.mainForm.get('selectTraveler').value;
            //조회 검색 조건 > 생년월일 과 여행자 > 생년월일 데이터 모두 있을시
            if (!(_.isEmpty(this.resolveData.listFilterRq.condition.driverBirthday) || _.isEmpty(selectTraveler.birthday))) {
                const driverBirthday = moment(this.resolveData.listFilterRq.condition.driverBirthday).format('YYYY-MM-DD').toString();
                const travelerBirthday = moment(selectTraveler.birthday).format('YYYY-MM-DD').toString();
                // 생년월일 일치하지 않다면 invalid
                if (driverBirthday !== travelerBirthday) {
                    this.inValidAlert('조회한 생년월일과 운전자 생년월일이 일치하지 않습니다.', '운전자 정보를 다시 선택하거나 신규 운전자를 추가하여 주세요.');
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
                    this.inValidAlert();
                    return false;
                }
            });
            return false;
        }


    } // end onSubmit

    inValidAlert(titleTxt?, alertHtml?) {

        let txt = '입력 값이 올바르지 않은 항목이 있습니다.';
        if (titleTxt)
            txt = titleTxt;

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
    }

    /**
     * 예약 진행
     */
    async doBooking($form) {
        console.info('[예약진행]', $form.value);
        const vehicles = this.vm.listFilterRs.vehicles[0]; // 렌터카 1건 조회
        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                domainAddress: 'minim', // 추후 수정
                deviceTypeCode: 'PC', // MA: Mobile App, MW: Mobile Web, PC: PC
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
                        ageTypeCode: this.vm.listFilterRs.driver.ageTypeCode,
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
        this.subscription.push(
            this.apiBookingService.POST_BOOKING(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[예약진행 > res]', res);
                        if (res.succeedYn) {
                            console.info('[예약진행 > res]', res);
                            console.info('[this.vm.listFilterRs]', this.vm.listFilterRs);

                            const completeRq = {
                                userInfo: this.vm.userInfo,
                                vehicle: this.vm.listFilterRs.vehicles[0],
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
                        this.alertService.showApiAlert(error.error.errorMessage);
                    }
                )
        );
    }

    get f() {
        return this.mainForm.controls;
    }

    loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl).then(
            (e) => {
                console.info('[jwtService.loginGuardInit > ok]', e);
                if (e) {
                    this.commonUserInit();
                    this.pageInit();
                }
            },
            (err) => {
                console.info('[jwtService.loginGuardInit > err]', err);
            });
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    /**
     * 만나이 구하기
     */
    getOld() {
        const birthday = this.vm.listFilterRq.condition.driverBirthday;
        const tgDay = moment(this.vm.listFilterRs.vehicles[0].pickup.datetime).format('YYYY-MM-DD');
        const tgOld = this.utilDateService.getOld(tgDay, birthday);

        return tgOld;
    }

    getPickupLocationAddress() {
        const locationCode = this.vm.listFilterRs.vehicles[0].pickup.locationCode;
        const tgList = this.vm.listFilterRs.locations;
        const tgVal = _.find(tgList, { locationCode: locationCode });

        return tgVal.address;
    }

    getReturnLocationAddress() {
        const locationCode = this.vm.listFilterRs.vehicles[0].return.locationCode;
        const tgList = this.vm.listFilterRs.locations;
        const tgVal = _.find(tgList, { locationCode: locationCode });

        return tgVal.address;
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
        if (num === 1)
            this.mainForm.get('userName').patchValue('');
        else if (num === 2)
            this.mainForm.get('userPhone').patchValue('');
        else if (num === 3)
            this.mainForm.get('userEmail').patchValue('');
    }

    /**
     * 전체 선택
     */
    onCheckboxTotChange(event: any, $tgStr: string, $fbGrpKey: string) {
        event && event.preventDefault();

        const tgElList = this.element.querySelectorAll(`[data-target="${$tgStr}"] input[type='checkbox']`);
        const formArray: FormArray = this.mainForm.get(`${$fbGrpKey}`) as FormArray;

        if (event.target.checked) { // 전체 선택
            console.info('[onCheckboxTotChange]', true);
            formArray.clear();
            _.forEach(tgElList, (tgElItem) => {
                tgElItem.checked = true;
                formArray.push(new FormControl(true));
            });


        } else {
            console.info('[onCheckboxTotChange]', false);
            formArray.clear();
            _.forEach(tgElList, (tgElItem) => {
                tgElItem.checked = false;
                formArray.push(new FormControl(false));
            });

        }
    }

    /**
     * 체크박스
     */
    onCheckboxChange(e, $idx: number, $fbGrpKey: string, fbArrKey?: string) {
        const tgEl = this.element.querySelector(`[data-target="agreeTotChk"] input[type='checkbox']`);
        const formArray: FormArray = this.mainForm.get(`${$fbGrpKey}`) as FormArray;

        formArray.removeAt($idx); // 삭제

        if (e.target.checked) {
            formArray.insert($idx, new FormControl(true));
        } else {
            formArray.insert($idx, new FormControl(false));
        }

        const isTotChk = _.every(formArray.value);
        if (isTotChk) {
            tgEl.checked = true;
        } else {
            tgEl.checked = false;
        }

        console.info('[formArray]', formArray.value);
        console.info('[isTotChk]', isTotChk);
    }

    doCheckboxChecked($idx, $fbGrpKey) {
        const tgEl = this.element.querySelector(`[data-target="agreeTotChk"] input[type='checkbox']`);
        const formArray: FormArray = this.mainForm.get(`${$fbGrpKey}`) as FormArray;

        // input chekced
        {
            const agreeChkList = this.element.querySelectorAll(`[data-target="agreeChk"] input[type='checkbox']`);
            const tgInput = agreeChkList[$idx];
            tgInput.checked = true;
        }

        // formArray update
        {
            formArray.removeAt($idx); // 삭제
            formArray.insert($idx, new FormControl(true));
        }

        const isTotChk = _.every(formArray.value);
        if (isTotChk) {
            tgEl.checked = true;
        } else {
            tgEl.checked = false;
        }

        console.info('[doCheckboxChecked > formArray]', formArray.value);
        console.info('[doCheckboxChecked > isTotChk]', isTotChk);
    }

    /**
     * 일반규정
     */
    onAgreementNormalClick() {
        console.info('[일반규정]');
        const storeId = 'agreementNormal';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            idx: 0,
            okFun: (($idx) => {
                console.info('[okFun]');
                this.doCheckboxChecked($idx, 'agreeList');
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
     * 취소규정
     */
    onAgreementFlightClick() {
        console.info('[항공취소/환불규정]');
        const storeId = 'agreementFlight';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            idx: 1,
            okFun: (($idx) => {
                console.info('[okFun]');
                this.doCheckboxChecked($idx, 'agreeList');
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
     * 개인정보취급방침
     */
    onAgreementHotelClick() {
        console.info('[개인정보취급방침]');
        const storeId = 'agreementHotel';

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            idx: 2,
            okFun: (($idx) => {
                console.info('[okFun]');
                this.doCheckboxChecked($idx, 'agreeList');
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
     * 렌터카 지정 정보
     */
    onLocationClick(event: MouseEvent, $idx: number) {
        event && event.preventDefault();

        console.info('[렌터카 지정 정보]');

        let locationCode;
        let locationName;
        if ($idx === 0) {
            locationCode = this.vm.listFilterRs.vehicles[0].pickup.locationCode;
            locationName = this.vm.listFilterRs.pickup;
        } if ($idx === 1) {
            locationCode = this.vm.listFilterRs.vehicles[0].return.locationCode;
            locationName = this.vm.listFilterRs.return;
        }
        const tgList = this.vm.listFilterRs.locations;
        const tgVal = _.find(tgList, { locationCode: locationCode });

        const initialState = {
            latitude: tgVal.latitude,
            longitude: tgVal.longitude,
            openningHours: tgVal.openningHours,
            address: tgVal.address,
            locationName: locationName

        };
        console.log(initialState, 'initialState');

        // ngx-bootstrap configlongitude
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(RentModalBranchofficeComponent, { initialState, ...configInfo });
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

    onEnKeyup(e) {
        const val = e.target.value;
        const regexp = new RegExp('[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+', 'g');
        const res = _.replace(val, regexp, '');
        e.target.value = res;
    }

    onKrKeyup(e) {
        const val = e.target.value;
        const regexp = new RegExp('[a-z|A-Z]+', 'g');
        const res = _.replace(val, regexp, '');
        e.target.value = res;
    }
    /**
     * imgLoadError
     * 이미지 로드 에러 시 이미지 변경
     *
     * @param event
     */
    public imgLoadError(event: any, typeCode: string) {
        event && event.preventDefault();
        console.info('[imgLoadError > typeCode]', typeCode);
        event.target.src = `/assets/images/car/${typeCode}.JPG`;
    }

}
