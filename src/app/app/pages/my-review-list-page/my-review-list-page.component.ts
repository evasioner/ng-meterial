import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertMyMileage } from 'src/app/store/my-mileage/my-mileage/my-mileage.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { ReviewWriteStarComponent } from './modal-components/review-write-star/review-write-star.component';
import { ReviewPhotoListComponent } from './modal-components/review-photo-list/review-photo-list.component';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-my-review-list-page',
    templateUrl: './my-review-list-page.component.html',
    styleUrls: ['./my-review-list-page.component.scss']
})
export class MyReviewListPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;

    ctx: any = this;
    headerType: any;
    headerConfig: any;

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    resolveData: any;
    tabNo: any = 0;
    turmNo: any = 0;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        public bsModalService: BsModalService,
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
        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        //     .map((o) => {
                        //         return Number(o);
                        //     });
                        // console.info('Number(userNo)>>', userNo);
                        // this.resolveData.condition.userNo = userNo;
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.pageInit(data.resolveData);
                    }
                )
        );
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
        this.rxAlive = false;
        this.closeAllModals();
    }
    private initialize() {
        this.dataModel = {};
        this.viewModel = {};
        this.subscriptionList = [];

        this.headerInit();
    }
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * 페이지 초기화
     *  api 호출 (
     * @param resolveData
     */
    async pageInit(resolveData) {
        this.resolveData = _.cloneDeep(resolveData);
        console.log(this.resolveData, 'this.resolveData');
        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: 1
            }
        };
        this.getReviewList(rqInfo);

        // ---------[헤더 초기화]
        this.headerInit();

    }
    /**
     * 헤더 초기화
     */
    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '이용후기',
            key: null
        };
    }

    getReviewList(rq) {
        this.subscriptionList.push(
            this.apiMypageService.POST_REVIEW_LIST(rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.dataModel.response = _.cloneDeep(res.result);
                            this.dataModel.transactionSetId = res.transactionSetId;
                            this.upsertOne({
                                id: 'my-review-list',
                                result: this.dataModel.response
                            });
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );

    }
    /**
   * 데이터 추가 | 업데이트
   * action > key 값을 확인.
   */
    upsertOne($obj) {
        this.store.dispatch(upsertMyMileage({
            myMileage: $obj
        }));
    }

    selectTab(no) {
        this.tabNo = no;
    }

    selectTurm(no) {
        this.turmNo = no;
    }
    reviewWrite() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(ReviewWriteStarComponent, { initialState, ...configInfo });
    }
    addPhotoClick() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(ReviewPhotoListComponent, { initialState, ...configInfo });
    }
}
