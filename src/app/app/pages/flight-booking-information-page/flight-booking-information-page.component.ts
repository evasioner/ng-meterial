import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Observable, Subscription } from 'rxjs';
import { takeWhile, catchError, finalize } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { upsertFlightBookingInformationPage } from 'src/app/store/flight-booking-information-page/flight-booking-information-page/flight-booking-information-page.actions';
import { upsertFlightSessionStorage } from 'src/app/store/flight-common/flight-session-storage/flight-session-storage.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as qs from 'qs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { ApiFlightService } from 'src/app/api/flight/api-flight.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';
import { TravelerTypeKr } from '@/app/common-source/enums/common/traveler-type.enum';
import { CabinClass } from '@/app/common-source/enums/flight/cabin-class.enum';
import { FlightCommon } from '@/app/common-source/enums/flight/flight-common.enum';
import { FlightStore } from '@/app/common-source/enums/flight/flight-store.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from 'src/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { FlightModalAgreementComponent } from './modal-components/flight-modal-agreement/flight-modal-agreement.component';
import { FlightModalPaymentDetailComponent } from 'src/app/common-source/modal-components/flight-modal-payment-detail/flight-modal-payment-detail.component';
import { FlightModalScheduleInformationComponent } from 'src/app/common-source/modal-components/flight-modal-schedule-information/flight-modal-schedule-information.component';

