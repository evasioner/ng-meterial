import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from 'src/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { MyModalHotelInvoiceComponent } from './modal-components/my-modal-hotel-invoice/my-modal-hotel-invoice.component';
import { MyModalHotelReceiptComponent } from './modal-components/my-modal-hotel-receipt/my-modal-hotel-receipt.component';
import { MyModalHotelVoucherComponent } from './modal-components/my-modal-hotel-voucher/my-modal-hotel-voucher.component';

@Component({
    selector: 'app-hotel-booked-detail-page',
    templateUrl: './hotel-booked-detail-page.component.html',
    styleUrls: ['./hotel-booked-detail-page.component.scss']
})
export class HotelBookedDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    headerConfig: any;         // 헤더 컴포넌트 설정값
    resolveData: any;          // route 통해 받은 데이터
    hotelBookingInfo: any;     // BOOKING HOTEL DETAIL rs
    guestNumInfo: any;         // 예약정보 > 객실정보 > 투숙개 정보 ex)성인1, 아동2
    rooms: Array<any> = [];    // 여행자 정보 > 객실별 여행자 정보 (성인/아동)

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    bsModalRef: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private apiMypageService: ApiMypageService,
        private comService: HotelComService,
        private apiHotelService: ApiHotelService,
        private bsModalService: BsModalService,
        public jwtService: JwtService,
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
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = '';

        //this.headerInit();
        this.routeInit();

    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
        this.closeAllModals();
    }


    routeInit() {
        console.info('[routeInit]');
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.resolveData = _.cloneDeep(data.resolveData);

                        if (this.isBrowser) {
                            this.pageInit();
                        }
                    }
                )
        );
    }

    pageInit() {
        this.loadingBool = false;
        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: Number(this.resolveData.userNo),
                bookingItemCode: this.resolveData.bookingItemCode
            }
        };
        console.info('pageInit >> rq', rq);
        this.subscriptionList.push(
            this.apiMypageService.POST_BOOKING_HOTEL_DETAIL(rq)
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[pageInit > POST_BOOKING_DETAIL]', res);
                            this.hotelBookingInfo = _.cloneDeep(res['result']);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    },
                    () => {
                        console.log('POST_BOOKING_DETAIL completed.');
                        this.loadingBool = true;

                        this.guestListInit(this.hotelBookingInfo.rooms);
                    }
                )
        );
    }

    /**
     * api 호출
     * /booking/hotel/cancel
     */
    async callApiHotelCancel() {
        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                bookingItemCode: this.hotelBookingInfo.summary.bookingItemCode
            }
        };

        await this.apiHotelService.POST_HOTEL_CANCEL(rq)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info('[호텔 예약취소 > res]', res);
                    this.comService.refresh(); //새로고침
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.errorMessage);
            });

    }

    /**
     *  1.여행자 정보 > 객실별 여행자 정보 (성인/아동) rooms init
     *  2.예약정보 > 객실정보 > 투숙객 정보 guestNumInfo init
     * @param $roomList
     */
    guestListInit($roomList) {
        let returntxt: string = '';
        let adultNum: number = 0;
        let childrenNum: number = 0;
        for (const roomItem of $roomList) {
            const adult = [];
            const child = [];
            for (const traveler of roomItem.travelers) {
                if (traveler.ageTypeCode === 'ADT') {
                    adultNum += 1;
                    adult.push(traveler);
                }

                if (traveler.ageTypeCode === 'CHD') {
                    childrenNum += 1;
                    child.push(traveler);
                }
            }

            let rooms = {};
            if (child.length > 0) {
                rooms = {
                    adultList: adult,
                    childList: child
                };
            } else {
                rooms = {
                    adultList: adult
                };
            }

            this.rooms.push(rooms);
        }


        console.info('guestListInit >> rooms', this.rooms);

        returntxt = '성인 ' + adultNum;
        if (childrenNum > 0)
            returntxt += ', 아동 ' + childrenNum;

        //인원수 정보
        this.guestNumInfo = returntxt;
        console.info('guestListInit', this.guestNumInfo);
    }


    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_HOTEL
        };
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     *호텔 등급 클래스명 구하기
     * @param $star -> ex) 5.0 / 4.5 ...
     */
    getHotelStarRating($star) {
        if (!$star) {
            return '0';
        }

        const hotelGradeCodeSplit = $star.split('.');
        let result = hotelGradeCodeSplit[0];
        if (hotelGradeCodeSplit[1] > 0) {
            result += 'h';
        }
        return result;
    }

    /**
     * 예약 취소하기
     * @param e
     */
    onBookingCancel(e) {
        console.info('예약 취소하기', e);
        let alertHtml = '';
        if (this.hotelBookingInfo.summary.bookingStatusCode === 'BKS02') { //예약 취소 가능한 경우
            const hotelNameLn = this.hotelBookingInfo.summary.hotelNameLn;
            const checkInDate = moment(this.hotelBookingInfo.summary.checkInDate).format('YYYY.MM.DD(dd)');
            const checkOutDate = moment(this.hotelBookingInfo.summary.checkOutDate).format('YYYY.MM.DD(dd)');
            const bookingNum = `예약번호 : ${this.hotelBookingInfo.summary.bookingCode}`;
            alertHtml = `${hotelNameLn} ${checkInDate}-${checkOutDate}<br>${bookingNum}`;
            this.cancelAlert('예약을 취소 하시겠습니까?', alertHtml);
        } else { //예약 취소 가능 X
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
                    if ($alertHtml) // 예약 취소 가능한 경우만 api 호출
                        this.callApiHotelCancel();
                }
            }
        };

        if ($alertHtml) { // 예약 취소 가능한 경우, 취소 버튼 display
            initialState['cancelObj'] = {
                fun: () => { }
            };
        }
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    openHotelBoucher(e) {
        console.info('호텔 바우쳐', e);

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
            MyModalHotelVoucherComponent,
            { initialState, ...configInfo }
        );
    }

    // 호텔 인보이스 모달
    openHotelInvoice(e) {
        console.info('호텔 인보이스', e);

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
            MyModalHotelInvoiceComponent,
            { initialState, ...configInfo }
        );
    }


    openHotelReceipt(e) {
        console.info('호텔 영수증', e);

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
    goToReservation() {
        const path = '/my-reservation-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToRecent() {
        const path = '/my-recent-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToWish() {
        const path = '/my-wish-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToCoupon() {
        // this.onCloseClick();
        const path = '/my-coupon-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToQna() {
        const path = '/my-qna-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToReview() {
        const path = '/my-review-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToCustomer() {
        // const path = '/my-customer-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToNotice() {
        const path = '/my-notice-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToEvent() {
        const path = '/my-promotion-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToShare() {
        // const path = '/my-share-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToSeller() {
        // const path = '/my-seller-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToAgreement() {
        // const path = '/my-agreement-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
}
