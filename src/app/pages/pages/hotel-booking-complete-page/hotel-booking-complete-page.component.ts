import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
//store
import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-hotel-booking-complete-page',
    templateUrl: './hotel-booking-complete-page.component.html',
    styleUrls: ['./hotel-booking-complete-page.component.scss']
})
export class HotelBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    headerConfig: any;
    hotelBookingRs: any;
    hotelInfoSession: any;
    userInfo: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private bsModalService: BsModalService,
        private el: ElementRef,
        public jwtService: JwtService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.element = this.el.nativeElement;
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.style.background = '';

        this.headerInit();
        this.sessionInit();
        if (this.isBrowser) {
            this.loginInit();
        }
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    sessionInit() {
        const session = JSON.parse(sessionStorage.getItem('hotel-common'));
        if (!_.isEmpty(session.hotelSessionStorages.entities)) {
            this.hotelBookingRs = session.hotelSessionStorages.entities['hotel-booking-rs'].result;
            console.info('hotelBookingRs', this.hotelBookingRs);

            this.hotelInfoSession = session.hotelSessionStorages.entities['hotel-booking-infomation-rs'].result;
            console.info('hotelInfoSession', this.hotelInfoSession);

        }
    }

    commonUserInfoInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(commonUserInfoSelectors.getSelectId('commonUserInfo')), // 스토어 ID
                    takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev) => {
                        console.info('[commonUserInfoInit] >> ', ev);
                        if (ev) { // 변경 되이터
                            this.userInfo = ev['userInfo'];
                        }
                    }
                )
        );
    }


    /**
    * 페이지 초기화
    *
    */
    async pageInit() {
        console.info('[pageInit 페이지 초기화]');
        this.loadingBool = true;
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

    loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl).then(
            (e) => {
                console.info('[jwtService.loginGuardInit > ok]', e);
                if (e) {
                    this.commonUserInfoInit();
                    this.pageInit();
                }
            },
            (err) => {
                console.info('[jwtService.loginGuardInit > err]', err);
            });
    }



    myBookingListLink() {
        const rqInfo =
        {
            'selectCode': '2',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.userInfo.user.userNo,
                'bookingItemCode': this.hotelBookingRs.bookingItems[0].bookingItemCode,
                'excludeCancelYn': false
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        this.router.navigate([path]);
    }

    /**
     *
     * @param e
     */
    viewBookingDetails(e) {
        console.info('예약 상세보기 이동', e);

        const rq = {
            userNo: this.userInfo.user.userNo,
            bookingItemCode: this.hotelBookingRs.bookingItems[0].bookingItemCode
        };
        console.info('[데이터 rq]', rq);

        const qsStr = qs.stringify(rq);
        const path = '/hotel-booked-detail/' + qsStr;
        this.router.navigate([path]);

    }

}

