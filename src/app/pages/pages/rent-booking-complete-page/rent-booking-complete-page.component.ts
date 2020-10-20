import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
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
import { JwtService } from '../../common-source/services/jwt/jwt.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-rent-booking-complete-page',
    templateUrl: './rent-booking-complete-page.component.html',
    styleUrls: ['./rent-booking-complete-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RentBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    headerConfig: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;

    vm: any;

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
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = '';
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

    vmInit() {
        this.vm = {
            userInfo: this.resolveData.userInfo,
            vehicle: this.resolveData.vehicle,
            result: this.resolveData.result,
        };
        console.info('[vmInit]', this.vm);
    }

    commonUserInit() {
        this.subscriptionList.push(
            this.store.pipe(
                select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])),
                takeWhile(() => this.rxAlive)
            )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[commonUserInit]', ev);
                            console.info('[this.vm]', this.vm);
                            this.vm.userInfo = ev['userInfo'];
                            this.vm.traveler = ev['traveler'];
                            console.info('[this.vm 2]', this.vm);
                        }
                    }
                )
        );
    }

    /**
     * 라우트 초기화 : get으로 데이터 전달 받음
     */
    routeInit() {
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[routeInit]', data.resolveData);
                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.vmInit();
                        if (this.isBrowser) {
                            // this.commonUserInit();
                            this.pageInit();
                        }
                    }
                )
        );
    }


    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    pageInit() {
        this.headerInit();
        this.loadingBool = true;
        console.info('[pageInit]', this.loadingBool);
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
        const path = '/rent-booked-detail/' + qs.stringify(rqInfo);
        this.router.navigate([path]);

    }

    listLink() {
        const rqInfo =
        {
            'selectCode': '4',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                // "userNo": this.resolveData.userInfo.user.userNo,
                'userNo': null,
                // "bookingItemCode": this.resolveData.result.bookingItems[0].bookingItemCode,
                'excludeCancelYn': false
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        this.router.navigate([path]);
    }

    onBookedDetailClick() {
        const rq = {
            'userNo': this.resolveData.userInfo.user.userNo,
            'bookingItemCode': this.resolveData.result.bookingItems[0].bookingItemCode
        };
        const qsStr = qs.stringify(rq);
        const path = '/rent-booked-detail/' + qsStr;
        this.router.navigate([path], { relativeTo: this.route });
    }


}
