import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertActivitySessionStorage } from '@/app/store/activity-common/activity-session-storage/activity-session-storage.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { ApiPaymentService } from '@/app/api/payment/api-payment.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { CardMonthSet, CardSet, PaymnetStyleSet, UseCardSet } from '@/app/common-source/models/flight-model';

import { PageCodes } from '@/app/common-source/enums/page-codes.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { PaymentModalLoadingComponent } from '../../common-source/modal-components/payment-modal-loading/payment-modal-loading.component';

@Component({
    selector: 'app-activity-booking-payment-page',
    templateUrl: './activity-booking-payment-page.component.html',
    styleUrls: ['./activity-booking-payment-page.component.scss']
})
export class ActivityBookingPaymentPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private dataModel: any;

    public headerConfig: any;
    public viewModel: any;
    public mainForm: FormGroup;


    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private bsModalService: BsModalService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private jwtService: JwtService,
        private comValidS: CommonValidatorService,
        private store: Store<any>,
        private activityComServiceService: ActivityComServiceService,
        private apiPaymentS: ApiPaymentService,
        private location: Location,
        private router: Router,
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
        this.closeAllModals();
    }

    get payment(): FormArray {
        return this.mainForm.get('payment') as FormArray;
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    private initialize() {
        this.dataModel = {};
        this.viewModel = {};
        this.subscriptionList = [];
        this.formInit();
        this.loginInit();
    }

    private headerSet() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    private formInit() {
        this.mainForm = this.fb.group({
            // 결제 수단
            payment: this.fb.array([])
        });
        this.newPaymnet();
    }

    private newPaymnet() {
        this.payment.push(
            this.fb.group({
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
                cardCvc: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(3),
                        this.comValidS.customPattern({ pattern: /^[0-9]*$/, msg: '숫자 3자리 입력해주세요.' })
                    ]
                ),
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
            })
        );
    }

    private loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl)
            .then(
                (resp: any) => {
                    if (resp) {
                        this.subscribeInit();
                        this.sessionInit();
                        this.setViewModel();
                    }
                },
                (err: any) => {
                    console.info('[jwtService.loginGuardInit > err]', err);
                }
            );
    }

    /**
     * subscribeInit
     * 구독 준비
     */
    private subscribeInit(): void {
        this.subscriptionList.push(
            this.store.pipe(
                select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])),
                distinct((item: any) => item)
            )
                .subscribe(
                    (resp: any): void => {
                        if (resp) {
                            this.dataModel.user = _.cloneDeep(resp.userInfo.user);
                            this.dataModel.traveler = _.cloneDeep(resp.traveler);
                        }
                    }
                )
        );
    }

    /**
     * sessionInit
     * 세션 데이터 초기화
     */
    private sessionInit(): void {
        const sessionItem = JSON.parse(sessionStorage.getItem(ActivityStore.STORE_COMMON));

        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            this.dataModel.bookingResult = _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_BOOKING_RS].result);
            const request = this.activityComServiceService.afterEncodingRq(
                _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_BOOKING_INFORMATION].result)
            );
            this.dataModel.optionRq = _.cloneDeep(request.rq);
            this.dataModel.optionView = _.cloneDeep(request.view);
            this.dataModel.transactionSetId = request.rq.transactionSetId;
        } else {

        }
    }

    private setViewModel() {
        console.log(this.dataModel);
        this.viewModel = {
            useCardList: UseCardSet,
            cardList: CardSet,
            cardMonthList: CardMonthSet,
            loadingFlag: true,
            paymentStyleList: PaymnetStyleSet,
            activityName: this.dataModel.optionView.activityName,
            serviceDate: moment(this.dataModel.optionRq.serviceDate).format('YYYY-MM-DD(dd)'),
            amountSum: 0,
            defaultPhoto: this.dataModel.optionView.mainImage
        };

        this.viewModel.travelerSum = this.dataModel.optionView.age.map(
            (item: any) => {
                this.viewModel.amountSum += item.countAmountSum;

                return {
                    traveler: `${item.name}*${item.count}`,
                    amountSum: `${item.countAmountSum}`,
                };
            }
        );
    }

    private makeBookingPaymentRequest() {
        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.dataModel.transactionSetId,
            condition: {
                bookingItemCode: this.dataModel.bookingResult.bookingItems[0].bookingItemCode,
                cards: this.payment.controls.map(
                    (item: any) => {
                        return {
                            ..._.omit(item.value, 'cardCvc'),
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
        this.paymentLoadingShow();
        this.upsertOneSession({
            id: ActivityStore.STORE_BOOKING_RQ,
            result: _.cloneDeep(request),
        });

        console.log(this.dataModel);
        this.subscriptionList.push(
            this.apiPaymentS.PUT_PAYMENT(request)
                .subscribe(
                    (resp: any): void => {
                        if (resp.succeedYn) {
                            this.upsertOneSession({
                                id: ActivityStore.STORE_BOOKING_RS,
                                result: _.cloneDeep({
                                    userNo: this.dataModel.user.userNo,
                                    name: this.dataModel.user.name,
                                    bookingItemCode: this.dataModel.bookingResult.bookingItems[0].bookingItemCode,
                                    activityName: this.dataModel.optionView.activityName,
                                    date: this.dataModel.optionRq.condition.serviceDate
                                }),
                            });

                            this.location.replaceState(ActivityCommon.PAGE_MAIN); // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.router.navigate([ActivityCommon.PAGE_BOOKING_COMPLETE], { relativeTo: this.route });
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

    private upsertOneSession(data: any) {
        this.store.dispatch(
            upsertActivitySessionStorage({ activitySessionStorage: data })
        );
    }

    private paymentLoadingShow() {
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(PaymentModalLoadingComponent, { ...configInfo });
    }

    public onPay() {
        if (this.mainForm.valid) {
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
}
