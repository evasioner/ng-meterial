import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { takeWhile, catchError, finalize } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { upsertFlightBookingInformationPage } from 'src/app/store/flight-booking-information-page/flight-booking-information-page/flight-booking-information-page.actions';
import { upsertFlightSessionStorage } from 'src/app/store/flight-common/flight-session-storage/flight-session-storage.actions';
import { clearFlightSearchResults } from '@/app/store/flight-common/flight-search-result/flight-search-result.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiFlightService } from 'src/app/api/flight/api-flight.service';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PageCodes } from 'src/app/common-source/enums/page-codes.enum';
import { CabinClassCode } from '@/app/common-source/enums/cabin-class-code.enum';
import { TravelerType } from '@/app/common-source/enums/traveler-type.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { FlightModalAgreementComponent } from './modal-components/flight-modal-agreement/flight-modal-agreement.component';
import { FlightModalScheduleComponent } from 'src/app/common-source/modal-components/flight-modal-schedule/flight-modal-schedule.component';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-flight-booking-information-page',
    templateUrl: './flight-booking-information-page.component.html',
    styleUrls: ['./flight-booking-information-page.component.scss']
})
export class FlightBookingInformationPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    travelerForm: FormGroup;

    fareRuleResultList: any;
    segHoldResultList: any = [];
    scheduleResultList: any;

    fareRuleRQ: any;
    sessionRQ: any;

    loadingBool: Boolean = false;
    loadingBool2: Boolean = false;

    rxAlive: boolean = true;
    totalPaxCount: number = 0;

    userInfo: any = {};
    traveler: any;
    commonUserInfo$: any;

    howMany: any = '';

    travlerArray: Array<string>;

    headerInfo: any = {
        title: null,
        date: null,
        detail: null
    };

    submitted: any;

    steps: any = [];

    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };
    public element: any;

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

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private bsModalService: BsModalService,
        private apiflightSvc: ApiFlightService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<any>,
        private fb: FormBuilder,
        private loadingBar: LoadingBarService,
        public jwtService: JwtService,
        private comValidS: CommonValidatorService,
        private el: ElementRef,
        private storageS: StorageService,
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
        this.storeClear();
        this.subscribeInit();
        this.sessionInit();
        this.travlerArray = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadingBar.start();
        console.info('[ngOnInit > 탑승자 정보 입력]');
        console.info('[스토어에 flight-booking-info 저장 시작]', this.sessionRQ);
        this.modelInit('flight-booking-info', this.sessionRQ);

        console.info('[2. 헤더 초기화 시작]');
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

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    get travelers(): FormArray {
        return this.travelerForm.get('travelers') as FormArray;
    }

    get agreeList(): FormArray {
        return this.travelerForm.get('agreeList') as FormArray;
    }

    private formInit() {
        this.travelerForm = this.fb.group({
            userName: new FormControl('', [Validators.required, this.customPatternValid({ pattern: /^[ㄱ-ㅎ가-힣ㅏ-ㅣ]*$/, msg: '한글만 입력해주세요.' })]),
            userNo: new FormControl('', [Validators.required]),
            mobileNo: new FormControl('', [Validators.required, Validators.minLength(10), this.customPatternValid({ pattern: /^[0-9]*$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })]),
            email: new FormControl('', [Validators.required, Validators.email]),

            // 여행자
            travelers: this.fb.array([]),

            // 약관동의
            agreeList: this.fb.array([new FormControl(false), new FormControl(false), new FormControl(false)], [this.comValidS.validateAgreeList])
        });
    }

    private storeClear() {
        this.store.dispatch(clearFlightSearchResults());
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(commonUserInfoSelectors.getSelectId(['commonUserInfo']))
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[userInfo]', ev);
                        if (ev) {
                            this.userInfo = ev.userInfo;
                            this.traveler = ev.traveler;

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
        const sessionItem = JSON.parse(sessionStorage.getItem('flight-common'));

        if (!_.isEmpty(sessionItem.flightSessionStorages.entities)) {
            this.sessionRQ = sessionItem.flightSessionStorages.entities['flight-booking-information'].option;
            this.fareRuleRQ = sessionItem.flightSessionStorages.entities['flight-booking-information'].option.fareRuleRq;
        }
    }

    /**
    * 페이지 초기화
    * 2. 헤더 초기화
    * @param resolveData
    */
    async pageInit(resolveData) {
        let headerTitle = '';
        let headerTime = '';
        let originDatetime: any = '';
        let destDateTime: any = '';
        let howManyTxt: any = '';
        let detail: any = '';

        this.headerInit();
        // ---------[헤더 초기화]
        console.log(resolveData, 'resolveData');
        originDatetime = resolveData.rq.condition.itineraries[0].departureDate;
        // 편도
        switch (resolveData.rq.condition.tripTypeCode) {
            case 'OW':
                detail = '편도';
                headerTitle = `${resolveData.rq.condition.itineraries[0].originCityCodeIata} - ${resolveData.rq.condition.itineraries[0].destinationCityCodeIata}`;
                originDatetime = resolveData.rq.condition.itineraries[0].departureDate;
                headerTime = `${moment(originDatetime).format('MM.DD(dd)')}`;
                break;

            case 'RT':
                detail = '왕복';
                headerTitle = `${resolveData.rq.condition.itineraries[0].originCityCodeIata} - ${resolveData.rq.condition.itineraries[0].destinationCityCodeIata}`;
                destDateTime = resolveData.rq.condition.itineraries[1].departureDate;
                headerTime = `${moment(originDatetime).format('MM.DD(dd)')} - ${moment(destDateTime).format('MM.DD(dd)')}`;
                break;

            case 'MD':
                detail = '다구간';
                headerTitle = `${resolveData.rq.condition.itineraries[0].originCityCodeIata} - ${resolveData.rq.condition.itineraries[0].destinationCityCodeIata}외 ${resolveData.rq.condition.itineraries.length - 1}구간`;
                destDateTime = resolveData.rq.condition.itineraries[resolveData.rq.condition.itineraries.length - 1].departureDate;
                headerTime = `${moment(originDatetime).format('MM.DD(dd)')} - ${moment(destDateTime).format('MM.DD(dd)')}`;
                break;
        }

        this.howMany = resolveData.rq.condition.adultCount + resolveData.rq.condition.childCount + resolveData.rq.condition.infantCount;

        howManyTxt = `성인 ${resolveData.rq.condition.adultCount}명`;
        howManyTxt += resolveData.rq.condition.childCount ? `,아동 ${resolveData.rq.condition.childCount}명` : '';
        howManyTxt += resolveData.rq.condition.infantCount ? `,유아 ${resolveData.rq.condition.infantCount}명` : '';

        this.headerInfo.title = headerTitle;
        this.headerInfo.date = headerTime;
        this.headerInfo.detail = `${detail}/${howManyTxt}/${CabinClassCode[resolveData.rq.condition.cabinClassCode]}`;

        // this.headerInit('user-information', headerTitle, headerTime);
        // ---------[헤더 초기화]
        console.info('[2. 헤더 초기화 끝]');


        console.info('[3. API 호출]');

        this.flightSearch(resolveData.rq);

        _.forEach(this.fareRuleRQ, (item, idx: number) => {
            const segHoldRq: any = _.cloneDeep(item);
            segHoldRq.condition.cabinClassCode = item.condition.flight.price.fare.passengerFares[0].itineraries[0].segments[0].cabinClassCode;
            segHoldRq.condition.adultCount = resolveData.rq.condition.adultCount;
            segHoldRq.condition.childCount = resolveData.rq.condition.childCount;
            segHoldRq.condition.infantCount = resolveData.rq.condition.infantCount;
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
                        finalize(() => this.loadingBar.complete())
                    )
                    .subscribe(
                        ([res1, res2]: any) => {
                            /**
                           * res1 : 항공 운임규정 조회 정보
                           * res2 : 항공 Seg Hold 정보
                           * res3 : 항공검색 정보
                           */
                            console.info('[res1', res1);
                            console.info('[res2', res2);
                            if (res1.succeedYn && res2.succeedYn) {
                                console.log(resolveData, 'resolveData');
                                console.log(item, 'item');

                                this.fareRuleResultList = _.cloneDeep(res1);

                                console.info('[스토어에 flight-fareRule-rs 저장]');
                                this.modelInit('flight-fareRule-rs', this.fareRuleResultList);

                                const resSegHold: any = _.cloneDeep(res2);
                                this.segHoldResultList[idx] = resSegHold;
                                console.log('segHoldResultList', this.segHoldResultList);

                                if (!this.segHoldResultList[0].result.bookableYn) {
                                    alert('좌석 확보에 실패했습니다. 다른 항공편을 이용바랍니다.');
                                    return;
                                }

                                if (idx === 0) this.travlerArrayInit(resolveData);
                                this.loadingBool = true;
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
    * 항공 검색
    * 3. api 호출
    * @param $resolveData
    */
    async flightSearch($request) {
        // ---------[api 호출 | 항공 검색(일정)]
        await this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY($request)
            .toPromise()
            .then((res: any) => {
                console.info('[API 호출 | 항공일정 리스트 >]', res);
                if (res.succeedYn) {
                    this.scheduleResultList = _.cloneDeep(res['result']);    // 항공 검색결과(RS)
                    for (const passengerFareItem of this.scheduleResultList.selected.flights[0].price.fares[0].passengerFares) {
                        this.totalPaxCount += passengerFareItem.paxCount;
                    }
                    console.info('[totalPaxCount >]', this.totalPaxCount);
                    this.stepsInit();
                    this.loadingBool2 = true;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.errorMessage);
            });
        console.info('[3. API 호출 끝]');
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

    goToBookingCompletePage() {
        const rqInfo: any = [];
        _.forEach(this.fareRuleRQ, (item, idx) => {
            const flight: any = item.condition.flight;
            flight.sessionKey = this.segHoldResultList[idx].result.sessionKey;
            flight.tripTypeCode = item.condition.tripTypeCode;

            // booking API에서 사용되지 않음..
            // delete flight.flightIndex;


            console.log('iiiiii item : ', item);
            console.log('ffffff flight : ', flight);


            const rq: any = {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',
                language: 'KO',
                condition: {
                    domainAddress: 'minim',
                    deviceTypeCode: 'PC', // MA: Mobile App, MW: Mobile Web, PC: PC
                    booker: {
                        name: this.travelerForm.get('userName').value,
                        userNo: this.userInfo.user.userNo,
                        email: this.travelerForm.get('email').value,
                        mobileNo: this.travelerForm.get('mobileNo').value
                    },
                    travelers: [

                    ],
                    flightItems: [
                        flight
                    ]
                }
            };

            /**
             * 예약완료 페이지로 이동
             */
            _.forEach(this.travelers.value, (item2, idx2) => {
                console.log('item2 >', item2);
                console.log('travelers >', this.travelers.value);
                const travel: any = {
                    travelerIndex: idx2 + 1,
                    name: item2.name,
                    gender: item2.gender,
                    ageTypeCode: 'ADT',
                    nationalityCode: item2.nationalityCode,
                    lastName: item2.lastName,
                    firstName: item2.firstName,
                    userNo: this.userInfo.user.userNo
                };

                const birthday: string = item2.birthDay;

                travel.birthday = [birthday.toString().slice(0, 4), birthday.toString().slice(4, 6), birthday.toString().slice(6, 8)].join('-');
                travel.middleName = !_.isEmpty(item2.middleName) ? item2.middleName : '';

                // 여권 정보 - 나중에 등록하기 체크값 [false] 일때
                if (!item2.usePassportLater) {
                    travel.passportNo = item2.passportNo;
                    travel.issueCountryCode = item2.issueCountryCode;
                    const expireDate: string = item2.expireDate;
                    travel.expireDate = [expireDate.toString().slice(0, 4), expireDate.toString().slice(4, 6), expireDate.toString().slice(6, 8)].join('-');
                }

                rq.condition.travelers.push(travel);
            });

            rqInfo.push(rq);
        });

        console.info('[rqInfo >]', rqInfo);

        this.modelInit('flight-booking', rqInfo, true);

        //결제하기 페이지로 이동
        // const base64Str = this.base64Svc.base64EncodingFun(rqInfo);
        const path = '/flight-booking-payment/';

        const extras = {
            relativeTo: this.route
        };

        // 페이지 이동
        this.router.navigate([path], extras);
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
            this.travelerForm.get('userName').patchValue('');
        else if (num === 2)
            this.travelerForm.get('mobileNo').patchValue('');
        else if (num === 3)
            this.travelerForm.get('email').patchValue('');
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_FLIGHT
        };
    }

    stepsInit() {
        const tripTypecode = this.scheduleResultList.selected.flights[0].tripTypeCode;

        const owStep = [
            {
                code: 1,
                txt: '가는편선택',
            }
        ];

        if (tripTypecode === 'MD') {
            for (let i = 0; i < this.scheduleResultList.selected.flights[0].itineraries.length; i++) {
                const step: any = {
                    code: i + 1,
                    txt: `구간${i + 1}선택`
                };

                this.steps[i] = step;
            }
        } else {
            // 왕복일경우 추가
            if (tripTypecode === 'RT') {
                owStep[1] = {
                    code: 2,
                    txt: '오는편선택'
                };
            }

            this.steps = owStep;
        }

        // 마지막 스텝에 결제하기 추가
        this.steps[this.steps.length] = {
            code: this.steps.length + 1,
            txt: '결제하기'
        };
    }

    /**
     * 커스텀 밸리데이션
     * @param config pattern 값, error 메시지
     */
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
     * 편도
     * 왕복 or 다구간 : 귀국일 기준으로 나이체크 해야할 경우 (itinerary 마지막 배열의 segments[0].origin.departureDate)
     */
    newTraveler(ageLimit?: any): FormGroup {
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

        return this.fb.group({
            // 여행자 선택
            selectTravelers: new FormControl(''),

            // 탑승자정보
            name: new FormControl('', [Validators.required, Validators.maxLength(33), this.comValidS.customPattern({ pattern: /^[ㄱ-ㅎ가-힣ㅏ-ㅣ]*$/, msg: '한글만 입력해주세요.' })]),
            lastName: new FormControl('', [Validators.required, Validators.maxLength(50), this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })]),
            middleName: new FormControl('', [this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })]),
            firstName: new FormControl('', [Validators.required, Validators.maxLength(50), this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })]),
            birthDay: new FormControl('', birthDayValidators),
            gender: new FormControl('M', Validators.required),

            // 여권정보
            usePassportLater: new FormControl(false), // 지금 등록(false) , 나중에 등록하기(true)
            passportNo: new FormControl('', [Validators.required, this.comValidS.customPattern({ pattern: /^[a-zA-Z]{1,2}\d{8}/, msg: '올바른 여권번호를 입력해주세요.' })]),
            expireDate: new FormControl('', [Validators.required, this.comValidS.customPattern({ pattern: /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/, msg: '입력한 형식이 올바르지 않습니다.' })]),
            nationalityCode: new FormControl('KO'),
            issueCountryCode: new FormControl('KO'),
        });

    }

    addTraveler(type?: any) {
        if (type)
            this.travelers.push(this.newTraveler(this.ageLimit[type]));
        else
            this.travelers.push(this.newTraveler());
    }

    onSchedule() {
        const initialState = {
            rq: this.sessionRQ.rq,
            rs: { result: this.scheduleResultList }
        };

        this.bsModalService.show(FlightModalScheduleComponent, { initialState, ...this.configInfo });
    }

    /**
    * 요금, 취소수수료 규정
    * @param event
    * @param storeId normal:일반규정 | cancel:취소규정 | personalInfo:개인정보취급방침
    */
    onAgreementClick(event, storeId) {
        event && event.preventDefault();
        console.info('[요금, 취소수수료 규정]', event);
        let tabNumber: number;
        const baggageList: Array<string> = [];
        this.scheduleResultList.selected.flights.map(
            (item: any): void => {
                item.price.fares.map(
                    (fareItem: any, fareIndex: number): any => {

                        if (fareIndex === 0) {
                            fareItem.passengerFares.map(
                                (passengerItem: any) => {

                                    let segCount: number = 0;
                                    passengerItem.itineraries.map(
                                        (itineraryItem: any) => {

                                            itineraryItem.segments.map(
                                                (segItem: any) => {
                                                    if (_.has(segItem, 'freeBaggage')) {
                                                        if (_.isEmpty(baggageList[segCount])) {
                                                            baggageList[segCount] = `${TravelerType[passengerItem.ageTypeCode]} ${segItem.freeBaggage}`;
                                                        } else {
                                                            baggageList[segCount] += `/${TravelerType[passengerItem.ageTypeCode]} ${segItem.freeBaggage}`;
                                                        }
                                                    }

                                                    segCount++;
                                                }
                                            );

                                        }
                                    );

                                }
                            );
                        }

                    }
                );
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
        this.bsModalService.show(FlightModalAgreementComponent, { initialState, ...this.configInfo });
    }

    /**
     * 나중에 등록하기 클릭 이벤트(여권정보 필수값 해제 / 설정)
     * @param idx FormArray 인덱스
     */
    onCheckedUsePassportLater(idx: number) {
        const travelersFormGroup: FormGroup = this.travelers.controls[idx] as FormGroup;

        if (travelersFormGroup.get('usePassportLater').value) {
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

    onSelectTravelers(idx: number) {
        console.log('idx >', idx);

        const travelersFormGroup: FormGroup = this.travelers.controls[idx] as FormGroup;

        const selectTraveler: any = travelersFormGroup.get('selectTravelers').value;
        console.log('selectTraveler >', selectTraveler);

        let birthday = selectTraveler.birthday;
        if (!_.isEmpty(selectTraveler.birthday)) {
            birthday = String(selectTraveler.birthday).replace(/-/gi, '');
        }

        travelersFormGroup.get('name').patchValue(selectTraveler.name);
        travelersFormGroup.get('lastName').patchValue(selectTraveler.lastName);
        travelersFormGroup.get('middleName').patchValue(selectTraveler.middleName);
        travelersFormGroup.get('firstName').patchValue(selectTraveler.firstName);
        travelersFormGroup.get('birthDay').patchValue(birthday);
        travelersFormGroup.get('gender').patchValue(selectTraveler.gender);
    }

    /**
     * 최종 예약 완료
     */
    onSubmit() {
        this.submitted = true;

        console.info('[travelerForm.value >]', this.travelerForm.value);
        console.info('[travelerForm.valid >]', this.travelerForm.valid);
        if (this.travelerForm.valid) {
            this.goToBookingCompletePage();
        } else {
            this.inValidAlert();
            return false;
        }

    }

    inValidAlert() {
        const initialState = {
            titleTxt: '입력 값이 올바르지 않은 항목이 있습니다.',
            closeObj: { fun: () => { } },
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }
}
