import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { upsertHotelSessionStorage } from 'src/app/store/hotel-common/hotel-session-storage/hotel-session-storage.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiPaymentService } from '@/app/api/payment/api-payment.service';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from 'src/environments/environment';

import { UseCardSet, CardSet, CardMonthSet, PaymnetStyleSet } from '@/app/common-source/models/hotel-model';

import { PageCodes } from 'src/app/common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-hotel-booking-payment-page',
    templateUrl: './hotel-booking-payment-page.component.html',
    styleUrls: ['./hotel-booking-payment-page.component.scss']
})
export class HotelBookingPaymentPageComponent extends BasePageComponent implements OnInit, OnDestroy {
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
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<any>,
        private fb: FormBuilder,
        private bsModalService: BsModalService,
        private apiPaymentS: ApiPaymentService,
        private comValidS: CommonValidatorService,
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
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
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
            hotelInfoSession: this.dataModel.hotelInfoSession,
            useDate: '',
            guestNumInfo: ''
        };

        //호텔 취소수수료 정책 rq
        const lowestRoomAmount = this.dataModel.hotelInfoSession.rq.roomInfo.lowestRoomAmount;
        const roomUpgrade: number = this.dataModel.hotelInfoSession.rq.roomInfo.roomType.amountSum - lowestRoomAmount;
        this.viewModel.amount = {
            sum: this.dataModel.hotelInfoSession.rq.roomInfo.roomType.amountSum,
            lowestRoomAmount: lowestRoomAmount,
            noRoomUpgradeBool: (roomUpgrade === 0) ? true : false
        };

        // 결제 수단 form 생성
        this.pageForm = this.fb.group({
            // 결제 수단
            payment: this.newPaymnet()
        });

        this.headerSet(this.dataModel.hotelInfoSession);
    }

    get payment(): FormGroup {
        return this.pageForm.get('payment') as FormGroup;
    }

    private newPaymnet(): FormGroup {
        return this.fb.group({
            cardHolderTypeCode: new FormControl('', Validators.required),
            cardMasterCode: new FormControl('', Validators.required),
            cardNo: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.maxLength(16),
                    this.comValidS.customPattern({ pattern: /^[0-9]*$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })
                ]
            ),
            cardHolderName: new FormControl(
                '',
                [
                    Validators.required,
                    this.comValidS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
                ]
            ),
            cardHolderBirthday: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    this.comValidS.customPattern({ pattern: /^(((19|20)([2468][048]|[13579][26]|0[48])|2000)0229|((19|20)[0-9]{2}(0[4678]|1[02])(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}(0[1359]|11)(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}02(0[1-9]|1[0-9]|2[0-8])))/, msg: '입력한 형식이 올바르지 않습니다.' })
                ]
            ),
            cardValidPeriod: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(4),
                    this.comValidS.customPattern({ pattern: /^(0[1-9]|1[012])(\d{2})*$/, msg: '\'/\'를 제외한 숫자만 입력해주세요.' })
                ]
            ),
            // CVC번호
            // cardCvc: new FormControl(
            //     '',
            //     [
            //         Validators.required,
            //         Validators.minLength(3),
            //         Validators.maxLength(3),
            //         this.comValidS.customPattern({ pattern: /^[0-9]*$/, msg: '숫자 3자리 입력해주세요.' })
            //     ]
            // ),

            //카드 비밀번호
            cardPassword: new FormControl(
                '',
                [
                    Validators.maxLength(2),
                    Validators.maxLength(2),
                    this.comValidS.customPattern({ pattern: /^(\d{2})*$/, msg: '비밀번호 앞 2자리를 입력해주세요.' })
                ]
            ),

            // 할부기간
            cardQuotaMonth: new FormControl('', Validators.required)

            // 문의 필요
            // cardHolderRelationCode: new FormControl(''),
            // paidAmount: new FormControl(amount),

            // 항공만 각각 결제일 경우 값이 들어감
            // bookingTravelerCode: new FormControl(''),

            // end 문의 필요
        });
    }

    /**
     * sessionInit
     * 세션 저장 데이터 꺼내기
     */
    private sessionInit(): void {
        const sessionItem = JSON.parse(sessionStorage.getItem('hotel-common'));

        if (!_.isEmpty(sessionItem.hotelSessionStorages.entities)) {
            this.dataModel.response = sessionItem.hotelSessionStorages.entities['hotel-booking-rs'].result;

            this.dataModel.hotelInfoSession = sessionItem.hotelSessionStorages.entities['hotel-booking-infomation-rs'].result;
        } else {
            // 에러 시 처리 어쩌지?
        }

        console.info('sessionInit response', this.dataModel.response);
        console.info('sessionInit hotelInfo', this.dataModel.hotelInfoSession);
    }


    private headerSet(hotelInfo: any) {
        console.info('headerSet', hotelInfo);
        // ---------[이용일 초기화]
        const Moment = extendMoment(moment);
        const range = Moment.range(hotelInfo.rq.checkInDate, hotelInfo.rq.checkOutDate);
        const checkInDate2 = moment(hotelInfo.rq.checkInDate).format('YYYY.MM.DD(ddd)');
        const checkOutDate2 = moment(hotelInfo.rq.checkOutDate).format('YYYY.MM.DD(ddd)');
        const dayDiff2 = range.diff('days'); //여행일수
        this.viewModel.useDate = `${checkInDate2}-${checkOutDate2}, ${dayDiff2}박`;
        console.info('[이용일]', this.viewModel.useDate);
        // ---------[이용일 초기화 end]
        // ---------[인원정보 초기화]
        this.guestListInit(hotelInfo.roomConRq.rooms);
        console.info('인원정보', this.viewModel.guestNumInfo);
        // ---------[인원정보 초기화 end]
        this.headerConfig = {
            category: PageCodes.PAGE_FLIGHT
        };
    }

    guestListInit($roomList) {
        console.info('guestListInit', $roomList);
        let returntxt: string = '';
        let adultNum: number = 0;
        let childrenNum: number = 0;

        for (const roomItem of $roomList) {
            adultNum += _.toNumber(roomItem.adultCount);
            childrenNum += roomItem.childAges.length;
        }

        returntxt = '성인 ' + adultNum + '명';
        if (childrenNum > 0)
            returntxt += ' 아동 ' + childrenNum + '명';

        //인원수 정보
        this.viewModel.guestNumInfo = returntxt;
        console.info('guestListInit', this.viewModel.guestNumInfo);
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
                bookingItemCode: this.dataModel.response.bookingItems[0].bookingItemCode,
                cards: [{
                    ..._.omit(this.payment.value, 'cardCvc'),
                    ...{
                        cardValidPeriod: [this.payment.value.cardValidPeriod.slice(0, 2), this.payment.value.cardValidPeriod.slice(2, 4)].join('/'),
                        cardHolderBirthday: [this.payment.value.cardHolderBirthday.slice(0, 4), this.payment.value.cardHolderBirthday.slice(4, 6), this.payment.value.cardHolderBirthday.slice(6, 8)].join('-')
                    }
                }]
            }
        };
        console.info('dataModel.response', this.dataModel.response);
        console.info('makeBookingPaymentRequest', rq);
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
                            this.upsertOneSession({
                                id: 'hotel-booking-payment-rs',
                                result: resp['result']
                            });
                            // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.location.replaceState('/hotel-main');
                            this.router.navigate(['/hotel-booking-complete'], { relativeTo: this.route });
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        // this.alertService.showApiAlert(err.error.errorMessage);
                        console.info('[error]', err);
                        const initialState = {
                            titleTxt: '올바른 카드 번호를 입력하세요.',
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
     * upsertOneSession
     * 세션 스토어에 내용 저장
     */
    private upsertOneSession(obj: any): void {
        this.store.dispatch(
            upsertHotelSessionStorage({ hotelSessionStorage: _.cloneDeep(obj) })
        );
    }

    /**
     * onPay
     */
    public onPay() {
        if (this.pageForm.valid) {
            this.makeBookingPaymentRequest();
        } else {
            _.forEach(this.pageForm.controls, (pageItem: any, pageKey: any) => {
                if (!pageItem.valid) {
                    console.info('[$key | 유효성 체크 실패]', pageKey);
                    return false;
                }
            });
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
     * getClassName
     * 클래스 변경
     */
    public getClassName(): string {
        return this.viewModel.paymentStyleList[0].checked ? '' : 'reservation-group mt40';
    }
}