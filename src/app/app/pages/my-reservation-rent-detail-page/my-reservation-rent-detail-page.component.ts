import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { MyModalRentConfirmationComponent } from './modal-components/my-modal-rent-confirmation/my-modal-rent-confirmation.component';
import { MyModalRentInvoiceComponent } from './modal-components/my-modal-rent-invoice/my-modal-rent-invoice.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { MyModalFlightBookerEditComponent } from '../my-reservation-flight-detail-page/modal-components/my-modal-flight-booker-edit/my-modal-flight-booker-edit.component';

@Component({
    selector: 'app-my-reservation-rent-detail-page',
    templateUrl: './my-reservation-rent-detail-page.component.html',
    styleUrls: ['./my-reservation-rent-detail-page.component.scss'],
})
export class MyReservationRentDetailPageComponent extends BasePageComponent
    implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;
    bsModalRef: BsModalRef;
    rxAlive: boolean = true;
    loadingBool: Boolean = false;
    foldingYn: boolean = false;
    booker: any;
    conditions: any[] = [];
    consultings: any[] = [];
    equipments: any[] = [];
    rooms: any[] = [];
    summary: any;
    inLabel: any;
    outLabel: any;
    dateDiff: any;
    resolveData: any;
    bookingInfo: any;
    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private apiBookingService: ApiBookingService,
        private loadingBar: LoadingBarService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();
        this.subscriptionList = [];
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        const userNo = Number(
                            _.chain(this.resolveData).get('condition.userNo').value()
                        );
                        this.resolveData.condition.userNo = userNo;
                        console.info('[1. route 통해 데이터 전달 받기]', this.resolveData);
                        this.pageInit(this.resolveData);
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
            title: '예약/결제 내역',
            key: null,
        };
    }

    // API 호출 호텔 예약상세
    callRentReservationtDetailApi($rq) {
        console.info('>>>> call api start', $rq);
        this.loadingBool = false;
        this.loadingBar.start();
        this.subscriptionList.push(
            this.apiMypageService.POST_BOOKING_RENT_DETAIL($rq)
                .subscribe(
                    (res: any) => {
                        console.info('[rent detail > res]', res);
                        if (res.succeedYn) {
                            this.loadingBool = true;
                            this.loadingBar.complete();
                            this.booker = res['result']['booker']; // 예약정보
                            this.conditions = res['result']['conditions']; // 상세 스케줄
                            this.consultings = res['result']['consultings']; // 예약자 정보
                            this.equipments = res['result']['equipments']; // 장비 정보
                            this.summary = res['result']['summary']; // 부가서비스 결제 정보

                            // 요일 추출
                            const week = new Array('일', '월', '화', '수', '목', '금', '토');
                            const inDay = new Date(this.summary.checkInDate).getDay();
                            const outDay = new Date(this.summary.checkOutDate).getDay();
                            this.inLabel = week[inDay];
                            this.outLabel = week[outDay];
                            // this.dateDiff = Math.ceil(fromDay - toDay);

                            console.info('this.booker>>>', this.booker);
                            console.info('conditions >>>', this.conditions);
                            console.info('consultings >>>', this.consultings);
                            console.info('equipments >>>', this.equipments);
                            console.info('summary >>>', this.summary);
                            // console.info('fromLabel >>>', this.fromLabel);
                            // console.info('toLabel >>>', this.toLabel);
                            // console.info('dateDiff >>>', this.dateDiff);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);

                    }
                )
        );
    }

    pageInit(resolveData) {
        this.callRentReservationtDetailApi(resolveData);
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

    selectFolding() {
        this.foldingYn = !this.foldingYn;
    }

    // 예약자 정보변경 모달
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
        this.bsModalRef = this.bsModalService.show(
            MyModalFlightBookerEditComponent,
            { initialState, ...configInfo }
        );
    }

    // // 여행자보험 모달
    // openTravelInsu() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalRentTravelInsuComponent, { initialState, ...configInfo });
    // }

    onGoToRentMain() {
        const path = '/rent-main';
        const extras = {
            relativeTo: this.route,
        };
        this.router.navigate([path], extras);
    }

    onBookingCancel(e) {
        console.info('예약 취소하기', e);
        const vehicleNameEn = this.bookingInfo.summary.vehicleNameEn;
        const checkInDate = moment(this.bookingInfo.summary.checkInDate).format(
            'YYYY.MM.DD(dd)'
        );
        const checkOutDate = moment(
            this.bookingInfo.summary.checkOutDate
        ).format('YYYY.MM.DD(dd)');
        const bookingNum = `예약번호 : ${this.bookingInfo.summary.bookingCode}`;
        const alertHtml = `${vehicleNameEn}<br>${checkInDate}-${checkOutDate}<br>${bookingNum}`;
        this.cancelAlert(alertHtml);
    }

    cancelAlert($alertHtml) {
        const initialState = {
            alertTitle: '랜트카 예약 취소',
            titleTxt: '예약을 취소 하시겠습니까?',
            alertHtml: $alertHtml,
            okObj: {
                fun: () => {
                    // this.callApiHotelCancel();
                    this.rentBookedCancel();
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
        this.bsModalService.show(CommonModalAlertComponent, {
            initialState,
            ...configInfo,
        });
    }

    rentBookedCancel() {
        // const tgItem = $resItem;
        // const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                bookingItemCode: this.bookingInfo.summary.bookingItemCode,
            },
        };
        this.subscriptionList.push(
            this.apiBookingService.POST_BOOKING_RENT_CANCEL(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[res]', res);

                        if (res.succeedYn) {
                            alert('렌터카 예약이 취소 완료되었습니다.');
                            this.pageReLoad();
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
    }

    // 렌터카 확정서 모달
    openRentConfirm(e) {
        console.info('렌트 확정서', e);

        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                userNo: Number(this.booker.userNo),

                bookingItemCode: this.bookingInfo.summary.bookingItemCode,
            }
        };
        const initialState: any = {
            rq: rqInfo
        };

        this.bsModalRef = this.bsModalService.show(
            MyModalRentConfirmationComponent,
            { initialState, ...this.configInfo }
        );
    }

    // 렌터카 인보이스 모달
    openRentInvoice(e) {
        console.info('렌트 인보이스', e);

        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                userNo: Number(this.booker.userNo),

                bookingItemCode: this.bookingInfo.summary.bookingItemCode,
            }
        };
        const initialState: any = {
            rq: rqInfo
        };

        this.bsModalRef = this.bsModalService.show(
            MyModalRentInvoiceComponent,
            { initialState, ...this.configInfo }
        );
    }

    // // 렌터카 wifi & usim 모달
    // openRentWifi() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalRentWifiComponent, { initialState, ...configInfo });
    // }

    // openAddReserv() {
    //     alert('추가예약');
    // }

    // openMileageAccum() {
    //     alert('마일리지적립');
    // }

    // openOneonon() {
    //     alert('1:1 문의');
    // }
}
