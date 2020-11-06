import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { MyModalFlightBookerEditComponent } from '../my-reservation-flight-detail-page/modal-components/my-modal-flight-booker-edit/my-modal-flight-booker-edit.component';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { MyModalActivityTravelInsuComponent } from './modal-components/my-modal-activity-travel-insu/my-modal-activity-travel-insu.component';
import { MyModalActivityVoucherComponent } from './modal-components/my-modal-activity-voucher/my-modal-activity-voucher.component';
import { MyModalActivityWifiComponent } from './modal-components/my-modal-activity-wifi/my-modal-activity-wifi.component';
import { MyModalActivityBookerModifyComponent } from './modal-components/my-modal-activity-booker-modify/my-modal-activity-booker-modify.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-my-reservation-activity-detail-page',
    templateUrl: './my-reservation-activity-detail-page.component.html',
    styleUrls: ['./my-reservation-activity-detail-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyReservationActivityDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;
    bsModalRef: BsModalRef;
    rxAlive: boolean = true;
    loadingBool: Boolean = false;
    foldingYn: boolean = false;
    booker: any;
    resolveData: any;
    result: any;
    sessionRQ: any;
    cancelPolicy: any[] = [];
    conditions: any[] = [];
    consultings: any[] = [];
    equipments: any[] = [];
    summary: any;
    payments: any;
    fromLabel: any;
    toLabel: any;
    dateDiff: any;
    activityBookingInfo: any;
    instantTicketing: boolean;
    activityInfoRq: any;
    guestNumInfo: any;
    comService: any;
    bookingInfo: any;
    activityDetail: any;
    dDay: any;
    private subscriptionList: Subscription[];

    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private loadingBar: LoadingBarService,
        private apiBookingService: ApiBookingService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.subscriptionList = [];
    }



    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        const userNo = Number(
                            _.chain(this.resolveData).get('condition.userNo').value()
                        );
                        console.info('Number(userNo)>>', userNo);
                        this.resolveData.condition.userNo = userNo;
                        console.info('[1. route 통해 데이터 전달 받기]', this.resolveData);
                        this.pageInit(this.resolveData);
                    }
                )
        );
        this.instantTicketing = true;
    }


    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    pageReLoad() {
        console.info('[pageReLoad]');
        this.router
            .navigateByUrl(`/`, { skipLocationChange: true })
            .then(() => {
                this.router.navigateByUrl(
                    this.route.snapshot['_routerState'].url
                );
            });
    }



    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '예약 상세 내역',
            key: null,
        };
    }

    selectFolding() {
        this.foldingYn = !this.foldingYn;
    }

    onAccordion() {
        (<HTMLInputElement>event.target).closest('.accordion-title').classList.toggle('active');
    }

    async callActivityReservationtDetailApi($rq) {
        console.info('>>>> call api start', $rq);
        this.loadingBool = false;
        this.loadingBar.start();
        return this.apiMypageService.POST_BOOKING_ACTIVITY_DETAIL($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[액티비티 예약상세 > res]', res);

                if (res.succeedYn) {
                    this.loadingBool = true;
                    this.loadingBar.complete();
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }

    async pageInit(resolveData) {
        // resolveData.currency = 'JGT';
        // resolveData.language = 'EN';
        const res = await this.callActivityReservationtDetailApi(resolveData);

        this.booker = res['result']['booker']; // 예약정보
        this.conditions = res['result']['conditions']; // 상세 스케줄
        this.consultings = res['result']['consultings']; // 예약자 정보
        this.equipments = res['result']['equipments']; // 장비 정보
        this.summary = res['result']['summary']; // 부가서비스 결제 정보

        // 요일 추출
        const week = new Array('일', '월', '화', '수', '목', '금', '토');
        const fromDay = new Date(this.summary.checkInDate).getDay();
        const toDay = new Date(this.summary.checkOutDate).getDay();
        this.fromLabel = week[fromDay];
        this.toLabel = week[toDay];
        // this.dateDiff = Math.ceil(fromDay - toDay);

        console.info('this.booker>>>', this.booker);
        console.info('conditions >>>', this.conditions);
        console.info('consultings >>>', this.consultings);
        console.info('equipments >>>', this.equipments);
        console.info('summary >>>', this.summary);
        // console.info('fromLabel >>>', this.fromLabel);
        // console.info('toLabel >>>', this.toLabel);
        // console.info('dateDiff >>>', this.dateDiff);
    }

    getDday() {
        const tgTime = moment(this.summary.pickupDate);
        const toDay = moment();

        const diffVal = tgTime.diff(toDay, 'days');
        // console.info('[diff]', diffVal);

        if (diffVal < 0) {
            return `[D+${Math.abs(diffVal)}]`;
        } else {
            return `[D-${diffVal}]`;
        }

    }


    // 여행자보험 모달
    openBookerEdit() {
        const initialState = {
            list: [
                'Open a modal with component',
                'Pass your data',
                'Do something else',
                '...',
            ],
            title: 'Modal with component',
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true,
        };
        this.bsModalRef = this.bsModalService.show(MyModalFlightBookerEditComponent, { initialState, ...configInfo });
    }

    onGoToActivityMain() {
        const path = '/A-main';
        const extras = {
            relativeTo: this.route,
        };
        this.router.navigate([path], extras);
    }

    onBookingCancel(e) {
        console.info('예약 취소하기', e);
        const activityNameEn = this.bookingInfo.summary.activityNameEn;
        const activityNameLn = this.bookingInfo.summary.activityNameLn;
        const serviceInDate = moment(this.bookingInfo.summary.serviceInDate).format(
            'YYYY.MM.DD(dd)'
        );
        const serviceToDate = moment(
            this.bookingInfo.summary.serviceToDate
        ).format('YYYY.MM.DD(dd)');
        const bookingNum = `예약번호 : ${this.bookingInfo.summary.bookingCode}`;
        const alertHtml = `${activityNameEn},${activityNameLn}<br>${serviceInDate}-${serviceToDate}<br>${bookingNum}`;
        this.cancelAlert(alertHtml);
    }

    cancelAlert($alertHtml) {
        const initialState = {
            alertTitle: '택티비티 예약 취소',
            titleTxt: '예약을 취소 하시겠습니까?',
            alertHtml: $alertHtml,
            okObj: {
                fun: () => {
                    this.activityBookedCancel();
                },
            },
            cancelObj: {
                fun: () => {
                    // this.load();
                },
            },
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false,
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo, });
    }
    activityBookedCancel() {
        // const tgItem = $resItem;
        // const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                bookingItemCode: this.activityBookingInfo.summary.bookingItemCode,
            },
        };

        this.apiBookingService.POST_BOOKING_ACTIVITY_CANCEL(rq)
            .toPromise()
            .then((res: any) => {
                console.info('[res]', res);

                if (res.succeedYn) {
                    alert('액티비티 취소 완료되었습니다.');
                    this.pageReLoad();
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }


    openActivityTravelInsu() {
        const initialState = {
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };

        this.bsModalRef = this.bsModalService.show(MyModalActivityTravelInsuComponent, { initialState, ...this.configInfo });
    }

    // 액티비티 바우처 모달
    openActivityVoucher() {
        console.info('액티비티 인보이스');

        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                userNo: Number(this.booker.userNo),

                bookingItemCode: this.activityBookingInfo.summary.bookingItemCode,
            }
        };
        const initialState: any = {
            rq: rqInfo
        };
        this.bsModalRef = this.bsModalService.show(MyModalActivityVoucherComponent, { initialState, ...this.configInfo });
    }

    // 액티비티 wifi-usim 모달
    openActivityWifi() {
        const initialState = {
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };

        this.bsModalRef = this.bsModalService.show(MyModalActivityWifiComponent, { initialState, ...this.configInfo });
    }

    // 액티비티 예약자변경 모달
    openBookerModify() {
        const initialState = {
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };

        this.bsModalRef = this.bsModalService.show(MyModalActivityBookerModifyComponent, { initialState, ...this.configInfo });
    }

    openOneonon() {
        alert('1:1 문의');
    }


}
