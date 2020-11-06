import { Component, Inject, PLATFORM_ID, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiHotelService } from '@/app/api/hotel/api-hotel.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { MyModalHotelVoucherComponent } from './modal-components/my-modal-hotel-voucher/my-modal-hotel-voucher.component';
import { MyModalHotelInvoiceComponent } from './modal-components/my-modal-hotel-invoice/my-modal-hotel-invoice.component';
import { MyModalHotelReceiptComponent } from './modal-components/my-modal-hotel-receipt/my-modal-hotel-receipt.component';
import { MyModalHotelBookerModifyComponent } from './modal-components/my-modal-hotel-booker-modify/my-modal-hotel-booker-modify.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { MyModalFlightBookerEditComponent } from '../my-reservation-flight-detail-page/modal-components/my-modal-flight-booker-edit/my-modal-flight-booker-edit.component';

@Component({
    selector: 'app-my-reservation-hotel-detail-page',
    templateUrl: './my-reservation-hotel-detail-page.component.html',
    styleUrls: ['./my-reservation-hotel-detail-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyReservationHotelDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;
    bsModalRef: BsModalRef;
    rxAlive: boolean = true;
    loadingBool: Boolean = false;
    foldingYn: boolean = false;
    booker: any;
    cancelPolicy: any[] = [];
    consultings: any[] = [];
    mileageCards: any[] = [];
    rooms: any[] = [];
    summary: any;
    inLabel: any;
    outLabel: any;
    dateDiff: any;
    resolveData: any;
    hotelBookingInfo: any;
    vm: any;
    hotelInfoRq: any;
    roomList: any;
    roomType: any;
    guestNumInfo: any;
    comService: any;

    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private loadingBar: LoadingBarService,
        private apiHotelService: ApiHotelService,
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
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '예약 상세 내역',
            key: null,
        };
    }

    // API 호출 호텔 예약상세
    async callHotelReservationtDetailApi($rq) {
        console.info('>>>> call api start', $rq);
        this.loadingBool = false;
        this.loadingBar.start();
        return this.apiMypageService.POST_BOOKING_HOTEL_DETAIL($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[호텔예약상세 > res]', res);

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
        const res = await this.callHotelReservationtDetailApi(resolveData);
        // booker: any;                 // 투숙객 정보
        // cancelPolicy: any[] = [];    // 취소정책
        // consultings: any[] = [];     // 상담내역
        // mileageCards: any[] = [];    // 마일리지 카드
        // rooms: any[] = [];           // 객실정보
        // summary: any;                // 예약정보

        this.booker = res['result']['booker']; // 예약정보
        this.cancelPolicy = res['result']['cancelPolicy']; // 상세 스케줄
        this.consultings = res['result']['consultings']; // 예약자 정보
        this.mileageCards = res['result']['mileageCards']; // 탑승자 정보
        this.rooms = res['result']['rooms']; // 객실정보

        this.rooms.forEach((rm, i) => {
            //rooms[] 에 groupByAge 키를 추가해서 ADT, CHD 오브젝트를 넣는다.
            rm.groupByAge = this.rooms[i].travelers.reduce(
                (acc, it) => ({
                    ...acc,
                    [it.ageTypeCode]: (acc[it.ageTypeCode] || 0) + 1,
                }),
                {}
            );
        });

        this.summary = res['result']['summary']; // 부가서비스 결제 정보

        // 요일 추출
        const week = new Array('일', '월', '화', '수', '목', '금', '토');
        const inDay = new Date(this.summary.checkInDate).getDay();
        const outDay = new Date(this.summary.checkOutDate).getDay();
        this.inLabel = week[inDay];
        this.outLabel = week[outDay];
        // this.dateDiff = Math.ceil(inDay - outDay);

        console.info('this.booker>>>', this.booker);
        console.info('cancelPolicy >>>', this.cancelPolicy);
        console.info('consultings >>>', this.consultings);
        console.info('mileageCards >>>', this.mileageCards);
        console.info('rooms >>>', this.rooms);
        console.info('summary >>>', this.summary);
        // console.info('fromLabel >>>', this.fromLabel);
        // console.info('toLabel >>>', this.toLabel);
        // console.info('dateDiff >>>', this.dateDiff);
    }

    getHotelStarRating($star) {
        if (!$star) {
            return '0';
        }

        const hotelGradeCodeSplit = $star.split('.');
        let result = hotelGradeCodeSplit[0];
        if (hotelGradeCodeSplit[1] != 0) {
            result += 'h';
        }
        return result;
    }

    selectFolding() {
        this.foldingYn = !this.foldingYn;
    }

    callApiHotelCancel() {
        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                bookingItemCode: this.hotelBookingInfo.summary.bookingItemCode,
            },
        };

        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_CANCEL(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[호텔 예약취소 > res]', res);

                        if (res.succeedYn) {
                            this.comService.refresh(); //새로고침
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
    }

    getDday() {
        const tgTime = moment(this.summary.checkInDate);
        const toDay = moment();

        const diffVal = tgTime.diff(toDay, 'days');
        // console.info('[diff]', diffVal);

        if (diffVal < 0) {
            return `[D+${Math.abs(diffVal)}]`;
        } else {
            return `[D-${diffVal}]`;
        }
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
    //     this.bsModalRef = this.bsModalService.show(MyModalHotelTravelInsuComponent, { initialState, ...configInfo });
    // }

    // 호텔 바우처 모달
    openHotelVoucher(e) {
        console.info('호텔 바우쳐', e);

        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                bookingItemCode: this.hotelBookingInfo.summary.bookingItemCode,
                userNo: Number(this.booker.userNo),

            }
        };
        const initialState: any = {
            rq: rqInfo
        };
        this.bsModalRef = this.bsModalService.show(MyModalHotelVoucherComponent, { initialState, ...this.configInfo });
    }

    // 호텔 인보이스 모달
    openHotelInvoice(e) {
        console.info('호텔 인보이스', e);

        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'bookingItemCode': "2007271004-F01",
                // bookingItemCode: this.hotelBookingInfo.summary.bookingItemCode,
                userNo: Number(this.booker.userNo),

            }
        };
        const initialState: any = {
            rq: rqInfo
        };

        this.bsModalRef = this.bsModalService.show(MyModalHotelInvoiceComponent, { initialState, ...this.configInfo });
    }

    // 호텔 영수증 모달
    openHotelReceipt() {
        const initialState = {
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        this.bsModalRef = this.bsModalService.show(MyModalHotelReceiptComponent, { initialState, ...configInfo });
    }

    // openOneonon() {
    //     alert('1:1 문의');
    // }

    // openHotelReservationAccum() {
    //     alert('호텔마일리지 적립..삭제?');
    // }

    // 호텔 예약자변경 모달
    openBookerModify() {
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
            MyModalHotelBookerModifyComponent,
            { initialState, ...configInfo }
        );
    }

    onBookingCancel(e) {
        console.info('예약 취소하기', e);
        let alertHtml = '';
        if (this.hotelBookingInfo.summary.bookingStatusCode === 'BKS02') {
            //예약 취소 가능한 경우
            const hotelNameLn = this.hotelBookingInfo.summary.hotelNameLn;
            const checkInDate = moment(this.hotelBookingInfo.summary.checkInDate).format('YYYY.MM.DD(dd)');
            const checkOutDate = moment(this.hotelBookingInfo.summary.checkOutDate).format('YYYY.MM.DD(dd)');
            const bookingNum = `예약번호 : ${this.hotelBookingInfo.summary.bookingCode}`;
            alertHtml = `${hotelNameLn} ${checkInDate}-${checkOutDate}<br>${bookingNum}`;
            this.cancelAlert('예약을 취소 하시겠습니까?', alertHtml);
        } else {
            //예약 취소 가능 X
            this.cancelAlert('예약 취소 불가');
        }
    }

    /**
     * 취소하기 alert
     * @param $titleTxt
     * @param $alertHtml
     */
    cancelAlert($titleTxt, $alertHtml?) {
        const initialState = {
            alertTitle: '호텔예약 취소',
            titleTxt: $titleTxt,
            alertHtml: $alertHtml,
            okObj: {
                fun: () => {
                    if ($alertHtml)
                        // 예약 취소 가능한 경우만 api 호출
                        this.callApiHotelCancel();
                },
            },
        };

        if ($alertHtml) {
            // 예약 취소 가능한 경우, 취소 버튼 display
            initialState['cancelObj'] = {
                fun: () => { },
            };
        }
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false,
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo, });
    }
}
