import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ApiBookingService } from '../../api/booking/api-booking.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiMypageService } from '../../api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '../../common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { MyModalRentConfirmationComponent } from './modal-components/my-modal-rent-confirmation/my-modal-rent-confirmation.component';
import { MyModalRentInvoiceComponent } from './modal-components/my-modal-rent-invoice/my-modal-rent-invoice.component';

@Component({
    selector: 'app-rent-booked-detail-page',
    templateUrl: './rent-booked-detail-page.component.html',
    styleUrls: ['./rent-booked-detail-page.component.scss']
})
export class RentBookedDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    headerConfig: any;
    resolveData: any;
    bookingInfo: any;
    locationType: boolean = true;
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
        private router: Router,
        private route: ActivatedRoute,
        private apiMypageService: ApiMypageService,
        private apiBookingService: ApiBookingService,
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

        this.headerInit();
        this.routeInit();

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
            this.apiMypageService.POST_BOOKING_RENT_DETAIL(rq)
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (res: any) => {
                        console.info('[pageInit > POST_BOOKING_DETAIL]', res);
                        if (res.succeedYn) {
                            this.bookingInfo = _.cloneDeep(res['result']);
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
                    }
                )
        );

        if (rq.currency === 'KRW')
            this.locationType = true;
        else {
            this.locationType = false;
        }

    }

    /**
     * 렌터카 예약 취소
     * @param $resItem
     */
    rentBookedCancel() {
        // const tgItem = $resItem;
        // const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                bookingItemCode: this.bookingInfo.summary.bookingItemCode
            }
        };

        this.apiBookingService.POST_BOOKING_RENT_CANCEL(rq)
            .toPromise()
            .then((res: any) => {
                console.info('[res]', res);
                if (res.succeedYn) {
                    alert('렌터카 예약이 취소 완료되었습니다.');
                    this.pageReLoad();
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.errorMessage);
            });
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
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

    load() {
        console.info('load');
        this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
            () => {
                this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
            }
        );
    }

    pageReLoad() {
        console.info('[pageReLoad]');
        this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
            () => {
                this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
            });
    }

    getDday() {
        const tgTime = moment(this.bookingInfo.summary.pickupDate);
        const toDay = moment();

        const diffVal = tgTime.diff(toDay, 'days');
        // console.info('[diff]', diffVal);

        if (diffVal < 0) {
            return `[D+${Math.abs(diffVal)}]`;
        } else {
            return `[D-${diffVal}]`;
        }

    }



    onGoToRentMain() {
        const path = '/rent-main';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    onBookingCancel(e) {
        console.info('예약 취소하기', e);
        const vehicleNameEn = this.bookingInfo.summary.vehicleNameEn;
        const checkInDate = moment(this.bookingInfo.summary.checkInDate).format('YYYY.MM.DD(dd)');
        const checkOutDate = moment(this.bookingInfo.summary.checkOutDate).format('YYYY.MM.DD(dd)');
        const bookingNum = `예약번호 : ${this.bookingInfo.summary.bookingCode}`;
        const alertHtml = `${vehicleNameEn}<br>${checkInDate}-${checkOutDate}<br>${bookingNum}`;
        this.cancelAlert(alertHtml);
    }

    openRentConfirm(e) {
        console.info('렌트 확정서', e);

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
            MyModalRentConfirmationComponent,
            { initialState, ...configInfo }
        );
    }

    // 렌터카 인보이스 모달
    openRentInvoice(e) {
        console.info('렌트 인보이스', e);

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
            MyModalRentInvoiceComponent,
            { initialState, ...configInfo }
        );
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
                }
            },
            cancelObj: {
                fun: () => {
                    // this.load();
                }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
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
        const path = '/my-agreement-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
}
