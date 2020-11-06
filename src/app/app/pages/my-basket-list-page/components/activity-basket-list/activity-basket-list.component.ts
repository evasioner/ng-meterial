import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as moment from 'moment';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-basket-list',
    templateUrl: './activity-basket-list.component.html',
    styleUrls: ['./activity-basket-list.component.scss']
})
export class ActivityBasketListComponent extends BaseChildComponent implements OnInit {
    @Input() resolveData: any;
    todayTime = moment().format(' YYYY. MM. DD HH:mm:ss');  // 현재 일시
    sortKey: any = 0;
    selectedAll: any;
    basketList: Array<any>;
    loadingBool: Boolean = false;
    result: any;
    cateResult: any[] = [];
    pagePath: any;
    totalCount = 0;
    totalListCount = 0;
    checkBoxValue: boolean = true;
    limitStart = 0;
    limitEnd = 10;
    pageCount = 10;
    infiniteScrollConfig: any = {
        distance: 0,
        throttle: 300
    };
    lastMessage: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        private apiMypageService: ApiMypageService,
        private loadingBar: LoadingBarService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.onScroll();
    }

    async callBasketListApi() {
        const $rq = {
            'stationTypeCode': environment.STATION_CODE,
            'currency': this.resolveData.currency,
            'language': this.resolveData.language,
            'condition': {
                'userNo': this.resolveData.condition.userNo,
                'excludeCancelYn': false,      // 예약취소를 제외한 결과를 가져올것인지 여부
                'itemCategoryCode': 'IC04',  // 액티비티리스트라서 itemCategoryCode가 IC04
                'limits': [
                    this.limitStart,
                    this.limitEnd
                ]
            }
        };

        if (this.totalCount === 0) {  //처음 로딩시에만 안보이게 처리하고 무한스크롤로 추가될때는 true상태로 진행됨
            this.loadingBool = false;
        }
        this.loadingBar.start();

        return this.apiMypageService.POST_BASKET_LIST($rq)
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
            .catch((err: any) => {
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
            this.result = await this.callBasketListApi();
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

    // 업데이트순, 일정순 정렬
    sortStr(param) {
        this.sortKey = param;
    }

    // 전체선택 클릭
    allCheck() {
        for (let i = 0; i < this.basketList.length; i++) {
            this.basketList[i].selected = this.selectedAll;
        }
    }

    onCheck() {
        this.selectedAll = this.basketList.every(item => {
            return item.selected == true;
        });
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

    /*
    * 장바구니 페이지
    * 삭제하기 예약하기로 넘어가는
    * 각 값의 스키마
    * 7월 23일 유준우
    */


    //   goBasketQnaPage() {
    //     const rqInfo =
    //     {
    //       "stationTypeCode": environment.STATION_CODE,
    //       "currency": this.resolveData.currency,
    //       "language": this.resolveData.language,
    //       "condition": {
    //           "userNo": null,
    //       "bookingItemCode": null
    //       }
    //     };
    //     const path = '/my-reservation-qna-list';
    //     const extras = {
    //       relativeTo: this.route
    //     };
    //     console.log('path >>>>>', path);

    //     this.router.navigate([path], extras);
    //   }

    //   goCancelPage(code, cate) {
    //     const rqInfo =
    //     {
    //       "stationTypeCode": environment.STATION_CODE,
    //       "currency": this.resolveData.currency,
    //       "language": this.resolveData.language,
    //       "condition": {
    //           "userNo": null,
    //       "bookingItemCode": null
    //       }
    //     };
    //     switch (cate) {
    //       case 'IC01':
    //         this.pagePath = '/my-reservation-flight-cancel/';
    //         break;
    //       case 'IC02':
    //         this.pagePath = '/my-reservation-hotel-cancel/';
    //         break;
    //       case 'IC03':
    //         this.pagePath = '/my-reservation-rent-cancel/';
    //         break;
    //       case 'IC04':
    //         this.pagePath = '/my-reservation-activity-cancel/';
    //         break;
    //       default:
    //         this.pagePath = '/my-reservation-flight-cancel/';
    //         break;
    //     }
    //     const path = this.pagePath;
    //     const extras = {
    //       relativeTo: this.route
    //     };
    //     console.log('path >>>>>', path);
    //     console.log('code >>>>>', code);

    //     this.router.navigate([path], extras);
    //   }

    //   goDetailPage(code, cate) {
    //     const rqInfo =
    //     {
    //       "stationTypeCode": environment.STATION_CODE,
    //       "currency": this.resolveData.currency,
    //       "language": this.resolveData.language,
    //       "condition": {
    //           "userNo": null,
    //       "bookingItemCode": null
    //       }
    //     };
    //     rqInfo.condition.userNo = this.resolveData.condition.userNo;
    //     rqInfo.condition.bookingItemCode = ''+code+'';
    //     switch (cate) {
    //       case 'IC01':
    //         this.pagePath = '/my-reservation-flight-detail/';
    //         break;
    //       case 'IC02':
    //         this.pagePath = '/my-reservation-hotel-detail/';
    //         break;
    //       case 'IC03':
    //         this.pagePath = '/my-reservation-rent-detail/';
    //         break;
    //       case 'IC04':
    //         this.pagePath = '/my-reservation-activity-detail/';
    //         break;
    //       default:
    //         this.pagePath = '/my-reservation-flight-detail/';
    //         break;
    //     }
    //     const qsStr = qs.stringify(rqInfo);
    //     const path = this.pagePath + qsStr;
    //     const extras = {
    //       relativeTo: this.route
    //     };
    //     console.log('rqInfo >>>>>', rqInfo);
    //     console.log('path >>>>>', path);

    //     this.router.navigate([path], extras);
    //   }
    // }

}