@Component({
    selector: 'app-flight-booking-information-page',
    templateUrl: './flight-booking-information-page.component.html',
    styleUrls: ['./flight-booking-information-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlightBookingInformationPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('phoneInput') phoneInput: ElementRef;
    @ViewChild('emailInput') emailInput: ElementRef;

    ctx: any = this;
    headerType: any;
    headerConfig: any;
    private subscriptionList: Subscription[];

    fareRuleRQ: any;
    sessionRQ: any;
    flightBookingRQ: any;

    flightCommonSession$: Observable<any>;

    totalPaxCount: number = 0;
    rxAlive: any = true;

    fareRuleResultList: any;
    segHoldResultList: any = [];
    scheduleResultList: any;

    travelerForm: FormGroup;

    loadingBool: Boolean = false;

    isAssembleKoName: Boolean = false;

    bsModalScheduleRef: BsModalRef;
    bsModalDetailRef: BsModalRef;

    submitted: any;

    howMany: any = '';

    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false,
        keyboard: false
    };

    vm: any = {
        booker: {
            userName: '',
            mobileNo: '',
            email: ''
        }
    };

    ageLimit: any = {
        INF: {
            typeCode: 'INF',
            text: '유아',
            ageCon: '만 2세(24개월) 미만',
            val: [
                { compare: 'under', age: 2 }
            ]
        },
        CHD: {
            typeCode: 'CHD',
            text: '아동',
            ageCon: '만 2세(24개월) 이상 13세 미만',
            val: [
                { compare: 'over', age: 2 },
                { compare: 'under', age: 13 }
            ]
        }
    };

    searchBool: boolean = false;
    userInfo: any = {};
    traveler: any;
    commonUserInfo$: any;
    resolveData: any;
    travlerArray: Array<string>;
    element: any;

    public bookingLoading: boolean;
    public apisNeededYn: boolean;
    public selectedList: any;
    public amountSum: number;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private bsModalService: BsModalService,
        private apiflightSvc: ApiFlightService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<any>,
        private datePipe: DatePipe,
        private fb: FormBuilder,
        private comValidS: CommonValidatorService,
        public jwtService: JwtService,
        private apiBookingS: ApiBookingService,
        private el: ElementRef,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.subscriptionList = [];
        this.element = this.el.nativeElement;
        this.formInit();
        this.travlerArray = [];
        this.bookingLoading = true;
        this.apisNeededYn = false;
        this.selectedList = [];
    }

    ngOnInit(): void {
        console.info('[ngOnInit > 탑승자 정보 입력]');
        super.ngOnInit();
        this.subscribeInit();
        this.sessionInit();

        console.info('[스토어에 flight-booking-info 저장 시작]', this.sessionRQ);
        this.modelInit('flight-booking-info', this.sessionRQ);

        console.info('[2. 헤더 초기화 시작]');
        if (this.isBrowser) {
            console.info('[this.isBrowser]', this.isBrowser);
            const curUrl = this.route.snapshot['_routerState'].url;
            console.info('[this.isBrowser > curUrl]', curUrl);

            this.jwtService.loginGuardInit(curUrl).then(
                (e) => {
                    console.info('[jwtService.loginGuardInit > ok]', e);
                    if (e) {
                        this.pageInit(this.sessionRQ);
                    }
                },
                (err) => {
                    console.info('[jwtService.loginGuardInit > err]', err);
                });
        }
    }

    ngOnDestroy(): void {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
        this.rxAlive = false;
        this.closeAllModals();
    }

    get travelers(): FormArray {
        return this.travelerForm.get('travelers') as FormArray;
    }

    get agreeList(): FormArray {
        return this.travelerForm.get('agreeList') as FormArray;
    }

    private formInit() {
        this.travelerForm = this.fb.group({
            userNo: new FormControl('', [Validators.required]),
            userName: new FormControl('', [Validators.required, this.comValidS.customPattern({ pattern: /^[가-힣a-zA-Z]*$/, msg: '한글 또는 영문으로만 입력해주세요.' })]),
            mobileNo: new FormControl('', [Validators.required, this.comValidS.customPattern({ pattern: /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })]),
            email: new FormControl('', [Validators.required, Validators.email]),

            // 여행자
            travelers: this.fb.array([]),

            // 약관동의
            agreeList: this.fb.array([new FormControl(false), new FormControl(false), new FormControl(false)], [this.comValidS.validateAgreeList])
        });
    }

    public isValidError(control: AbstractControl): boolean {
        const formControl = control as FormControl;
        return formControl.errors && (this.submitted || formControl.dirty || formControl.touched);
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.store.select(commonUserInfoSelectors.getSelectId(['commonUserInfo']))
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[userInfo]', ev);
                        if (ev) {
                            this.userInfo = _.cloneDeep(ev.userInfo);
                            this.traveler = _.cloneDeep(ev.traveler);

                            this.travelerForm.patchValue({
                                userNo: this.userInfo.user.userNo,
                                userName: this.userInfo.user.nameKo,
                                mobileNo: this.userInfo.user.mobileNo.replace(/-/gi, ''),
                                email: this.userInfo.user.emailAddress
                            });
                        }
                    }
                )
        );
    }

    sessionInit() {
        const sessionItem = JSON.parse(localStorage.getItem(FlightStore.STORE_FLIGHT_COMMON));
        if (!_.isEmpty(sessionItem.flightSessionStorages.entities)) {
            this.sessionRQ = sessionItem.flightSessionStorages.entities[FlightStore.STORE_FLIGHT_BOOKING_INFORMATION].option;
            this.fareRuleRQ = sessionItem.flightSessionStorages.entities[FlightStore.STORE_FLIGHT_BOOKING_INFORMATION].option.fareRuleRq;
        }
    }

    /**
    * 페이지 초기화
    * 2. 헤더 초기화
    * @param $resolveData
    */
    async pageInit($resolveData) {
        this.resolveData = $resolveData;
        const momentRange = extendMoment(moment);
        const headerTitle = '예약자 정보 입력';
        let headerTime = '';
        let originDatetime: any = '';
        let destDateTime: any = '';
        let range: any = '';
        // ---------[헤더 초기화]

        // 편도
        if ($resolveData.rq.condition.tripTypeCode == 'OW') {
            originDatetime = $resolveData.rq.condition.itineraries[0].departureDate;
            this.howMany = $resolveData.rq.condition.adultCount + $resolveData.rq.condition.childCount + $resolveData.rq.condition.infantCount;
            headerTime = `${this.datePipe.transform(originDatetime, 'MM.dd')}, ${this.howMany} 명, ${CabinClass[$resolveData.rq.condition.cabinClassCode]}`;
            // 왕복, 다구간
        } else {
            originDatetime = $resolveData.rq.condition.itineraries[0].departureDate;
            // 왕복
            if ($resolveData.rq.condition.tripTypeCode == 'RT') {
                destDateTime = $resolveData.rq.condition.itineraries[1].departureDate;
                // 다구간
            } else {
                destDateTime = $resolveData.rq.condition.itineraries[$resolveData.rq.condition.itineraries.length - 1].departureDate;
            }
            range = momentRange.range(originDatetime, destDateTime);
            this.howMany = $resolveData.rq.condition.adultCount + $resolveData.rq.condition.childCount + $resolveData.rq.condition.infantCount;
            headerTime = `${this.datePipe.transform(originDatetime, 'MM.dd')}-${this.datePipe.transform(destDateTime, 'MM.dd')}(${range.diff('days') + 1}일), ${this.howMany} 명, ${CabinClass[$resolveData.rq.condition.cabinClassCode]}`;
        }


        this.headerInit('user-information', headerTitle, headerTime);
        // ---------[헤더 초기화]
        console.info('[2. 헤더 초기화 끝]');


        console.info('[3. API 호출]');

        this.flightSearch($resolveData.rq);

        this.fareRuleRQ.map(
            (item: any, index: number): void => {
                const segHoldRq: any = _.cloneDeep(item);
                segHoldRq.condition.cabinClassCode = item.condition.flight.price.fare.passengerFares[0].itineraries[0].segments[0].cabinClassCode;
                segHoldRq.condition.adultCount = $resolveData.rq.condition.adultCount;
                segHoldRq.condition.childCount = $resolveData.rq.condition.childCount;
                segHoldRq.condition.infantCount = $resolveData.rq.condition.infantCount;
                segHoldRq.condition.userNo = this.userInfo.user.userNo;
                segHoldRq.condition.flight.gdsCompCode = item.condition.flight.price.fare.passengerFares[0].itineraries[0].gdsCompCode; // 임시 gdsCompCode(첫 번째 아이템)
                this.subscriptionList.push(
                    forkJoin([
                        this.apiflightSvc.POST_FLIGHT_FARERULE(item),
                        this.apiflightSvc.POST_FLIGHT_SEGHOLD(segHoldRq)
                    ])
                        .pipe(
                            takeWhile(() => this.rxAlive),
                            catchError(([err1, err2]) => of([err1, err2])),
                            finalize(() => { this.bookingLoading = false; })
                        )
                        .subscribe(
                            ([res1, res2]: any) => {
                                /**
                               * res1 : 항공 운임규정 조회 정보
                               * res2 : 항공 Seg Hold 정보
                               * res3 : 항공검색 정보
                               */
                                console.info('[res1, res2]', res1, res2);

                                this.fareRuleResultList = _.cloneDeep(res1);

                                console.info('[스토어에 flight-fareRule-rs 저장]');
                                this.modelInit('flight-fareRule-rs', this.fareRuleResultList);

                                if (res2.apisNeededYn === true)
                                    this.apisNeededYn = true;

                                const resSegHold: any = _.cloneDeep(res2);
                                this.segHoldResultList[index] = resSegHold;
                                console.log(index, 'segHoldResultList', this.segHoldResultList);

                                if (index === 0 && !this.segHoldResultList[0].result.bookableYn) {
                                    const titleTxt: string = '좌석 확보에 실패했습니다.';
                                    const alertHtml: string = '다른 항공편을 이용바랍니다.';
                                    const evtObj: any = {
                                        ok: {
                                            name: '확인',
                                            fun: () => {
                                                this.goFlightMain();
                                            }
                                        }
                                    };
                                    this.modalConfirmEvt(
                                        titleTxt,
                                        alertHtml,
                                        evtObj
                                    );
                                    return false;
                                }

                                const fareRuleLastIndex: number = this.fareRuleRQ.length - 1;
                                if (index === fareRuleLastIndex)
                                    this.travlerArrayInit($resolveData);

                                this.loadingBool = true;
                            }
                        )
                );
            }
        );
    }

    private travlerArrayInit(resolveData: any) {
        const adult = (resolveData.rq.condition.adultCount || 0);
        const child = adult + (resolveData.rq.condition.childCount || 0);
        const infant = adult + child + (resolveData.rq.condition.infantCount || 0);

        this.travlerArray = Array(this.howMany).fill(null).map(
            (x, index: number) => {
                if (index < adult) {
                    this.addTraveler();
                    return `(성인 ` + `${index + 1})`;
                } else if (index < child) {
                    this.addTraveler('CHD');
                    return `(아동 ` + `${(index - adult) + 1})`;

                } else if (index < infant) {
                    this.addTraveler('INF');
                    return `(유아 ` + `${(index - child) + 1})`;
                }
            }
        );
    }

    /**
     * 헤더 초기화
     */
    headerInit($iconType, $headerTitle, $headerTime) {
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
    * 항공 검색
    * 3. api 호출
    * @param $resolveData
    */
    flightSearch($request) {
        this.subscriptionList.push(
            this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY($request)
                .subscribe(
                    (res: any) => {
                        console.info('[API 호출 | 항공일정 리스트 >]', res);
                        let allSegList: any = [];
                        let isAllDomestic = true;
                        let isFlight = false;
                        if (res.succeedYn) {
                            this.scheduleResultList = _.cloneDeep(res['result']);    // 항공 검색결과(RS)

                            this.scheduleResultList.selected.flights.map(
                                (item: any): void => {
                                    for (const itineraryItem of item.itineraries) {
                                        allSegList = [...allSegList, ...itineraryItem.segments];
                                    }

                                    for (const passengerFareItem of item.price.fares[0].passengerFares) {
                                        this.totalPaxCount += passengerFareItem.paxCount;
                                    }

                                    if (item.airlineCode === 'KE' || item.airlineCode === 'TW') {
                                        isFlight = true;
                                    }
                                }
                            );

                            allSegList.map(
                                (segItem: any): void => {
                                    console.info('segItem', segItem);
                                    if (!(_.isEqual(segItem.destination.countryCode, 'KR') && _.isEqual(segItem.origin.countryCode, 'KR')))
                                        isAllDomestic = false;
                                }
                            );

                            this.isAssembleKoName = (isAllDomestic && isFlight) ? true : false;
                            console.info('국내선 and (대한항공 or 티웨이)', this.isAssembleKoName);

                            this.setViewModel();
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
        // ---------[api 호출 | 항공 검색(일정)]
        console.info('[3. API 호출 끝]');
    }

    private setViewModel() {
        if (_.has(this.scheduleResultList, 'selected')) {
            this.selectedList = this.scheduleResultList.selected.detail.itineraries.map(
                (itineraryItem: any) => {
                    return this.makeFlightViewData(itineraryItem);
                }
            );

            this.amountSum = 0;
            this.scheduleResultList.selected.detail.price.fare.passengerFares.map(
                (item: any) => {
                    this.amountSum += ((item.fareAmount + item.tasfAmount + item.taxAmount) * item.paxCount);
                }
            );
        }
    }

    /**
    * makeFlightViewData
    * 비행편 정보 만들기
    *
    * @param item 비행편 상세 정보 만들 원형
    */
    private makeFlightViewData(item: any): any {
        const startDestination = item.segments[0];
        const endDestination = item.segments[item.segments.length - 1];
        const newItineraryItem: any = {
            marketingAirlineCode: startDestination.marketing.airlineCode,
            marketingAirlineNameEn: startDestination.marketing.airlineNameEn,
            marketingAirlineNameLn: startDestination.marketing.airlineNameLn,
            marketingflightNo: startDestination.marketing.flightNo,
            flyingMinutes: item.totalFlyingMinutes,
            operating: startDestination.operating && true,
            operatingAirlineCode: startDestination.operating && startDestination.operating.airlineCode,
            operatingAirlineNameEn: startDestination.operating && startDestination.operating.airlineNameEn,
            operatingAirlineNameLn: startDestination.operating && startDestination.operating.airlineNameLn,
            operatingflightNo: startDestination.operating && startDestination.operating.flightNo,
            originAirportNameLn: startDestination.origin.airportNameLn,
            originAirportCode: startDestination.origin.airportCode,
            originDate: startDestination.origin.departureDate,
            originTime: startDestination.origin.departureTime,
            originCityNameLn: startDestination.origin.cityNameLn,
            originTerminal: startDestination.origin.terminal,
            airlineNameLn: startDestination.marketing.airlineNameLn,
            airlineCode: startDestination.marketing.airlineCode,
            flightNo: startDestination.marketing.flightNo,
            destinationAirportNameLn: endDestination.destination.airportNameLn,
            destinationAirportCode: endDestination.destination.airportCode,
            destinationDate: endDestination.destination.arrivalDate,
            destinationTime: endDestination.destination.arrivalTime,
            destinationCityNameLn: endDestination.destination.cityNameLn,
            destinationterminal: endDestination.destination.terminal,
        };

        switch (item.segments.length) {
            case 0:
            case 1:
                newItineraryItem.stops = '직항';
                newItineraryItem.stopsSimple = '0';
                break;

            case 2:
                newItineraryItem.stops = `${item.segments.length - 1}회 경유`;
                newItineraryItem.stopsSimple = '1';
                break;

            default:
                newItineraryItem.stops = `${item.segments.length - 1}회 경유`;
                newItineraryItem.stopsSimple = '2';
                break;
        }

        return newItineraryItem;
    }

    /**
     * 모델 초기화 & 스토어 업데이트
     * @param id
     * @param option
     */
    modelInit(id: string, option: any, isSession?: any) {
        const storeModel: any = {
            id: id,
            option: option
        };
        if (isSession) {
            this.upsertOneSession(storeModel);
        } else {
            this.upsertOne(storeModel);
        }
        console.info(`[스토어에 ${id} 저장 끝]`);
    }

    /**
     * 스토어에 값 수정 및 저장
     * @param $obj
     */
    upsertOne($obj) {
        this.store.dispatch(upsertFlightBookingInformationPage({
            flightBookingInformationPage: _.cloneDeep($obj)
        }));
    }

    upsertOneSession($obj) {
        this.store.dispatch(upsertFlightSessionStorage({
            flightSessionStorage: _.cloneDeep($obj)
        }));
    }

    /**
     * 예약완료 페이지로 이동
     */
    goToBookingCompletePage() {
        this.flightBookingRQ = [];
        let sixMonUnderFlag: boolean = false; // 여권 만료일 6개월 true
        this.fareRuleRQ.map(
            (item: any, index: number): void => {
                console.info('goToBookingCompletePage', index);
                if (!sixMonUnderFlag) {
                    const flight: any = item.condition.flight;
                    flight.sessionKey = this.segHoldResultList[index].result.sessionKey;
                    flight.tripTypeCode = item.condition.tripTypeCode;

                    const rq: any = {
                        stationTypeCode: environment.STATION_CODE,
                        transactionSetId: this.fareRuleRQ.transactionSetId,
                        currency: 'KRW',
                        language: 'KO',
                        condition: {
                            domainAddress: window.location.hostname,
                            deviceTypeCode: 'MA', // MA: Mobile App, MW: Mobile Web, PC: PC
                            booker: {
                                name: this.travelerForm.get('userName').value,
                                userNo: this.userInfo.user.userNo,
                                email: this.travelerForm.get('email').value,
                                mobileNo: this.travelerForm.get('mobileNo').value
                            },
                            travelers: [],
                            flightItems: [flight]
                        }
                    };
                    _.forEach(this.travelers.value,
                        (subItem: any, subIndex: number) => {
                            if (!sixMonUnderFlag) {
                                console.log('item2 >', subItem);
                                console.log('travelers >', this.travelers.value);
                                const travel: any = {
                                    travelerIndex: subIndex + 1,
                                    gender: subItem.gender,
                                    ageTypeCode: subItem.ageTypeCode,
                                    nationalityCode: subItem.nationalityCode,
                                    firstName: subItem.firstName,
                                    middleName: !_.isEmpty(subItem.middleName) ? subItem.middleName : '',
                                    lastName: subItem.lastName,
                                    userNo: this.userInfo.user.userNo
                                };

                                const birthday: string = subItem.birthDay;
                                travel.birthday = [birthday.toString().slice(0, 4), birthday.toString().slice(4, 6), birthday.toString().slice(6, 8)].join('-');

                                //국내선 대한항공(KE), 티웨이항공(TW)인 경우, 한글 성과 이름 따로 입력 받고 name 성이름 붙여서 조립
                                if (this.isAssembleKoName) {
                                    travel.name = subItem.lastNameLn + subItem.firstNameLn;
                                    travel.lastNameLn = subItem.lastNameLn;
                                    travel.firstNameLn = subItem.firstNameLn;
                                } else {
                                    travel.name = subItem.name;
                                }

                                // 여권 정보 입력 필수 경우
                                if (this.apisNeededYn) {
                                    travel.passportNo = subItem.passportNo;
                                    travel.issueCountryCode = subItem.issueCountryCode;
                                    const expireDate: string = subItem.expireDate;
                                    travel.expireDate = [expireDate.toString().slice(0, 4), expireDate.toString().slice(4, 6), expireDate.toString().slice(6, 8)].join('-');

                                    const originDepartureDate = this.scheduleResultList.selected.flights[0].itineraries[0].segments[0].origin.departureDate;
                                    sixMonUnderFlag = this.comValidS.isErrorDiff(originDepartureDate, travel.expireDate, 'months', 6);
                                    if (sixMonUnderFlag) {
                                        console.info('sixMonUnderFlag', sixMonUnderFlag);
                                        this.validationAlert(null, '여권 만료일이 출발일로부터 6개월 미만으로 여권 정보 입력이 불가합니다.', '해당 여권으로 출입국 가능 여부를 반드시 확인 바랍니다.');
                                        return false;
                                    }
                                }

                                rq.condition.travelers.push(travel);
                            }
                        }
                    );


                    this.flightBookingRQ.push(rq);
                }
            }
        );

        if (!sixMonUnderFlag) {
            console.info('onSubmit flightBookingRQ', this.flightBookingRQ);

            this.flightBookingRQ.map(
                (item: any, index: number) => {
                    const lastRqBool: boolean = (index === this.flightBookingRQ.length - 1) ? true : false;
                    this.flightBookingApi(item, lastRqBool);
                }
            );
        }
    }

    flightBookingApi(rq, lastRqBool: boolean) {
        this.subscriptionList.push(
            this.apiBookingS.POST_BOOKING(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[항공 예약 res]', res.result);
                        if (res.succeedYn) {
                            if (lastRqBool) {
                                const rqInfo = {
                                    rq: this.flightBookingRQ,
                                    rs: res
                                };

                                this.modelInit(FlightStore.STORE_FLIGHT_BOOKING_RS, rqInfo, true);

                                //결제하기 페이지로 이동
                                const path = FlightCommon.PAGE_BOOKING_PAYMENT;

                                const extras = {
                                    relativeTo: this.route
                                };

                                // 페이지 이동
                                this.router.navigate([path], extras);
                            }
                        } else {
                            console.info('항공 예약 생성 실패');
                            this.bookingFailEvt();
                        }
                    },
                    (error: any) => {
                        console.info('[flight booking error]', error);
                        this.bookingFailEvt();
                    }
                )
        );
    }

    bookingFailEvt() {
        const titleTxt: string = '예약 생성에 실패 하였습니다.';
        const alertHtml: string = '다시 예약을 시도해 주세요.';
        const evtObj: any = {
            ok: {
                name: '확인',
                fun: () => {
                    this.goFlightMain();
                }
            }
        };

        this.modalConfirmEvt(
            titleTxt,
            alertHtml,
            evtObj
        );
    }

    validationAlert(targetId: any, txt?: string, alertHtmlVal?: string) {
        const defalutTxt = '입력 값이 올바르지 않은 항목이 있습니다.';
        const titleTxt: string = txt ? txt : defalutTxt;
        const alertHtml: string = alertHtmlVal ? alertHtmlVal : null;
        const evtObj: any = {
            ok: {
                name: '예',
                fun: () => { }
            },
            close: {
                fun: () => {
                    this.comValidS.scrollToTarget(targetId);
                }
            }
        };

        this.modalConfirmEvt(
            titleTxt,
            alertHtml,
            evtObj
        );
    }

    newTraveler(ageLimit?: any): FormGroup {
        //seghold 된 운임의 탑승자 생년월일 입력 정보 체크
        const birthDayValidators = [Validators.required, Validators.minLength(8)];
        if (ageLimit) {
            let returnYn: Boolean = false;
            if (ageLimit.typeCode === 'INF') {
                returnYn = this.segHoldResultList[0].result.infantReturnDateAppliedYn;
            } else if (ageLimit.typeCode === 'CHD') {
                returnYn = this.segHoldResultList[0].result.childReturnDateAppliedYn;
            }

            const itineraryLastIndex: number = this.scheduleResultList.selected.flights[0].itineraries.length - 1;
            console.info('itineraryLastIndex', itineraryLastIndex);
            const baseDate = (returnYn) ? this.scheduleResultList.selected.flights[0].itineraries[itineraryLastIndex].segments[0].origin.departureDate : this.sessionRQ.rq.condition.itineraries[0].departureDate;
            _.forEach(ageLimit.val, (item) => {
                console.info('ageLimit', item);
                const ageConfig: any = {
                    msg: '생년월일은 \'-\'를 제외한 8자리(2000101) 숫자만으로 입력해주세요.',
                    tgDay: baseDate,
                    tgAge: item.age,
                    compare: item.compare,
                    dateTitle: returnYn ? '귀국일' : '출발일',
                    ageCon: ageLimit.ageCon
                };

                birthDayValidators.push(this.comValidS.filghAgeFormValidator(ageConfig, ageLimit.typeCode));
            });
        } else {
            birthDayValidators.push(this.comValidS.customPattern({ pattern: /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/, msg: '입력한 형식이 올바르지 않습니다.' }));
        }
        console.info('newTraveler', birthDayValidators);
        const formGroupObj: any = {
            // 여행자 선택
            selectTravelers: new FormControl(''),

            // 탑승자정보
            lastName: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.maxLength(50),
                    this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' }),
                    this.comValidS.customPattern({ pattern: /([a-zA-Z])\1{2,}/g, msg: '여권상 실제 영문명을 입력해주세요.' }, true)
                ]
            ),
            middleName: new FormControl(
                '',
                [
                    Validators.maxLength(50),
                    this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' }),
                    this.comValidS.customPattern({ pattern: /([a-zA-Z])\1{2,}/g, msg: '여권상 실제 영문명을 입력해주세요.' }, true)
                ]
            ),
            firstName: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.maxLength(50),
                    this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' }),
                    this.comValidS.customPattern({ pattern: /([a-zA-Z])\1{2,}/g, msg: '여권상 실제 영문명을 입력해주세요.' }, true)
                ]
            ),
            birthDay: new FormControl('', birthDayValidators),
            gender: new FormControl('M', Validators.required),
            nationalityCode: new FormControl('', [Validators.required]),
            ageTypeCode: new FormControl(ageLimit ? ageLimit.typeCode : 'ADT')
        };

        // 한국 이름 : 성, 이름 따로 입력 받기
        if (this.isAssembleKoName) {
            formGroupObj.lastNameLn = new FormControl('', [Validators.required, Validators.maxLength(16), this.comValidS.customPattern({ pattern: /^[ㄱ-ㅎ가-힣ㅏ-ㅣ]*$/, msg: '한글만 입력해주세요.' })]);
            formGroupObj.firstNameLn = new FormControl('', [Validators.required, Validators.maxLength(16), this.comValidS.customPattern({ pattern: /^[ㄱ-ㅎ가-힣ㅏ-ㅣ]*$/, msg: '한글만 입력해주세요.' })]);
        } else {
            formGroupObj.name = new FormControl('', [Validators.required, Validators.maxLength(33), this.comValidS.customPattern({ pattern: /^[ㄱ-ㅎ가-힣ㅏ-ㅣ]*$/, msg: '한글만 입력해주세요.' })]);
        }

        //여권 정보 입력 필수 일때
        if (this.apisNeededYn) {
            formGroupObj.passportNo = new FormControl('', [Validators.required, this.comValidS.customPattern({ pattern: /^[a-zA-Z]{1,2}\d{8}/, msg: '올바른 여권번호를 입력해주세요.' })]);
            formGroupObj.expireDate = new FormControl('', [Validators.required, this.comValidS.customPattern({ pattern: /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/, msg: '입력한 형식이 올바르지 않습니다.' })]);
            formGroupObj.issueCountryCode = new FormControl('', [Validators.required]);
        }

        return this.fb.group(formGroupObj);
    }

    addTraveler(type?: any) {
        if (type) {
            this.travelers.push(this.newTraveler(this.ageLimit[type]));
        }
        else {
            this.travelers.push(this.newTraveler());
        }

        console.info('addTraveler', this.travelers);
    }

    /**
     * 모든 bsModalService 닫기
     */
    closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    onSchedule() {
        console.info('[스케쥴 | 정보]');
        const initialState = {
            rs: this.scheduleResultList,
            rq: this.resolveData.rq
        };
        this.bsModalScheduleRef = this.bsModalService.show(FlightModalScheduleInformationComponent, { initialState, ...this.configInfo });
    }

    onPayDetail() {
        console.info('[총 결제 금액 | 정보]');
        const initialState = {
            rs: this.scheduleResultList
        };
        this.bsModalDetailRef = this.bsModalService.show(FlightModalPaymentDetailComponent, { initialState, ...this.configInfo });
    }

    /**
     * 요금, 취소수수료 규정
     * @param event
     * @param storeId normal:일반규정 | cancel:취소규정 | personalInfo:개인정보취급방침
     */
    onAgreementClick(event: MouseEvent, storeId: string) {
        event && event.preventDefault();
        console.info('[요금, 취소수수료 규정]', event);
        let tabNumber: number;
        const baggageList: Array<string> = [];
        this.scheduleResultList.selected.flights.map(
            (item: any): void => {
                _.forEach(item.price.fares[0].passengerFares, (item1) => {
                    const ageName: string = TravelerTypeKr[item1.ageTypeCode];
                    let segCount: number = 0;
                    _.forEach(item1.itineraries, (item2) => {
                        _.forEach(item2.segments, (item3) => {
                            // 무료수하물 유무
                            if (_.has(item3, 'freeBaggage')) {
                                if (_.isEmpty(baggageList[segCount])) {
                                    baggageList[segCount] = `${ageName} ${item3.freeBaggage}`;
                                } else {
                                    baggageList[segCount] += `/${ageName} ${item3.freeBaggage}`;
                                }
                            }
                            segCount++;
                        });
                    });

                    console.log(_.cloneDeep(baggageList));
                });
            }
        );


        const initialState = {
            storeId: storeId,
            rs: this.fareRuleResultList,
            baggageList: baggageList,
            okFun: ((store) => {
                console.info('[okFun]',);
                if (store === 'normal')
                    tabNumber = 0;
                else if (store === 'cancel')
                    tabNumber = 1;
                else if (store === 'personalInfo')
                    tabNumber = 2;

                this.onChangeAgreement(tabNumber);

            })
        };
        this.bsModalScheduleRef = this.bsModalService.show(FlightModalAgreementComponent, { initialState, ...this.configInfo });
    }

    onSelectTravelers(event: any, idx: number) {
        event && event.preventDefault();

        const travelersFormGroup: FormGroup = this.travelers.controls[idx] as FormGroup;
        const selectTraveler: any = travelersFormGroup.get('selectTravelers').value;

        if (selectTraveler) {
            let birthday = selectTraveler.birthday;
            if (!_.isEmpty(selectTraveler.birthday)) {
                birthday = String(selectTraveler.birthday).replace(/-/gi, '');
            }
            //form value patch
            if (!this.isAssembleKoName) {
                travelersFormGroup.get('name').patchValue(selectTraveler.name);
            }

            travelersFormGroup.get('lastName').patchValue(selectTraveler.lastName);
            travelersFormGroup.get('middleName').patchValue(selectTraveler.middleName);
            travelersFormGroup.get('firstName').patchValue(selectTraveler.firstName);
            travelersFormGroup.get('birthDay').patchValue(birthday);
            travelersFormGroup.get('gender').patchValue(selectTraveler.gender);
        } else {
            //form value patch
            Object.entries(travelersFormGroup.controls).map(
                ([key, item]): void => {
                    if (key !== 'selectTravelers')
                        item.patchValue('');
                }
            );
            travelersFormGroup.get('gender').patchValue('M');
        }


        if (event.target.value) {
            this.traveler[(event.target.selectedIndex - 1)].active = true;
        } else {
            _.forEach(this.traveler, (item: any) => {
                item.active = false;
            });
        }
    }

    /**
     * 나중에 등록하기 클릭 이벤트(여권정보 필수값 해제 / 설정)
     * @param idx FormArray 인덱스
     */
    onCheckedUsePassportLater(idx: number) {
        const travelersFormGroup: FormGroup = this.travelers.controls[idx] as FormGroup;

        if (!this.apisNeededYn) {
            travelersFormGroup.controls['passportNo'].clearValidators();
            travelersFormGroup.controls['passportNo'].updateValueAndValidity();
            travelersFormGroup.controls['expireDate'].clearValidators();
            travelersFormGroup.controls['expireDate'].updateValueAndValidity();
        } else {
            travelersFormGroup.controls['passportNo'].setValidators([Validators.required]);
            travelersFormGroup.controls['passportNo'].updateValueAndValidity();
            travelersFormGroup.controls['expireDate'].setValidators([Validators.required]);
            travelersFormGroup.controls['expireDate'].updateValueAndValidity();
        }
    }

    /**
     * 약관 체크
     */
    onChangeAgreement(idx: number, event?: any) {
        event && event.preventDefault();
        let chkBool: boolean = true;

        //checkbox change 이벤트 발생 시
        if (!_.isEmpty(event)) {
            //checked false 경우
            if (!event.target.checked)
                chkBool = false;
        }

        //form update
        this.agreeList.controls[idx].setValue(chkBool);

        //모든 동의 checkbox checked
        const isTotChk = _.every(this.agreeList.value);
        const totChk = this.element.querySelector(`[data-target="agreeAllChk"] input[type='checkbox']`);
        if (isTotChk) { // 모두 동의
            totChk.checked = true;
        } else {
            totChk.checked = false;
        }

        console.info('[onChangeAgreement formArray]', this.agreeList);
    }

    /**
     * 모든 약관에 동의 체크박스 이벤트
     * @param event
     */
    onChangeAllAgreement(event: any) {
        event && event.preventDefault();
        const tgElList = this.element.querySelectorAll(`[data-target="agreeChk"] input[type='checkbox']`);
        if (event.target.checked) {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = true;
                this.agreeList.controls[index].setValue(true);
            });
        } else {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = false;
                this.agreeList.controls[index].setValue(false);
            });
        }
    }

    /**
     * 최종 예약 완료
     */
    onSubmit() {
        const titleTxt: string = '※여권 정보 안내사항';
        let alertHtml: string = '- 항공권 발권 및 탑승을 위해 탑승객의 여권과 동일한 영문명, 생년월일, 성별 및 여권 정보로 입력하셔야 합니다.<br/>';
        alertHtml += '- 예약된 영문명이 여권상의 영문명 스펠링과 다를 경우 탑승이 불가합니다. (띄어쓰기나 "-"표시 제외)<br/>';
        alertHtml += '- 예약 완료 후에는 탑승객 영문명 및 여권정보 수정이 불가하므로 정확한 정보 입력 후 재확인 부탁 드립니다.<br/>';
        alertHtml += '- 여권 만료일이 출발일로부터 6개월 미만인 경우 출입국시 문제가 발생할 수 있으므로 예약 시 직접 확인하시길 바랍니다.';
        const evtObj: any = {
            ok: {
                name: '예',
                fun: () => {
                    this.flightBookingValidCheck();
                }
            },
            cancel: {
                name: '아니오',
                fun: () => { }
            }
        };
        this.modalConfirmEvt(
            titleTxt,
            alertHtml,
            evtObj
        );
    }

    searchStateOff() {
        this.searchBool = false;
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
        if (num === 1) this.travelerForm.get('userName').patchValue('');
        else if (num === 2) this.travelerForm.get('mobileNo').patchValue('');
        else if (num === 3) this.travelerForm.get('email').patchValue('');
    }

    /**
     *
     * @param titleTxt
     * @param alertHtml
     * @param evtObj
     */
    private modalConfirmEvt(titleTxt: string, alertHtml: string, evtObj: any) {
        const initialState: any = {
            titleTxt: titleTxt
        };

        if (alertHtml)
            initialState.alertHtml = alertHtml;

        if (evtObj.ok) {
            initialState.okObj = {
                name: evtObj.ok.name,
                fun: evtObj.ok.fun
            };
        }

        if (evtObj.cancel) {
            initialState.cancelObj = {
                name: evtObj.cancel.name,
                fun: evtObj.cancel.fun
            };
        }

        if (evtObj.close)
            initialState.closeObj = { fun: () => { } };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...this.configInfo });
        if (evtObj.close) {
            this.subscriptionList.push(
                this.bsModalService.onHidden
                    .subscribe(
                        () => {
                            evtObj.close.fun();
                        }
                    )
            );
        }

    }

    /**
     * 항공 메인 이동
     */
    private goFlightMain() {
        const path = `/${FlightCommon.PAGE_BOOKING_PAYMENT}/`;
        this.router.navigate([path]);
    }

    /*
     * 마이페이지 이동
     */

    private myBookingListLink() {
        const rqInfo: any =
        {
            'selectCode': '2',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.userInfo.user.userNo
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        this.router.navigate([path]);
    }

    private flightBookingValidCheck() {
        this.submitted = true;
        if (this.travelerForm.valid) {
            let segFlag: boolean = true;
            _.forEach(this.segHoldResultList, (item: any, index: number) => {
                console.info(index);
                const res: any = item.result;
                // 두번 이상 중복 예약
                if (segFlag && res.dupplicatedYn) {
                    segFlag = false;
                    const titleTxt: string = '동일한 탑승객과 여정으로 예약이 존재하여 추가 예약이 불가합니다.';
                    const alertHtml: string = '기존 예약 취소 후 재예약 바랍니다.';
                    const evtObj: any = {
                        ok: {
                            name: '예',
                            fun: () => {
                                this.myBookingListLink();
                            }
                        },
                        cancel: {
                            name: '아니오',
                            fun: () => {
                                this.goFlightMain();
                            }
                        }
                    };
                    this.modalConfirmEvt(
                        titleTxt,
                        alertHtml,
                        evtObj
                    );
                    return false;
                }

                // 반복적인 취소 및 재 예약
                if (segFlag && res.churnedYn) {
                    segFlag = false;
                    const titleTxt: string = '동일한 탑승객과 여정으로 예약 및 취소가 반복되어 해당 일정으로는 더 이상 이용이 불가합니다.';
                    const evtObj: any = {
                        ok: {
                            name: '확인',
                            fun: () => {
                                this.goFlightMain();
                            }
                        }
                    };
                    this.modalConfirmEvt(
                        titleTxt,
                        null,
                        evtObj
                    );
                }
            });

            if (segFlag) {
                //편도+편도 조합 예약 알림
                let scheduleFlag = true;
                if (this.scheduleResultList.selected.flights.length > 1) {
                    scheduleFlag = false;
                    console.info('scheduleResultList');
                    const titleTxt: string = '선택 하신 항공 스케줄은 2건의 예약으로 분리 진행 되는 예약입니다.';
                    const alertHtml: string = '예약하신 이후의 변경, 취소 하시는 경우<br/>각각 접수 하셔야 합니다.<br/>예약을 진행하시겠습니까?';
                    const evtObj: any = {
                        ok: {
                            name: '예',
                            fun: () => {
                                this.goToBookingCompletePage();
                            }
                        },
                        cancel: {
                            name: '아니오',
                            fun: () => {
                                this.goFlightMain();
                            }
                        }
                    };
                    this.modalConfirmEvt(
                        titleTxt,
                        alertHtml,
                        evtObj
                    );
                }

                if (scheduleFlag)
                    this.goToBookingCompletePage();
            }

        } else {
            _.forEach(this.travelerForm.controls, (formVal, key) => {
                if (!formVal.valid) {
                    let targetId: any = key;
                    if (key === 'travelers') {
                        let flag = true;
                        _.forEach(
                            this.travelers.controls,
                            (formVal2: FormGroup, index2: number) => {
                                if (flag && !formVal2.valid) {
                                    console.info(index2, '[$val2 | 유효성 체크 실패]', formVal2);
                                    targetId = this.comValidS.getFirstErrorKeyValidation(formVal2) + index2;
                                    flag = false;
                                }
                            }
                        );
                    }
                    this.validationAlert(targetId);
                    return false;
                }
            });
        }
    }

}
