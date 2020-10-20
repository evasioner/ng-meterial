import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

import { Store } from '@ngrx/store';

import { upsertFlightSessionStorage } from 'src/app/store/flight-common/flight-session-storage/flight-session-storage.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { ApiPaymentService } from '@/app/api/payment/api-payment.service';
import { ApiFlightService } from '@/app/api/flight/api-flight.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { UseCardSet, CardSet, CardMonthSet, PaymnetStyleSet, PaymentStyle } from '@/app/common-source/models/flight-model';

import { TravelerType } from '@/app/common-source/enums/traveler-type.enum';
import { PageCodes } from 'src/app/common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-flight-booking-payment-page',
    templateUrl: './flight-booking-payment-page.component.html',
    styleUrls: ['./flight-booking-payment-page.component.scss']
})
export class FlightBookingPaymentPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscriptionList: Subscription[];

    public headerType: any;
    public headerConfig: any;
    public viewModel: any;
    public pageForm: any;

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
        private apiflightSvc: ApiFlightService,
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

        this.headerSet();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
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
            paymentStyleList: PaymnetStyleSet,
            travelerList: [],
            flights: []
        };
        this.dataModel.request.map(
            (item: any) => {
                this.viewModel.travelerList = item.condition.travelers;
                this.flightSearch(item, this.dataModel.itiineraryRq.rq);
            }
        );
        this.pageForm = this.fb.group({
            // 결제 수단
            payment: this.fb.array([])
        });

        this.addPaymnet();
        this.viewModel.passengerFareList = this.parsePassengerFare();
        this.viewModel.passengerCount = this.viewModel.passengerFareList.length;
    }

    /**
     * sessionInit
     * 세션 저장 데이터 꺼내기
     */
    private sessionInit(): void {
        const sessionItem: any = JSON.parse(sessionStorage.getItem('flight-common'));

        if (!_.isEmpty(sessionItem.flightSessionStorages.entities)) {
            this.dataModel.request = sessionItem.flightSessionStorages.entities['flight-booking'].option;
            this.dataModel.itiineraryRq = sessionItem.flightSessionStorages.entities['flight-booking-information'].option;
        } else {
            // 에러 시 처리 어쩌지?
        }
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
                                            userInfo: `${TravelerType[_.upperCase(this.viewModel.travelerList[index].ageTypeCode)]}${(index + 1)}, ${this.viewModel.travelerList[index].firstName}/${this.viewModel.travelerList[index].lastName}`,
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

    /**
     * addPaymnet
     * 요금 결제에 대한 정보 추가
     */
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
                        this.customPatternValid({ pattern: /\d{2}$/, msg: '비밀번호 앞 2자리를 입력해주세요.' })
                    ]
                ),
                // 항공만 각각 결제일 경우 값이 들어감
                // bookingTravelerCode: new FormControl('')
            })
        );
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

    private headerSet() {
        this.headerConfig = {
            category: PageCodes.PAGE_FLIGHT
        };
    }

    /**
     * flightSearch
     * 항공 예약
     *
     * @param request 세션에 저장되어 있던 요청 데이터
     * @param itineraryRq 항공 스케쥴을 위한 데이터
     */
    private flightSearch(request: any, itineraryRq: any): void {
        this.subscriptionList.push(
            forkJoin(
                this.apibookingSvc.POST_BOOKING(request),
                this.apiflightSvc.POST_FLIGHT_LIST_ITINERARY(itineraryRq)
            )
                .subscribe(
                    ([resp1, resp2]: any): void => {
                        console.info('[API 호출 | 예약결과 >]', resp1, resp2);

                        if (resp1 && resp1.succeedYn) {
                            this.dataModel.response = _.cloneDeep(resp1);
                        } else {
                            this.alertService.showApiAlert(resp1.errorMessage);
                        }

                        if (resp2 && resp2.succeedYn) {
                            this.dataModel.itineraryResponse = _.cloneDeep(resp2);
                            this.setFlightView(this.dataModel.itineraryResponse.result.selected.flights);
                        } else {
                            this.alertService.showApiAlert(resp2.errorMessage);
                        }
                    },
                    (err: any): void => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );

        console.info('[3. API 호출 끝]');
    }

    private setFlightView(flights: Array<any>): void {
        this.viewModel.flights = [];
        flights.map(
            (flightItem: any, flightIndex: number) => {
                this.viewModel.flights[flightIndex] = {
                    airlineCode: flightItem.airlineCode,
                    airlineNameLn: flightItem.airlineNameLn,
                    segments: []
                };

                flightItem.itineraries.map(
                    (itineraryItem: any, itineraryIndex: number) => {
                        const endDestination = itineraryItem.segments[itineraryItem.segments.length - 1];

                        itineraryItem.segments.map(
                            (segItem: any, segIndex: number) => {

                                if (segIndex === 0) {
                                    this.viewModel.flights[flightIndex].segments[itineraryIndex] = {
                                        totalDuration: itineraryItem.totalDuration,
                                        originAirportNameLn: itineraryItem.segments[0].origin.airportNameLn,
                                        originAirportCode: itineraryItem.segments[0].origin.airportCode,
                                        originDate: itineraryItem.segments[0].origin.departureDate,
                                        originTime: itineraryItem.segments[0].origin.departureTime,
                                        destinationAirportNameLn: endDestination.destination.airportNameLn,
                                        destinationAirportCode: endDestination.destination.airportCode,
                                        destinationDate: endDestination.destination.arrivalDate,
                                        destinationTime: endDestination.destination.arrivalTime
                                    };

                                    switch (itineraryItem.segments.length) {
                                        case 0:
                                        case 1:
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].className = '';
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].stops = '직항';
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].stopsSimple = '직항';
                                            break;

                                        case 2:
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].className = 'over1';
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].stops = `${itineraryItem.segments.length - 1}회 경유`;
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].stopsSimple = '경유';
                                            break;

                                        default:
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].className = 'over2';
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].stops = `${itineraryItem.segments.length - 1}회 경유`;
                                            this.viewModel.flights[flightIndex].segments[itineraryIndex].stopsSimple = '경유';
                                            break;
                                    }
                                }

                            }
                        );



                    }
                );

            }
        );
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
                                userName: this.dataModel.request[0].condition.booker.name,
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
                        this.alertService.showApiAlert(err.error.errorMessage);
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
     */
    public onPay() {
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
        return this.viewModel.paymentStyleList[0].checked ? '' : 'reservation-group mt40';
    }
}
