import { Component, OnInit, Input, OnDestroy, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertMyReservationListPage } from '../../../../store/my-reservation-list-page/my-reservation-list-page/my-reservation-list-page.actions';

import * as commonUserInfoSelectors from '../../../../store/common/common-user-info/common-user-info.selectors';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as qs from 'qs';
import * as moment from 'moment';
import * as _ from 'lodash';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../../../common-source/services/rent-com-service/rent-util.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { myReservationListPageVm } from '../../insterfaces/my-reservation-list-page-vm';

import { PageCodes } from '../../../../common-source/enums/page-codes.enum';
import { MyReservationListPageStoreIds } from '../../enums/my-reservation-list-page-store-ids.enum';

import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { BasePageComponent } from '../../../base-page/base-page.component';

@Component({
    selector: 'app-rent-reservation-list',
    templateUrl: './rent-reservation-list.component.html',
    styleUrls: ['./rent-reservation-list.component.scss']
})
export class RentReservationListComponent extends BasePageComponent implements OnInit, OnDestroy {
    @Input() resolveData: any;
    element: any;
    $element: any;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;
    isLogin: boolean = false;
    loadingBool: boolean = false;
    tabNo: any;
    vm: myReservationListPageVm;
    selectCode = 0;
    commonUserInfo$: any;

