import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as commonUserInfoSelectors from '../../store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';

import { PageCodes } from '../../common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-wish-list-page',
    templateUrl: './my-wish-list-page.component.html',
    styleUrls: ['./my-wish-list-page.component.scss']
})
export class MyWishListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;

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
        public bsModalService: BsModalService,
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

    ngOnInit() {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = 'bg';
        if (this.isBrowser) {
            this.loginInit();
        }
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
                            this.userInfo = ev['userInfo'];
                            this.traveler = ev['traveler'];

                        }
                    }
                )
        );
    }

    /**
     * url 을통해 전달 받은데이터와 화면에서 사용하는 데이터를 모아 vm을 만든다.
     * 만든 데이터를 스토어에 저장한다.
     * 여기서 저장되는 시점은 url로 데이터를 전달 받았을때 이다.
     * api 통시을 하기전 화면초기화 상태를 만든다.
     *
     */
    vmInit() {

    }

    /**
     * 페이지 초기화 : api 통신으로 데이터를 가져옴
     * api를 통해 화면에 표시할 데이터를 가져온다.
     */
    pageInit() {
        this.commonUserInit();
        this.vmInit();

        this.headerInit();

        this.loadingBool = true;

        // const rq = this.vm.rq;

        //this.loadingBool = false;
        // this.loadingBar.start();

        // this.subscriptionList.push(
        // this.apiMypageService.POST_BOOKING_LIST(rq)
        //   .pipe(takeWhile(val => this.rxAlive))
        //   .subscribe(
        //     (res:any) => {
        //       this.apiDataInit(res);
        //     },
        //     err => console.log('HTTP Error', err),
        //     () => {
        //       console.log('POST_RENT_LIST completed.');
        //       this.loadingBool = true;
        //       this.loadingBar.complete();
        //     }
        // )
        //   );
    }

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

