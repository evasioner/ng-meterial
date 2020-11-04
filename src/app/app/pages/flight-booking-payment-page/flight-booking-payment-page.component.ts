import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators, ValidatorFn, FormControl, FormArray } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { upsertFlightSessionStorage } from 'src/app/store/flight-common/flight-session-storage/flight-session-storage.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';
import { ApiPaymentService } from '@/app/api/payment/api-payment.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { CardMonthSet, CardSet, PaymentStyle } from '@/app/common-source/models/booking.model';
import { PaymnetStyleSet, UseCardSet } from './models/flight-booking-payment-page.model';

import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';
import { TravelerTypeKr } from '@/app/common-source/enums/common/traveler-type.enum';
import { CabinClass } from '@/app/common-source/enums/flight/cabin-class.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { FlightStore } from '@/app/common-source/enums/flight/flight-store.enum';

@Component({
    selector: 'app-flight-booking-payment-page',
    templateUrl: './flight-booking-payment-page.component.html',
    styleUrls: ['./flight-booking-payment-page.component.scss']
})
export class FlightBookingPaymentPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscriptionList: Subscription[];
    public pageForm: any;

    public ctx: any = this;
    public headerType: any;
    public headerConfig: any;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private apibookingSvc: ApiBookingService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<any>,
        private fb: FormBuilder,
        private bsModalService: BsModalService,
        private apiPaymentS: ApiPaymentService,
        private location: Location,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    get payment(): FormArray {
        return this.pageForm.get('payment') as FormArray;
    }

    /**
     * initialize
     * 초기화
     */
    private initialize(): void {
        this.dataModel = {};
        this.sessionInit();
        this.subscriptionList = [];
        this.viewModel = {
            useCardList: UseCardSet,
            cardList: CardSet,
            cardMonthList: CardMonthSet,
            loadingFlag: true,
            paymentStyleList: PaymnetStyleSet
        };
        this.pageForm = this.fb.group({
            // 결제 수단
            payment: this.fb.array([])
        });
        this.dataModel.request.map(
            (item: any) => {
                this.viewModel.travelerList = item.condition.travelers;
                console.log(item);

                this.flightSearch(item);
            }
        );

        this.addPaymnet();
        this.viewModel.passengerFareList = this.parsePassengerFare();
        this.viewModel.passengerCount = this.viewModel.passengerFareList.length;
        console.log(this.dataModel)
        this.headerSet(this.dataModel.itiineraryRq);
    }

    /**
    * sessionInit
    * 세션 저장 데이터 꺼내기
    */
    private sessionInit(): void {
        const sessionItem = JSON.parse(localStorage.getItem(FlightStore.STORE_COMMON));

        if (!_.isEmpty(sessionItem.flightSessionStorages.entities)) {
            const bookingRsOption = sessionItem.flightSessionStorages.entities[FlightStore.STORE_FLIGHT_BOOKING_RS].option;
            this.dataModel.request = bookingRsOption.rq;
            this.dataModel.response = bookingRsOption.rs;
            this.dataModel.itiineraryRq = sessionItem.flightSessionStorages.entities[FlightStore.STORE_FLIGHT_BOOKING_INFORMATION].option;
        } else {
            // 에러 시 처리 어쩌지?
        }

        console.log(_.cloneDeep(this.viewModel));
    }

    /**
     * parsePassengerFare
     * 각각 낼 시 1인 요금 꺼내기
     *
     * @returns Array<any>
     */
    private parsePassengerFare(): Array<any> {
        let newList = [];

        this.dataModel.request.map(
            (item: any) => item.condition.flightItems.map(
                (flightItem: any) => {
                    this.viewModel.amount = flightItem.price.fare;
                    flightItem.price.fare.passengerFares.map(
                        (passengerItem: any) => {
                            newList = new Array(passengerItem.paxCount)
                                .fill(null)
                                .map(
                                    (val: any, index: number): any => {
                                        console.log(this.viewModel.travelerList[index]);

                                        return {
                                            userInfo: `${TravelerTypeKr[_.upperCase(this.viewModel.travelerList[index].ageTypeCode)]}${(index + 1)}, ${this.viewModel.travelerList[index].firstName}/${this.viewModel.travelerList[index].lastName}`,
                                            amountSum: (flightItem.price.fare.tasfAmountSum / passengerItem.paxCount) + passengerItem.amountSum
                                        };
                                    }
                                );
                        }
                    );
                }
            )
        );

        return newList;
    }

    private addPaymnet() {
        this.payment.push(
            this.fb.group({
                cardHolderTypeCode: new FormControl('', Validators.required),
                cardMasterCode: new FormControl('', Validators.required),
                cardNo: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(1),
                        Validators.maxLength(16),
                        this.customPatternValid({ pattern: /^[0-9]*$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })
                    ]
                ),
                cardHolderName: new FormControl(
                    '',
                    [
                        Validators.required,
                        this.customPatternValid({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
                    ]
                ),
                cardHolderBirthday: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        this.customPatternValid({ pattern: /^(((19|20)([2468][048]|[13579][26]|0[48])|2000)0229|((19|20)[0-9]{2}(0[4678]|1[02])(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}(0[1359]|11)(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}02(0[1-9]|1[0-9]|2[0-8])))/, msg: '입력한 형식이 올바르지 않습니다.' })
                    ]
                ),
                cardValidPeriod: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(4),
                        Validators.minLength(4),
                        this.customPatternValid({ pattern: /^\d*$/, msg: '\'/\'를 제외한 숫자만 입력해주세요.' })
                    ]
                ),
                // 할부
                cardQuotaMonth: new FormControl('', Validators.required),
                // 문의 필요
                // cardHolderRelationCode: new FormControl('',),
                cardPassword: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(2),
                        this.customPatternValid({ pattern: /\d{2}/, msg: '비밀번호 앞 2자리를 입력해주세요.' })
                    ]
                ),
                // 항공만 각각 결제일 경우 값이 들어감
                // bookingTravelerCode: new FormControl('')
            })
        );
    }

    /**
     * headerSet
     * 헤더 표시에 필요한 데이터 설정
     *
     * @param resolveData session에 저장되었던 데이터
     */
    private headerSet(resolveData: any): void {
        const momentRange = extendMoment(moment);
        const headerTitle = '결제하기';
        let headerTime = '';
        let originDatetime: any = '';
        let destDateTime: any = '';
        let range: any = '';
        let howMany: number = 0;
        // ---------[헤더 초기화]

        console.log(resolveData);
        // 편도
        if (resolveData.rq.condition.tripTypeCode == 'OW') {
            originDatetime = resolveData.rq.condition.itineraries[0].departureDate;
            howMany = resolveData.rq.condition.adultCount + resolveData.rq.condition.childCount + resolveData.rq.condition.infantCount;
            headerTime = `${moment(originDatetime).format('MM.DD')}, ${howMany} 명, ${CabinClass[resolveData.rq.condition.cabinClassCode]}`;
            // 왕복, 다구간
        } else {
            originDatetime = resolveData.rq.condition.itineraries[0].departureDate;
            // 왕복
            if (resolveData.rq.condition.tripTypeCode == 'RT') {
                destDateTime = resolveData.rq.condition.itineraries[1].departureDate;
                // 다구간
            } else {
                destDateTime = resolveData.rq.condition.itineraries[resolveData.rq.condition.itineraries.length - 1].departureDate;
            }
            range = momentRange.range(originDatetime, destDateTime);
            howMany = resolveData.rq.condition.adultCount + resolveData.rq.condition.childCount + resolveData.rq.condition.infantCount;
            headerTime = `${moment(originDatetime).format('MM.DD')}-${moment(destDateTime).format('MM.DD')}(${range.diff('days') + 1}일), ${howMany} 명, ${CabinClass[resolveData.rq.condition.cabinClassCode]}`;
        }

        this.headerInit(headerTitle, headerTime);

        // ---------[헤더 초기화]
        console.info('[2. 헤더 초기화 끝]');
    }

    /**
     * headerInit
     * 헤더 초기화
     *
     * @param detail 상세 내역
     */
    private headerInit(headerTitle: string, headerTime: string): void {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: 'icon sm card',
            step: { title: headerTitle },
            detail: headerTime,
            ctx: this
        };
    }

    /**
     * flightSearch
     * 항공 예약
     *
     * @param request 세션에 저장되어 있던 요청 데이터
     */
    private flightSearch(request: any): void {
        this.subscriptionList.push(
            this.apibookingSvc.POST_BOOKING(request)
                .subscribe(
                    (resp: any): void => {
                        console.info('[API 호출 | 예약결과 >]', resp);
                        if (resp.succeedYn) {
                            this.dataModel.response = _.cloneDeep(resp);
                        }
                    },
                    (error: any): void => {
                        console.info('[error]', error);

                        // this.router.navigate(['/flight-main/'], { relativeTo: this.route });
                    }
                )
        );

        console.info('[3. API 호출 끝]');
    }

    /**
     * customPatternValid
     * 벨리데이션 체크
     *
     * @param config validate 관련 데이터
     *
     * @return ValidatorFn
     */
    private customPatternValid(config: any): ValidatorFn {
        return (control: FormControl): any => {
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
     * makeUserPayment
     * 사용자 결제 정보용 form 생성
     */
    private makeUserPayment(): void {
        if (this.payment.controls.length > 1) {
            this.payment.controls.map(
                (item: FormControl, index: number) => {
                    index > 0 && this.payment.removeAt(index);
                }
            );
        } else {
            this.viewModel.passengerFareList.map(
                (item: any, index: number): void => {
                    if (this.payment.controls.length !== this.viewModel.passengerCount) {
                        index > 0 && this.addPaymnet();
                    }
                }
            );
        }
    }

    /**
     * makeBookingPaymentRequest
     * 예약 결제 리퀘스트 생성
     */
    private makeBookingPaymentRequest(): void {
        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.dataModel.response.transactionSetId,
            condition: {
                bookingItemCode: this.dataModel.response.result.bookingItems[0].bookingItemCode,
                cards: this.payment.controls.map(
                    (item: any) => {

                        return {
                            ...item.value,
                            ...{
                                cardValidPeriod: [item.value.cardValidPeriod.slice(0, 2), item.value.cardValidPeriod.slice(2, 4)].join('/'),
                                cardHolderBirthday: [item.value.cardHolderBirthday.slice(0, 4), item.value.cardHolderBirthday.slice(4, 6), item.value.cardHolderBirthday.slice(6, 8)].join('-')
                            }
                        };
                    }
                )
            }
        };

        // api 변경 요청으로 임시 주석
        // if (this.payment.controls.length > 1) {
        //     rq.condition.cards = rq.condition.cards.map(
        //         (item: any, index: number) => {
        //             item.bookingTravelerCode = this.viewModel.travelerList[index].bookingTravelerCode;
        //             return item;
        //         }
        //     );
        // }

        this.bookingPayment(rq);
    }

    /**
     * bookingPayment
     * 결제 요청
     *
     * @param request 결제 요청 request
     */
    private bookingPayment(request: any): void {
        this.subscriptionList.push(
            this.apiPaymentS.PUT_PAYMENT(request)
                .subscribe(
                    (resp: any): void => {
                        if (resp.succeedYn) {
                            const flightRev: any = {
                                userNo: this.dataModel.request[0].condition.booker.userNo,
                                bookingItemCode: request.condition.bookingItemCode
                            };

                            this.modelSet('flight-booking-complete', flightRev);
                            this.location.replaceState('/flight-main'); // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.router.navigate(['/flight-booking-complete'], { relativeTo: this.route });
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        // this.alertService.showApiAlert(err);
                        console.info('[error]', JSON.stringify(err));
                        const initialState = {
                            titleTxt: err,
                            closeObj: null
                        };

                        return this.bsModalService.show(
                            CommonModalAlertComponent,
                            {
                                initialState,
                                ...{ class: 'm-ngx-bootstrap-modal', animated: false }
                            }
                        );
                    }
                )
        );
    }

    /**
     * modelSet
     * 스토어 저장 모델 생성
     *
     * @param id store id
     * @param option data
     */
    private modelSet(id: string, option: any): void {
        const storeModel: any = {
            id: id,
            option: option
        };
        this.upsertOneSession(storeModel);

        console.info(`[스토어에 ${id} 저장 끝]`);
    }

    /**
     * upsertOneSession
     * 세션 스토어에 내용 저장
     */
    private upsertOneSession(obj: any): void {
        this.store.dispatch(
            upsertFlightSessionStorage({ flightSessionStorage: _.cloneDeep(obj) })
        );
    }

    /**
     * onPay
     * 사용자 결제 이벤트
     */
    public onPay(): void {
        if (this.pageForm.valid) {
            this.makeBookingPaymentRequest();
        } else {
            const initialState = {
                titleTxt: '결제수단이 모두 입력되지 않았습니다. 결제 수단을 확인해주세요.',
                closeObj: null
            };

            this.bsModalService.show(
                CommonModalAlertComponent,
                {
                    initialState,
                    ...{ class: 'm-ngx-bootstrap-modal', animated: false }
                }
            );
        }
    }

    /**
     * changePaymentList
     * 일반, 각각 결제 선택
     *
     * @param event mounse 이벤트
     * @param index 결제 방식 번호
     */
    public changePaymentList(event: any, index: number): void {
        event && event.preventDefault();

        this.viewModel.paymentStyleList = this.viewModel.paymentStyleList.map(
            (payItem: PaymentStyle, payIndex: number): PaymentStyle => {
                if (payIndex === index) {
                    payItem.checked = event.target.checked;
                } else {
                    payItem.checked = false;
                }

                return payItem;
            }
        );

        this.makeUserPayment();
    }

    /**
     * getClassName
     * 클래스 변경
     */
    public getClassName(): string {
        return this.viewModel.paymentStyleList[0].checked ? '' : 'traveler-item';
    }
}
