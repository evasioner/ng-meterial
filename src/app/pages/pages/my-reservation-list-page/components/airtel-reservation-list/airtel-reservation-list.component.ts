import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingBarService } from '@ngx-loading-bar/core';

import * as qs from 'qs';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

@Component({
    selector: 'app-airtel-reservation-list',
    templateUrl: './airtel-reservation-list.component.html',
    styleUrls: ['./airtel-reservation-list.component.scss']
})
export class AirtelReservationListComponent implements OnInit {
    @Input() resolveData: any;
    loadingBool: Boolean = false;
    result: any;
    cateResult: any[] = [];
    pagePath: any;
    totalCount = 0;
    totalListCount = 0;
    checkBoxValue: boolean = true;
    limitStart = 1;
    limitEnd = 10;
    pageCount = 10;
    infiniteScrollConfig: any = {
        distance: 0,
        throttle: 300
    };
    lastMessage: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiMypageService: ApiMypageService,
        private loadingBar: LoadingBarService,
        private alertService: ApiAlertService
    ) { }

    ngOnInit(): void {
        // this.callReservationtListApi();
        this.onScroll();
    }

    // API 호출 전체 예약리스트
    async callReservationtListApi() {
        const $rq = {
            'stationTypeCode': environment.STATION_CODE,
            'currency': this.resolveData.currency,
            'language': this.resolveData.language,
            'condition': {
                'userNo': this.resolveData.condition.userNo,
                'excludeCancelYn': false,      // 예약취소를 제외한 결과를 가져올것인지 여부
                'itemCategoryCode': 'IC05',  // 전체리스트라서 itemCategoryCode가 필요없음
                'limits': [
                    this.limitStart,
                    this.limitEnd
                ]
            }
        };

        if (this.checkBoxValue) { // 취소예약제외 하려면 아래 condition을 추가함
            $rq.condition.excludeCancelYn = this.checkBoxValue;
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
                this.alertService.showApiAlert(err.error.errorMessage);
            });
    }

    // api rs 분할하기
    // async jsonFilter(cate) {
    // //  * IC01,   // 항공
    // //  * IC02,   // 호텔
    // //  * IC03,   // 렌터카
    // //  * IC04,   // 티켓/투어, 액티비티
    // //  * IC05,   // 묶음할인
    //   this.result = await this.callReservationtListApi(null);
    //   this.totalCount = this.result.result.totalCount;
    //   console.info('this.result>>>>>', this.result);

    //   // 전체리스트 중 묶음할인인 경우 여러경우의 수가 나오므로 ~.items[..]에 ~.categories.code값을 세팅에서 items[..]로만 templete을 renderring함
    //   this.result.result.list.forEach((el, idx) => {
    //     if (Object.keys(el.items).length > 1) {
    //       el.items.forEach((e, i) => {
    //         e.cateCode = el.categories[i].code;
    //         e.cateName = el.categories[i].name;
    //       });
    //     }
    //   });

    //   this.cateResult = await this.result.result.list;
    //   console.info('cateResult>>>>>', this.cateResult);
    //   // console.info('ic05Result>>>>>', this.ic05Result);
    // }

    async increase() {
        // //  * IC01,   // 항공
        // //  * IC02,   // 호텔
        // //  * IC03,   // 렌터카
        // //  * IC04,   // 티켓/투어, 액티비티
        // //  * IC05,   // 묶음할인
        if (this.totalCount !== 0 && this.totalCount < this.pageCount) {  // totalCount != 0 (첫번째 api 호출)이 아니고
            this.lastMessage = '마지막 데이터입니다.';
            return false;                                                   // api결과 갯수가 pageCount보다 작으면 마지막 data로 봄
        } else {
            this.result = await this.callReservationtListApi();
            console.info('this.result>>>>>', this.result);
            // 전체리스트 중 묶음할인인 경우 여러경우의 수가 나오므로 ~.items[..]에 ~.categories.code값을 세팅에서 items[..]로만 templete을 renderring함
            this.result.result.list.forEach((el) => {
                if (Object.keys(el.items).length > 1) {
                    el.items.forEach((e, i) => {
                        e.cateCode = el.categories[i].code;
                        e.cateName = el.categories[i].name;
                    });
                }
            });
        }
        const tmpCateResult = await this.result.result.list;      // api에서 limit갯수로 받아온 리스트
        this.cateResult = this.cateResult.concat(tmpCateResult);  // cateResult에 tmpCateResult 가 concat 된 리스트
        this.totalCount = this.result.result.totalCount;              // api 결과값의 totalCount
        this.totalListCount = Object.keys(this.cateResult).length;    // cateResult 총 갯수
        console.info('tmpCateResult>>>>>', tmpCateResult);
        console.info('cateResult>>>>>', this.cateResult);
    }

    selectDetail(event: MouseEvent) {
        event && event.preventDefault();

        (<HTMLInputElement>event.target).closest('.btn-detail-view').classList.toggle('active');
    }

    onCheck() {
        this.checkBoxValue = !this.checkBoxValue;
        this.totalCount = 0;
        this.limitStart = 1;
        this.limitEnd = 10;
        this.cateResult = [];
        this.increase();
    }

    onScroll() {
        this.increase();
    }

    goReservationQnaPage() {
        const path = '/my-reservation-qna-list';
        const extras = {
            relativeTo: this.route
        };
        console.log('path >>>>>', path);

        this.router.navigate([path], extras);
    }

    goCancelPage(code, cate) {
        switch (cate) {
            case 'IC01':
                this.pagePath = '/flight-booked-detail-page/';
                break;
            case 'IC02':
                this.pagePath = '/hotel-booked-detail-page/';
                break;
            case 'IC03':
                this.pagePath = '/rent-booked-detail-page/';
                break;
            case 'IC04':
                this.pagePath = '/activity-booked-detail-page/';
                break;
            default:
                this.pagePath = '/flight-booked-detail-page/';
                break;
        }
        const path = this.pagePath;
        const extras = {
            relativeTo: this.route
        };
        console.log('path >>>>>', path);
        console.log('code >>>>>', code);

        this.router.navigate([path], extras);
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
                this.pagePath = '/flight-booked-detail-page/';
                break;
            case 'IC02':
                this.pagePath = '/hotel-booked-detail-page/';
                break;
            case 'IC03':
                this.pagePath = '/rent-booked-detail-page/';
                break;
            case 'IC04':
                this.pagePath = '/activity-booked-detail-page/';
                break;
            default:
                this.pagePath = '/flight-booked-detail-page/';
                break;
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
