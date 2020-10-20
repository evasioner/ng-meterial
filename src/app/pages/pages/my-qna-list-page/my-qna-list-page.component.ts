import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { BasePageComponent } from '../base-page/base-page.component';

import { MyModalQnaViewComponent } from './modal-components/my-modal-qna-view/my-modal-qna-view.component';
import { MyModalQnaWriteComponent } from './modal-components/my-modal-qna-write/my-modal-qna-write.component';

@Component({
    selector: 'app-my-qna-list-page',
    templateUrl: './my-qna-list-page.component.html',
    styleUrls: ['./my-qna-list-page.component.scss']
})
export class MyQnaListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    tabNo: any;
    headerType: any;
    headerConfig: any;

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;
    private dataModel: any;
    public viewModel: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private bsModalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private bsModalSvc: BsModalService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
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
                        this.pageInit();
                    }
                )
        );
        this.selectTab(0);
        this.headerInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
        this.closeAllModals();
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerConfig = {
            title: '고객문의',
            key: null
        };
    }

    selectTab(no) {
        this.tabNo = no;
    }

    getApiList(rq) {
        this.subscriptionList.push(
            this.apiMypageService.POST_MYPAGE_QNA(rq)
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.dataModel.response = _.cloneDeep(resp.result);
                            this.dataModel.transactionSetId = resp.transactionSetId;
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );

    }
    /**
    * 페이지 초기화
    *  api 호출 (
    * @param resolveData
    */
    pageInit() {

        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                postCategoryCode: 1,
                userNo: 1,
                postTitle: 'title',
                attachedFiles: [{
                    'attachedFileName': 'name',
                    'attachedFileUrl': 'url'
                }
                ]

            }
        };
        this.getApiList(rqInfo);
    }
    //
    // 문의하기
    //
    clickDetail() {

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        const initialState = {
        };

        this.bsModalSvc.show(MyModalQnaViewComponent, { initialState, ...configInfo });
    }
    clickWrite() {
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        const initialState = {
        };

        this.bsModalSvc.show(MyModalQnaWriteComponent, { initialState, ...configInfo });
    }



    //
    // 마이페이지 목록
    //
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