    userInfo: any;
    traveler: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private apiMypageService: ApiMypageService,
        private apiBookingService: ApiBookingService,
        public bsModalService: BsModalService,
        private el: ElementRef,
        public jwtService: JwtService,
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
        this.element = this.el.nativeElement;
        this.subscriptionList = [];
    }
    ngOnInit() {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';
        this.routeInit();
    }


    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    commonUserInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])),
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[commonUserInit]', ev);
                            console.info('[this.vm]', this.vm);
                            this.userInfo = ev['userInfo'];
                            this.traveler = ev['traveler'];

                        }
                    }
                )
        );
    }

    routeInit() {
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveDataInit(data);
                        if (this.isBrowser) {
                            this.loginInit();
                        }
                    }
                )
        );
    }

    /**
     * url 통해 전달 받은 데이터 초기화
     * - 모든 데이터가 string 형태로 넘어오기때문에 형변환한다.
     *
     * @param $data
     */
    resolveDataInit($data) {
        console.info('[resolveDataInit]', $data);
        this.resolveData = _.cloneDeep($data.resolveData);
        const userNo = Number(_.chain(this.resolveData)
            .get('condition.userNo')
            .value());
        const excludeCancelYn = (() => {
            const temp_excludeCancelYn = _.chain(this.resolveData).get('condition.excludeCancelYn').value();
            if (temp_excludeCancelYn === 'false') {
                return false;
            } else {
                return true;
            }
        })();
        this.resolveData.condition.userNo = userNo;
        this.resolveData.condition.excludeCancelYn = excludeCancelYn;
        console.info('[resolveData]', this.resolveData);
    }
    vmInit() {
        const RESOLVE_DATA = this.resolveData;



        this.vm = {
            // selectCode: RESOLVE_DATA.selectCode,
            selectCode: '0',
            searchInfo: null,
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: RESOLVE_DATA.currency,
                language: RESOLVE_DATA.language,
                condition: {
                    // userNo: RESOLVE_DATA.condition.userNo,
                    userNo: this.userInfo.user.userNo,
                    excludeCancelYn: RESOLVE_DATA.condition.excludeCancelYn, // true : 예약취소 포함, false : 예약취소 제외
                    itemCategoryCode: 'IC03',
                    limits: [1, 10],
                }
            },
            rs: null
        };



        /**
         * excludeCancelYn : 필수값
         * true : 예약취소 포함, false : 예약취소 제외
         */

        /**
         * itemCategoryCode : 옵션 | 카테고리 구분
         * - this.vm.selectCode !== '0' 경우 itemCategoryCode 추가한다.
         * - this.vm.selectCode === '1' | IC01 | 항공
         * - this.vm.selectCode === '2' | IC02 | 호텔
         * - this.vm.selectCode === '4' | IC03 | 렌터카
         * - this.vm.selectCode === '3' | IC04 | 액티비티
         * - this.vm.selectCode === '5' | IC05 | 묶음할인
         */


        this.store.dispatch(
            upsertMyReservationListPage({
                myReservationListPage: {
                    id: MyReservationListPageStoreIds.MY_RESOLVE_DATA,
                    result: this.vm
                }
            })
        );

    }

    /**
     * 페이지 초기화 : api 통신으로 데이터를 가져옴
     * api를 통해 화면에 표시할 데이터를 가져온다.
     */
    pageInit() {
        this.commonUserInit();
        this.vmInit();

        this.headerInit();
        this.uiInit();

        const rq = this.vm.rq;

        this.loadingBool = false;
        this.loadingBar.start();

        this.subscriptionList.push(
            this.apiMypageService.POST_BOOKING_LIST(rq)
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.apiDataInit(res);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    },
                    () => {
                        console.log('POST_RENT_LIST completed.');
                        this.loadingBool = true;
                        this.loadingBar.complete();
                    }
                )
        );
    }

    uiInit() {
        const tgEl = this.element.querySelector(`[data-target="resCancel"] input[type='checkbox']`);
        const excludeCancelYn = this.vm.rq.condition.excludeCancelYn;
        console.info('[uiInit]', excludeCancelYn);
        console.info('[tgEl]', tgEl);
        tgEl.checked = excludeCancelYn;
    }

    apiDataInit($res) {

        console.info('[apiDataInit]', $res);

        const TEMP_DATA = _.cloneDeep(this.vm);
        TEMP_DATA.rs = $res;

        this.vm = TEMP_DATA;

        console.info('[TEMP_DATA]', TEMP_DATA);
        console.info('[vm]', this.vm);

        this.completeAfterVmUpdate();
    }

    /**
     * 항공 예약 취소
     * @param $resItem
     */
    // flightBookedCancel($resItem) {
    //     const tgItem = $resItem;
    //     const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

    //     const rq = {
    //         stationTypeCode: environment.STATION_CODE,
    //         currency: 'KRW',
    //         language: 'KO',
    //         condition: {
    //             bookingItemCodes: [bookingItemCode],
    //             smsSendYn: false
    //         }
    //     };

    //     this.apiBookingService.POST_BOOKING_FLIGHT_CANCEL(rq)
    //         .toPromise()
    //         .then((res: any) => {
    //             console.info('[res]', res);
    //             if (res.succeedYn) {
    //                 alert('항공 예약이 취소 완료되었습니다.');
    //                 this.pageReLoad();
    //             }else{
    // this.alertService.showApiAlert(res.errorMessage);
    // }
    //         })
    //         .catch((err:any) => {
    // this.alertService.showApiAlert(err.error.errorMessage);
    //         });
    // }

    // /**
    //  * 호텔 예약 취소
    //  * @param $resItem
    //  */
    // hotelBookedCancel($resItem) {
    //     const tgItem = $resItem;
    //     const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

    //     const rq = {
    //         stationTypeCode: environment.STATION_CODE,
    //         currency: 'KRW',
    //         language: 'KO',
    //         condition: {
    //             bookingItemCode: bookingItemCode
    //         }
    //     };

    //     this.apiBookingService.POST_BOOKING_HOTEL_CANCEL(rq)
    //         .toPromise()
    //         .then((res: any) => {
    //             console.info('[res]', res);
    //             if (res.succeedYn) {
    //                 alert('호텔 예약이 취소 완료되었습니다.');
    //                 this.pageReLoad();
    //             }else{
    // this.alertService.showApiAlert(res.errorMessage);
    //     }
    //         })
    //         .catch((err:any) => {
    // this.alertService.showApiAlert(err.error.errorMessage);
    //         });
    // }

    /**
     * 렌트카 예약 취소
     * @param $resItem
     */
    rentBookedCancel($resItem) {
        const tgItem = $resItem;
        const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                bookingItemCode: bookingItemCode
            }
        };

        this.apiBookingService.POST_BOOKING_RENT_CANCEL(rq)
            .toPromise()
            .then((res: any) => {
                console.info('[res]', res);
                if (res.succeedYn) {
                    alert('렌트카 예약이 취소 완료되었습니다.');
                    this.pageReLoad();
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.errorMessage);
            });
    }

    // activityBookedCancel($resItem) {
    //     const tgItem = $resItem;
    //     const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

    //     const rq = {
    //         stationTypeCode: environment.STATION_CODE,
    //         currency: 'KRW',
    //         language: 'KO',
    //         condition: {
    //             bookingItemCode: bookingItemCode
    //         }
    //     };

    //     this.apiBookingService.POST_BOOKING_ACTIVITY_CANCEL(rq)
    //         .toPromise()
    //         .then((res: any) => {
    //             console.info('[res]', res);
    //             if (res.succeedYn) {
    //                 alert('액티비티 예약이 취소 완료되었습니다.');
    //                 this.pageReLoad();
    //             }else{
    // this.alertService.showApiAlert(res.errorMessage);
    // }
    //         })
    //         .catch((err:any) => {
    // this.alertService.showApiAlert(err.error.errorMessage);
    //         });
    // }

    loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl).then(
            (e) => {
                console.info('[jwtService.loginGuardInit > ok]', e);
                if (e) {
                    this.pageInit();
                }
            },
            (err) => {
                console.info('[jwtService.loginGuardInit > err]', err);
            });
    }

    headerInit() {
        console.info('[headerInit]');
        this.headerConfig = {
            category: PageCodes.PAGE_MY
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }

    get totalCount() {
        if (this.loadingBool) {
            return this.vm.rs.result.totalCount;
        }
    }

    get reservationListLength() {
        if (this.loadingBool) {
            return this.vm.rs.result.list.length;
        }
    }

    get reservationList() {
        if (this.loadingBool) {
            return this.vm.rs.result.list;
        }
    }

    get excludeCancelYn() {
        if (this.loadingBool) {
            return this.vm.rq.condition.excludeCancelYn;
        }
    }

    set excludeCancelYn($val: boolean) {
        console.info('[set excludeCancelYn > $val]', $val);
        const TEMP_DATA = _.cloneDeep(this.vm);
        TEMP_DATA.rq.condition.excludeCancelYn = $val;
        this.vm = TEMP_DATA;
        console.info('[set excludeCancelYn]', this.vm);

        /**
         * 변경된 rq를 가지고 리로드
         */
        this.pageReLoadRq();


    }

    /**
     * 결재 상태 확인
     * @param $resItem
     */
    getBookedState($resItem) {
        // console.info('[$resItem]', $resItem);

        const tgItem = $resItem;
        const balanceAmount = tgItem['balanceAmount'];
        const sumAmount = tgItem['sumAmount'];
        let tempType = null;

        if (balanceAmount === 0) { // 결제완료
            tempType = '결제완료';
        } else if (balanceAmount === sumAmount) { // 부분미납
            tempType = '부분미납';
        } else if (balanceAmount > 0) { // 전체미납
            tempType = '전체미납';
        } else {
            console.error('결제완료, 부분미납, 전체미납 이 아닌경우 확인 필요!');
        }
        return tempType;
    }
    getBookingStatusName($resItem) {
        return $resItem.items[0].bookingStatusName;
    }


    completeAfterVmUpdate() {
        this.store.dispatch(
            upsertMyReservationListPage({
                myReservationListPage: {
                    id: MyReservationListPageStoreIds.MY_SEARCH_RESULT_INFO,
                    result: this.vm
                }
            })
        );
    }

    pageReLoad() {
        console.info('[pageReLoad]');
        this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
            () => {
                this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
            });
    }

    pageReLoadRq() {
        console.info('[pageReLoadRq]');

        const rqInfo = this.vm.rq;
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        console.info('[rqInfo]', rqInfo);

        this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
            () => {
                // this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                this.router.navigate([path]);
            });
    }

    /**
     * 취소 예약 제외 chkeckbox
     * @param e
     */
    onEexcludeCancelYnChange(e) {
        const isChecked = e.target.checked;
        console.info('[isChecked]', isChecked);
        if (isChecked) {
            this.excludeCancelYn = true;
        } else {
            this.excludeCancelYn = false;
        }
    }

    /**
     * 예약 상세
     */
    onBookedDetailClick($resItem) {
        console.info('[onBookedDetailClick]', $resItem, $resItem.categories[0]['code']);
        const tgItem = $resItem;
        const categoriesCode = tgItem.categories[0]['code'];
        const bookingItemCode = tgItem['items'][0]['bookingItemCode'];

        const rq = {
            userNo: this.userInfo.user.userNo,
            bookingItemCode: bookingItemCode
        };
        const qsStr = qs.stringify(rq);

        if (categoriesCode === 'IC01') { // 항공
            console.info('[항공 예약 상세 진행]');
            const path = '/flight-booked-detail/' + qsStr;
            this.router.navigate([path], { relativeTo: this.route });

        } else if (categoriesCode === 'IC02') { // 호텔
            console.info('[호텔 예약 상세 진행]');
            const path = '/hotel-booked-detail/' + qsStr;
            this.router.navigate([path], { relativeTo: this.route });

        } else if (categoriesCode === 'IC03') { // 렌터카
            console.info('[렌터카 예약 상세 진행]');
            const path = '/rent-booked-detail/' + qsStr;
            this.router.navigate([path], { relativeTo: this.route });

        } else if (categoriesCode === 'IC04') { // 액티비티
            console.info('[액티비티 예약 상세 진행]');
            const path = '/activity-booked-detail/' + qsStr;
            this.router.navigate([path], { relativeTo: this.route });

        } else if (categoriesCode === 'IC05') { // 묶음할인
            console.info('[묶음할인 예약 상세 진행]');

        }

    }

    /**
     * 예약 취소
     */
    onBookedCancelClick($resItem) {
        console.info('[onBookedCancelClick]', $resItem, $resItem.categories[0]['code']);
        const tgItem = $resItem;
        const categoriesCode = tgItem.categories[0]['code'];
        const bookingName = tgItem.bookingName;
        const bookingCode = tgItem.bookingCode;
        const travelFromDate = tgItem.travelFromDate;
        const travelToDate = tgItem.travelToDate;


        const alertTitle = (() => {
            if (categoriesCode === 'IC01') { // 항공
                return '항공 예약 취소';
            } else if (categoriesCode === 'IC02') { // 호텔
                return '호텔 예약 취소';
            } else if (categoriesCode === 'IC03') { // 렌터카
                return '렌터카 예약 취소';
            } else if (categoriesCode === 'IC04') { // 액티비티
                return '액티비티 예약 취소';
            } else if (categoriesCode === 'IC05') { // 묶음할인
                return '묶음할인 예약 취소';
            }
        })();


        const titleTxt = (() => {
            if (categoriesCode === 'IC01') { // 항공
                return `
        ${bookingName}
        <br>
        ${moment(travelFromDate).format('YYYY.MM.DD(dd)')} - ${moment(travelToDate).format('YYYY.MM.DD(dd)')}
        <br>
        예약번호 : ${bookingCode}
        `;

            } else if (categoriesCode === 'IC02') { // 호텔
                return `
        ${bookingName}
        <br>
        ${moment(travelFromDate).format('YYYY.MM.DD(dd)')} - ${moment(travelToDate).format('YYYY.MM.DD(dd)')}
        <br>
        예약번호 : ${bookingCode}
        `;

            } else if (categoriesCode === 'IC03') { // 렌터카
                const rentVehicleVendorName = tgItem.items[0]['rent']['vehicleVendorName'];
                return `
        ${rentVehicleVendorName}
        <br>
        ${moment(travelFromDate).format('YYYY.MM.DD(dd) HH:mm')} - ${moment(travelToDate).format('YYYY.MM.DD(dd) HH:mm')}
        <br>
        예약번호 : ${bookingCode}
        `;
            } else if (categoriesCode === 'IC04') { // 렌터카
                return `
        ${bookingName}
        <br>
        ${moment(travelFromDate).format('YYYY.MM.DD(dd) HH:mm')} - ${moment(travelToDate).format('YYYY.MM.DD(dd) HH:mm')}
        <br>
        예약번호 : ${bookingCode}
        `;
            } else if (categoriesCode === 'IC05') { // 묶음할인
                return '';
            }
        })();


        const initialState = {
            alertTitle: alertTitle,
            titleTxt: titleTxt,
            cancelObj: {
                fun: () => {
                    // this.router.navigateByUrl(`/`, {skipLocationChange: true}).then(
                    //   () => {
                    //     this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
                    //   });
                }
            },
            okObj: {
                fun: () => {
                    if (categoriesCode === 'IC01') { // 항공
                        console.info('[항공 예약 취소 진행]');
                        // this.flightBookedCancel($resItem);

                    } else if (categoriesCode === 'IC02') { // 호텔
                        console.info('[호텔 예약 취소 진행]');
                        // this.hotelBookedCancel($resItem);

                    } else if (categoriesCode === 'IC03') { // 렌터카
                        console.info('[렌터카 예약 취소 진행]');
                        this.rentBookedCancel($resItem);

                    } else if (categoriesCode === 'IC04') { // 액티비티
                        console.info('[액티비티 예약 취소 진행]');
                        // this.activityBookedCancel($resItem);

                    } else if (categoriesCode === 'IC05') { // 묶음할인
                        console.info('[묶음할인 예약 취소 진행]');

                    }
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
        // const path = '/my-event-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
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

