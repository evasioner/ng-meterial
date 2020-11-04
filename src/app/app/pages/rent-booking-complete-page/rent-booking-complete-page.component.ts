import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as commonUserInfoSelectors from '../../store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { WebShareService } from '@/app/common-source/services/web-share/web-share.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-rent-booking-complete-page',
    templateUrl: './rent-booking-complete-page.component.html',
    styleUrls: ['./rent-booking-complete-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})//RentBookingCompletePageComponent
export class RentBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    vm: any = {};

    loadingBool: boolean = false;

    resolveData: any;

    userInfo: any;
    traveler: any;
    commonUserInfo$: any;

    rentInfo: any;
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
        private bsModalService: BsModalService,
        private el: ElementRef,
        private webShareS: WebShareService
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

    ngOnInit(): void {
        super.ngOnInit();

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.pageInit(data.resolveData);
                    }
                )
        );
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


    observableInit() {
        this.commonUserInfo$ = this.store
            .pipe(select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])));
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.commonUserInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.userInfo = ev.userInfo;
                            this.traveler = ev.traveler;
                            console.info('[userInfo]', ev.userInfo);
                            console.info('[traveler]', ev.traveler);
                        }
                    }
                )
        );
    }

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     * @param $resolveData
     */
    pageInit($resolveData) {
        this.resolveData = $resolveData;

        // ---------[헤더 초기화]
        this.headerInit();
        // ---------[ end 헤더 초기화]


    }

    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerType = HeaderTypes.PAGE;
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    detailLink() {
        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.resolveData.userInfo.user.userNo,
                'bookingItemCode': this.resolveData.result.bookingItems[0].bookingItemCode
            }
        };
        const path = '/my-reservation-rent-detail/' + qs.stringify(rqInfo);
        this.router.navigate([path]);

        // const rqInfo =
        //     {
        //         "selectCode": "IC03",  //항공:IC01, 호텔:IC01, 액티비티:IC04, 렌터카:IC03
        //         'stationTypeCode': environment.STATION_CODE,
        //         "currency": "KRW",
        //         "language": "KO",
        //         "bookingItemCode": this.resolveData.bookingItems[0].bookingItemCode
        //     };
        // const path = '/my-reservation-flight-detail/' + qs.stringify(rqInfo);
        // this.router.navigate([path]);
    }

    listLink() {
        const rqInfo =
        {
            'selectCode': '4',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.resolveData.userInfo.user.userNo,
                'bookingItemCode': this.resolveData.result.bookingItems[0].bookingItemCode
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        this.router.navigate([path]);
    }
    /**
    * onShareClick
    * 공유하기
    *
    * @param event dom 이벤트
    */
    public onShareClick(event: any): void {
        event && event.preventDefault();

        this.webShareS.webShare(
            {
                title: this.rentInfo,
                text: '',
                url: this.router.url
            }
        );
    }

}
