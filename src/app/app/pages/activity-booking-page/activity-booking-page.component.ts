import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { ApiPaymentService } from '@/app/api/payment/api-payment.service';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PaymnetStyleSet, UseCardSet } from './models/activity-booking-page.model';
import { CardMonthSet, CardSet } from '@/app/common-source/models/booking.model';

import { ActivityEnums } from '../activity-page/enums/activity-enums.enum';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-activity-booking-page',
    templateUrl: './activity-booking-page.component.html',
    styleUrls: ['./activity-booking-page.component.scss']
})
export class ActivityBookingPageComponent extends BasePageComponent implements OnInit, OnDestroy {
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
        private fb: FormBuilder,
        private activityComServiceService: ActivityComServiceService,
        private route: ActivatedRoute,
        private router: Router,
        private apiPaymentS: ApiPaymentService,
        private bsModalService: BsModalService,
        private comValidator: CommonValidatorService,
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

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('bg');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('bg');
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
            amountSum: this.dataModel.optionView.amountSum
        };
        this.pageForm = this.fb.group({
            // 결제 수단
            payment: this.fb.array([])
        });
        this.addPaymnet();
        this.headerSet();
        console.log(this.dataModel);
    }

    private sessionInit() {
        const sessionItem = JSON.parse(localStorage.getItem(ActivityEnums.STORE_COMMON));

        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            this.dataModel = _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityEnums.STORE_BOOKING].result);
            const request = this.activityComServiceService.afterEncodingRq(
                _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityEnums.STORE_BOOKING_INFORMATION].result)
            );
            this.dataModel.optionView = _.cloneDeep(request.view);
            this.dataModel.transactionSetId = request.rq.transactionSetId;
        }
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
                        Validators.maxLength(16),
                        this.comValidator.customPattern({ pattern: /^[0-9]*$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })
                    ]
                ),
                cardHolderName: new FormControl(
                    '',
                    [
                        Validators.required,
                        this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
                    ]
                ),
                cardHolderBirthday: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(8),
                        this.comValidator.customPattern({ pattern: /^(((19|20)([2468][048]|[13579][26]|0[48])|2000)0229|((19|20)[0-9]{2}(0[4678]|1[02])(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}(0[1359]|11)(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}02(0[1-9]|1[0-9]|2[0-8])))/, msg: '입력한 형식이 올바르지 않습니다.' })
                    ]
                ),
                cardValidPeriod: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(4),
                        this.comValidator.customPattern({ pattern: /^(0[1-9]|1[012])(\d{2})*$/, msg: '\'/\'를 제외한 숫자만 입력해주세요.' })
                    ]
                ),
                // 할부
                cardCvc: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(3),
                        this.comValidator.customPattern({ pattern: /^[0-9]*$/, msg: '숫자 3자리 입력해주세요.' })
                    ]
                ),
                //카드 비밀번호
                cardPassword: new FormControl(
                    '',
                    [
                        Validators.maxLength(2),
                        Validators.maxLength(2),
                        this.comValidator.customPattern({ pattern: /^(\d{2})*$/, msg: '비밀번호 앞 2자리를 입력해주세요.' })
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

    private headerSet() {
        this.headerInit();
    }

    /**
     * headerInit
     * 헤더 초기화
     *
     * @param detail 상세 내역
     */
    private headerInit(): void {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: 'icon sm card',
            title: '결제하기',
            // detail: detail,
            // ctx: this.ctx
        };
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
            transactionSetId: this.dataModel.transactionSetId,
            condition: {
                bookingItemCode: this.dataModel.bookingItems[0].bookingItemCode,
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
                        console.log('성공성공 : ', resp);
                        if (resp.succeedYn) {
                            // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.location.replaceState('/activity-main');
                            this.router.navigate(['/activity-booking-complete'], { relativeTo: this.route });
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
    }

    public onPay() {
        if (this.pageForm.valid) {
            this.makeBookingPaymentRequest();
        } else {
            _.forEach(this.pageForm.controls, (pageItem: any, pageKey: any) => {
                if (!pageItem.valid) {
                    console.info('[$key | 유효성 체크 실패]', pageKey);
                    let targetId = pageKey;
                    if (pageKey === 'payment') {
                        let flag = true;
                        _.forEach(
                            this.pageForm.controls.payment.controls,
                            (payItem: any, payKey: any) => {
                                console.info(payKey, '[$key : payment | 유효성 체크 실패]', payItem.invalid);
                                if (flag && payItem.invalid) {
                                    flag = false;
                                    targetId = payKey;
                                }
                            }
                        );
                    }

                    this.inValidAlert(targetId);

                    return false;
                }
            });
        }
    }

    public inValidAlert(targetId) {
        console.info('inValidAlert', targetId);
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
        this.subscriptionList.push(
            this.bsModalService.onHidden
                .subscribe(
                    () => {
                        this.comValidator.scrollToTarget(targetId);
                    }
                )
        );
    }
}
