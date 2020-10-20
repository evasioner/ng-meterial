import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertActivityResultSearch } from '@/app/store/activity-search-result-page/activity-result-search/activity-result-search.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiActivityService } from '@/app/api/activity/api-activity.service';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { PageCodes } from '@/app/common-source/enums/page-codes.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-activity-search-result-page',
    templateUrl: './activity-search-result-page.component.html',
    styleUrls: ['./activity-search-result-page.component.scss']
})
export class ActivitySearchResultPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private activityListSubject$: Subject<any>;
    private dataModel: any;

    public errorFlag: boolean;
    public headerType: any;
    public headerConfig: any;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private bsModalService: BsModalService,
        private countdownTimerService: CountdownTimerService,
        private apiActivityService: ApiActivityService,
        private loadingBar: LoadingBarService,
        private store: Store<any>,
        private activityComServiceService: ActivityComServiceService,
        private location: Location,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.activityListSubject$ = new Subject<any>();
        this.initialize();
        this.subscribeInit();
    }

    ngOnInit() {
        super.ngOnInit();
        this.headerInit();
        this.timerInit();
    }

    ngOnDestroy() {
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
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

    private initialize() {
        this.dataModel = {};
        this.viewModel = {
            pageState: 'list',
            loadingBool: true,
            researchBool: false
        };
    }

    private subscribeInit() {
        this.subscriptionList = [
            // 검색
            this.activityListSubject$
                .pipe(
                    map(req => req),
                    debounceTime(300),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    ),
                    switchMap(
                        (req: any) => {
                            this.dataModel.rq = req;
                            this.upsertOne(
                                {
                                    id: ActivityStore.STORE_SEARCH_RESULT_RQ,
                                    result: _.cloneDeep(
                                        { rq: req, searchCategoryName: this.dataModel.searchCategoryName }
                                    )
                                }
                            );
                            return this.apiActivityService.POST_ACTIVITY_LIST(req)
                                .pipe(
                                    finalize(
                                        () => {
                                            this.viewModel.loadingBool = false;
                                            this.loadingBar.complete();
                                        }
                                    )
                                );
                        }
                    )
                )
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.dataModel.result = _.cloneDeep(resp.result);
                            this.dataModel.transactionSetId = resp.transactionSetId;

                            this.upsertOne(
                                {
                                    id: ActivityStore.STORE_SEARCH_RESULT_RS,
                                    result: _.cloneDeep(this.dataModel.result)
                                }
                            );

                            const encodingRq: any = this.activityComServiceService.beforeEncodingRq(_.cloneDeep({ rq: this.dataModel.rq }));
                            this.location.replaceState(
                                `${ActivityCommon.PAGE_SEARCH_RESULT}${encodeURIComponent(qs.stringify({ ...encodingRq, searchCategoryName: this.dataModel.searchCategoryName }))}`
                            );
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.errorFlag = true;
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                ),
            // url data
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('activity-search-result-page > route data -> ', data);

                        if (data) {
                            this.loadingBar.start();
                            this.viewModel.loadingBool = true;
                            this.dataModel = this.activityComServiceService.afterEncodingRq(_.cloneDeep(data.resolveData));

                            console.info('뭔데 ? ', this.dataModel.rq);
                            this.activityListSubject$.next(this.dataModel.rq);
                        }
                    }
                )
        ];
    }

    private timerInit() {
        const cdate = new Date();
        const timerVal = 10; // 타이머 분 설정
        cdate.setMinutes(cdate.getMinutes() + timerVal);
        this.countdownTimerService.startTimer(cdate);

        this.subscriptionList.push(
            // timer
            this.countdownTimerService.onTimerStatusChange
                .pipe(take(1))
                .subscribe(
                    (status: any) => {
                        if (status === 'END') {
                            console.info('[status]', status);
                            console.info('[timerValue]', this.countdownTimerService.timerValue);

                            this.timerAlert();
                        }
                    }
                )
        );
    }

    private headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    private timerAlert() {
        const initialState = {
            titleTxt: '검색 후 10분이 경과하여 재검색 합니다.',
            closeObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => this.router.navigateByUrl(this.route.snapshot['_routerState'].url));
                }
            },
            okObj: {
                fun: () => {
                    this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
                        () => this.router.navigateByUrl(this.route.snapshot['_routerState'].url));
                }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    /**
    * 데이터 추가 | 업데이트
    * action > key 값을 확인.
    */
    private upsertOne(obj: any) {
        this.store.dispatch(
            upsertActivityResultSearch({ activityResultSearch: obj })
        );
    }

    /**
    * 스크롤 이동
    * @param id
    */
    private moveScrollTo(id: string) {
        const doc = document.documentElement;
        const targetOffset = document.getElementById(id).getBoundingClientRect();
        const windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        const top = targetOffset.top + windowScrollTop - 54;
        window.scrollTo(0, top);
    }

    private setNewUrl(newRequest: any) {
        this.activityListSubject$.next(newRequest);
    }

    public openResearchEvt() {

        this.viewModel.researchBool = true;
    }

    /**
     * onSearchOutEvt
     * 필터, 정렬 데이터 받기
     *
     * @param data 각각의 데이터
     */
    public onSearchOutEvt(data: any) {
        const newRequest: any = _.cloneDeep(this.dataModel.rq);
        newRequest.condition.limits = [0, 12];
        newRequest.condition.filter = {};
        console.log('누가 잘 못 한걸까? : ', data);
        Object.entries(data).map(
            ([key, value]) => {
                switch (key) {
                    case 'amount':
                        if (data[key].lowestAmount && data[key].highestAmount) {
                            newRequest.condition.filter[key] = data[key];
                        }
                        break;

                    case 'duration':
                    case 'reviewAverage':
                        if (data[key].minimum && data[key].maximum) {
                            newRequest.condition.filter[key] = data[key];
                        }
                        break;

                    case 'guide':
                    case 'instantConfirmYn':
                        if (!_.isEmpty(data[key])) {
                            if (data[key].length === 1) {
                                newRequest.condition.filter[key] = (data[key][0] === 'true' ? true : false);
                            }
                        }
                        break;

                    case 'keyword':
                        if (!_.isEmpty(data[key])) {
                            newRequest.condition[key] = data[key];
                        }
                        break;

                    case 'sortOrder':
                        if (!_.isEmpty(data[key])) {
                            newRequest.condition[key] = data[key];
                        }
                        break;

                    default:
                        if (!_.isEmpty(data[key])) {
                            newRequest.condition.filter[key] = data[key].map(
                                (item: any) => {
                                    return { code: item };
                                }
                            );
                        }
                        break;
                }
            }
        );

        if (_.isEmpty(newRequest.condition.filter)) {
            newRequest.condition.filter = undefined;
        }

        newRequest.transactionSetId = this.dataModel.transactionSetId;
        this.setNewUrl(newRequest);
    }

    /**
     * goPageEvt
     * 페이지 이동
     *
     * @param data
     */
    public goPageEvt(data: any) {
        this.moveScrollTo('contents');
        data.transactionSetId = this.dataModel.transactionSetId;
        this.setNewUrl(data);
    }
}
