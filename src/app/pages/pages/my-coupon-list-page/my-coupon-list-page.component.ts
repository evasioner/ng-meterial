import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-coupon-list-page',
    templateUrl: './my-coupon-list-page.component.html',
    styleUrls: ['./my-coupon-list-page.component.scss']
})
export class MyCouponListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    tabNo: any;
    headerConfig: any;

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
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
        this.selectTab(0);
        this.headerInit();
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


    hisBack() {
        history.back();
    }

    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerConfig = {
            title: '쿠폰함',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
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
        // const path = '/my-review-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
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
