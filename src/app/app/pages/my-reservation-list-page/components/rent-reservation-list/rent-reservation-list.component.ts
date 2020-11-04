import { Component, Inject, Input, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as qs from 'qs';
import * as moment from 'moment';

import { ApiMypageService } from '@/app/api/mypage/api-mypage.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { BaseChildComponent } from '@app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-reservation-list',
    templateUrl: './rent-reservation-list.component.html',
    styleUrls: ['./rent-reservation-list.component.scss']
})
export class RentReservationListComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() public resolveData: any;
    public loadingBool: Boolean = false;
    public result: any;
    public cateResult: any[] = [];
    public pagePath: any;
    totalCount = 0;
    totalListCount = 0;
    public checkBoxValue: boolean = true;
    limitStart = 0;
    limitEnd = 10;
    pageCount = 10;
    public infiniteScrollConfig: any = {
        distance: 0,
        throttle: 300
    };
    public lastMessage: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly apiMypageService: ApiMypageService,
        private apiBookingService: ApiBookingService,
        public bsModalService: BsModalService,
        private readonly loadingBar: LoadingBarService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    ngOnInit() {
        super.ngOnInit();
        // this.callReservationtListApi();
        this.onScroll();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    // API 호출 전체 예약리스트
    async callReservationtListApi(cate) {
        const $rq = {
            'stationTypeCode': environment.STATION_CODE,
            'currency': this.resolveData.currency,
            'language': this.resolveData.language,
            'condition': {
                'userNo': this.resolveData.condition.userNo,
                'excludeCancelYn': false,      // 예약취소를 제외한 결과를 가져올것인지 여부
                'itemCategoryCode': 'IC03',  // 렌터카리스트라서 itemCategoryCode가 IC03
                'limits': [this.limitStart, this.limitEnd]
            }
        };

        if (this.checkBoxValue) {
            // 취소예약제외 하려면 아래 condition을 추가함
            $rq.condition.excludeCancelYn = false;
        } else {
            $rq.condition.excludeCancelYn = true;
        }

        if (this.totalCount === 0) {  //처음 로딩시에만 안보이게 처리하고 무한스크롤로 추가될때는 true상태로 진행됨
            this.loadingBool = false;
        }
        this.loadingBar.start();

        return this.apiMypageService.POST_BOOKING_LIST($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[예약리스트 > res]', res);

                if (res.succeedYn) {
                    this.limitStart += this.pageCount;
                    this.limitEnd += this.pageCount;
                    console.info('limitStart>>>', $rq.condition.limits[0]);
                    console.info('limitEnd>>>', $rq.condition.limits[1]);
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

    async increase() {
        //  * IC01,   // 항공
        //  * IC02,   // 호텔
        //  * IC03,   // 렌터카
        //  * IC04,   // 티켓/투어, 액티비티
        //  * IC05,   // 묶음할인
        if (this.totalCount !== 0 && this.totalCount < this.pageCount) {  // totalCount != 0 (첫번째 api 호출)이 아니고
            this.lastMessage = '마지막 데이터입니다.';

            return false;                                                   // api결과 갯수가 pageCount보다 작으면 마지막 data로 봄
        } else {
            this.result = await this.callReservationtListApi(null);
            console.info('this.result>>>>>', this.result);
            // 전체리스트 중 묶음할인인 경우 여러경우의 수가 나오므로 ~.items[..]에 ~.categories.code값을 세팅에서 items[..]로만 templete을 renderring함
            this.result.result.list.forEach((el, idx) => {
                if (Object.keys(el.items).length > 1) {
                    el.items.forEach((e, i) => {
                        e.cateCode = el.categories[i].code;
                        e.cateName = el.categories[i].name;
                    });
                }
            });
        }
        const tmpCateResult = await this.result.result.list;          // api에서 limit갯수로 받아온 리스트
        this.cateResult = this.cateResult.concat(tmpCateResult);      // cateResult에 tmpCateResult 가 concat 된 리스트
        this.totalCount = this.result.result.totalCount;              // api 결과값의 totalCount
        this.totalListCount = Object.keys(this.cateResult).length;    // cateResult 총 갯수
        console.info('cateResult>>>>>', this.cateResult);
    }

    onCheck() {
        this.checkBoxValue = !this.checkBoxValue;
        this.totalCount = 0;
        this.limitStart = 0;
        this.limitEnd = 10;
        this.cateResult = [];
        this.increase();
    }

    onScroll() {
        this.increase();
    }

    goReservationQnaPage() {
        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': this.resolveData.currency,
            'language': this.resolveData.language,
            'condition': {
                'userNo': null,
                'bookingItemCode': null
            }
        };
        const path = '/my-reservation-qna-list';
        const extras = {
            relativeTo: this.route
        };
        console.log('path >>>>>', path);

        this.router.navigate([path], extras);
    }

    pageReLoad() {
        console.info('[pageReLoad]');
        this.router.navigateByUrl(`/rent-reservation-list/`, { skipLocationChange: true }).then(
            () => {
                this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
            });
    }



    goCancelPage($resItem) {
        console.info('[onBookedCancelClick]', $resItem, $resItem.categories[0]['code']);
        const tgItem = $resItem;
        const categoriesCode = tgItem.categories[0]['code'];
        const categoriesName = tgItem.categories[0]['name'];
        const bookingName = tgItem.bookingName;
        const bookingItemCode = tgItem.items[0].bookingItemCode;
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
                [${categoriesName}]${bookingName}
            <br>
            ${moment(travelFromDate).format('YYYY.MM.DD(dd)')} - ${moment(travelToDate).format('YYYY.MM.DD(dd)')}
            <br>
            예약번호 : ${bookingItemCode}
            `;

            } else if (categoriesCode === 'IC02') { // 호텔
                return `
                [${categoriesName}]${bookingName}
            <br>
            ${moment(travelFromDate).format('YYYY.MM.DD(dd)')} - ${moment(travelToDate).format('YYYY.MM.DD(dd)')}
            <br>
            예약번호 : ${bookingItemCode}
            `;

            } else if (categoriesCode === 'IC03') { // 렌터카
                const rentVehicleVendorName = tgItem.items[0]['rent']['vehicleVendorName'];
                return `
                [${categoriesName}] ${rentVehicleVendorName}
            <br>
            ${moment(travelFromDate).format('YYYY.MM.DD(dd) HH:mm')} - ${moment(travelToDate).format('YYYY.MM.DD(dd) HH:mm')}
            <br>
            예약번호 : ${bookingItemCode}
            `;

            } else if (categoriesCode === 'IC04') { // 액티비티
                return `
            [${categoriesName}]${bookingName}
            <br>
            ${moment(travelFromDate).format('YYYY.MM.DD(dd)')} - ${moment(travelToDate).format('YYYY.MM.DD(dd)')}
            <br>
            예약번호 : ${bookingItemCode}
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

        this.subscriptionList = [
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
                    (err) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        ];
    }

    goDetailPage(code, cate) {
        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': this.resolveData.currency,
            'language': this.resolveData.language,
            'condition': {
                'userNo': null,
                'bookingItemCode': null
            }
        };
        rqInfo.condition.userNo = this.resolveData.condition.userNo;
        rqInfo.condition.bookingItemCode = '' + code + '';
        switch (cate) {
            case 'IC01':
                this.pagePath = '/my-reservation-flight-detail/';
                break;
            case 'IC02':
                this.pagePath = '/my-reservation-hotel-detail/';
                break;
            case 'IC03':
                this.pagePath = '/my-reservation-rent-detail/';
                break;
            case 'IC04':
                this.pagePath = '/my-reservation-activity-detail/';
                break;
            default:
                this.pagePath = '/my-reservation-flight-detail/';
        }
        const qsStr = qs.stringify(rqInfo);
        const path = this.pagePath + qsStr;
        const extras = {
            relativeTo: this.route
        };
        console.log('rqInfo >>>>>', rqInfo);
        console.log('path >>>>>', path);

        this.router.navigate([path], extras);
    }
}
