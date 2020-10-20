import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-recent-list-page',
    templateUrl: './my-recent-list-page.component.html',
    styleUrls: ['./my-recent-list-page.component.scss']
})
export class MyRecentListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    tabNo: any;
    foldingKey: boolean = false;
    rxAlive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private bsModalService: BsModalService,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();
        this.selectTab(0);
        // this.aaa();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    aaa() {
        const futureMonth = moment().add(3, 'months');
        const pastMonth = moment().subtract(3, 'months');
        console.log('futureMonth >>>', futureMonth.format('YYYY-MM-DD'));
        console.log('pastMonth >>>', pastMonth.format('YYYY.MM.DD (ddd)'));
    }

    hisBack() {
        history.back();
    }

    headerInit() {
        this.headerConfig = {
            title: '최근 본 상품',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }

    // selectFolding() {
    //   this.foldingKey = !this.foldingKey;
    // }

    // onTab0Click(e) {
    //   console.info('[전체 예약리스트]', e);
    //   const seltab = 'all-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab1Click(e) {
    //   console.info('[항공 예약리스트]', e);
    //   const seltab = 'flight-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab2Click(e) {
    //   console.info('[호텔 예약리스트]', e);
    //   const seltab = 'hotel-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab3Click(e) {
    //   console.info('[액티비티 예약리스트]', e);
    //   const seltab = 'activity-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab4Click(e) {
    //   console.info('[렌트카 예약리스트]', e);
    //   const seltab = 'rent-reservation-list';
    //   this.callReservation(seltab);
    // }

    // onTab5Click(e) {
    //   console.info('[묶음할일 예약리스트]', e);
    //   const seltab = 'airtel-reservation-list';
    //   this.callReservation(seltab);
    // }

    // callReservation(seltab) {
    // const rqInfo = {
    //   seltab: seltab
    //   // locationAccept: this.vm.locationAccept,
    //   // locationReturn: this.vm.locationReturn,
    //   // locationReturnBool: this.vm.locationReturnBool,
    //   // formDateStr: this.vm.formDateStr, // 인수 날짜
    //   // formTimeVal: this.vm.formTimeVal,
    //   // toDateStr: this.vm.toDateStr, // 반납 날짜
    //   // toTimeVal: this.vm.toTimeVal,
    //   // rq: rq
    // };

    // const base64Str = this.base64Svc.base64EncodingFun(rqInfo);
    // const path = '/mypage-reservation-list/' + seltab; //+ '/' + base64Str;
    // const extras = {
    //   relativeTo: this.route
    // };
    // console.log('path >>>>>', path);

    // this.router.navigate([path], extras);
    // }
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
