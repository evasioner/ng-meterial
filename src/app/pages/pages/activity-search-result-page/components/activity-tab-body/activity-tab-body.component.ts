import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertActivitySearchResultPageUiState } from '@/app/store/activity-search-result-page/activity-search-result-page-ui-state/activity-search-result-page-ui-state.actions';
import { upsertActivitySearchResultPageCompareList } from '@/app/store/activity-search-result-page/activity-search-result-page-compare-list/activity-search-result-page-compare-list.actions';

import * as activitySearchResultPageUiStateSelectors from '@/app/store/activity-search-result-page/activity-search-result-page-ui-state/activity-search-result-page-ui-state.selectors';
import * as activitySearchResultPageSelectors from '@store/activity-search-result-page/activity-result-search/activity-result-search.selectors';
import * as activitySearchResultPageCompareListSelectors from '@/app/store/activity-search-result-page/activity-search-result-page-compare-list/activity-search-result-page-compare-list.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { CompareMenuSet, ListMenuSet, PaginationSet } from './models/activity-tab-body.model';

import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';
import { SearchResultListState } from '@/app/common-source/enums/search-result-list-state.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-tab-body',
    templateUrl: './activity-tab-body.component.html',
    styleUrls: ['./activity-tab-body.component.scss']
})
export class ActivityTabBodyComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Output() goPageEvt: EventEmitter<any> = new EventEmitter<any>();
    private dataModel: any;
    private subscriptionList: Subscription[];

    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(platformId);

        this.initialize();
        this.subscriptionInit();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private initialize(): void {
        this.dataModel = {
            compareList: []
        };
        this.viewModel = {
            pagination: PaginationSet,
            compareList: [],
            compareMenuList: CompareMenuSet,
            listMenuList: ListMenuSet,
            uiState: {
                state: SearchResultPageState.IS_DEFAULT,
                listState: SearchResultListState.IS_LIST
            },
            compareEnums: SearchResultPageState,
            listEnums: SearchResultListState,
        };
    }

    /**
     * subscriptionInit
     * 구독 시작
     */
    private subscriptionInit(): void {
        this.subscriptionList = [
            this.store
                .pipe(
                    select(activitySearchResultPageSelectors.getSelectId(ActivityStore.STORE_SEARCH_RESULT_RQ)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            console.info('tab-body 요청 : ', resp);
                            this.dataModel.request = _.cloneDeep(resp.result);
                            this.viewModel.pagination.totalItems = 0;
                        }
                    }
                ),
            this.store
                .pipe(
                    select(activitySearchResultPageSelectors.getSelectId(ActivityStore.STORE_SEARCH_RESULT_RS)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            this.dataModel.result = _.cloneDeep(resp.result);

                            if (this.dataModel.result) {
                                this.setViewModel();
                                this.setPagination();
                            }
                        }
                    }
                ),
            this.store
                .pipe(
                    select(activitySearchResultPageUiStateSelectors.getSelectId(ActivityStore.STORE_TAB_BODY)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            this.dataModel.state = _.cloneDeep(resp.result);
                            this.viewModel.uiState = _.cloneDeep(this.dataModel.state);
                        }
                    }
                ),
            this.store.select(
                activitySearchResultPageCompareListSelectors.getSelectId(ActivityStore.STORE_COMPARE_LIST)
            )
                .subscribe(
                    (resp2: any) => {
                        if (resp2) {
                            this.dataModel.compareList = _.cloneDeep(resp2.result);
                            console.info('[tab-body compareListInit]', this.dataModel.compareList);
                            this.compareChange();
                        }
                    }
                )
        ];
    }

    private setViewModel() {
        this.viewModel.activityList = this.dataModel.result.activities.map(
            (item: any) => {
                return { ...item, ...{ checked: false } };
            }
        );
        this.compareChange();
    }

    private setPagination() {
        this.viewModel.pagination.currentPage = this.getLimitsToPageNum();
        this.viewModel.pagination.totalItems = _.chain(this.dataModel.result).get('count.totalItem').value();
    }

    private getLimitsToPageNum(): number {
        let curPage = 1;
        const temp = Math.floor(this.getRqLimits()[0] / this.viewModel.pagination.itemsPerPage);

        if (temp === 0) {
            curPage = 1;
        } else {
            curPage = temp + 1;
        }

        return curPage;
    }

    private getRqLimits(): Array<number> {
        return _.chain(this.dataModel.request).get('rq.condition.limits').value();
    }

    private makeLimits(data: any) {
        const maxPage = (this.viewModel.pagination.itemsPerPage * data.page);
        this.dataModel.request.rq.condition.limits = [
            (maxPage - this.viewModel.pagination.itemsPerPage), maxPage
        ];
    }

    private uiStateUpdate() {
        console.log('[activity-tab-body uiStateUpdate] ', this.viewModel.uiState);
        this.store.dispatch(
            upsertActivitySearchResultPageUiState({
                activitySearchResultPageUiState: {
                    id: ActivityStore.STORE_TAB_BODY,
                    result: _.cloneDeep(this.viewModel.uiState)
                }
            })
        );
    }

    private compareUpdate() {
        console.log('[activity-tab-body compareUpdate] ', this.viewModel.compareList);
        this.store.dispatch(
            upsertActivitySearchResultPageCompareList({
                activitySearchResultPageCompareList: {
                    id: ActivityStore.STORE_COMPARE_LIST,
                    result: _.cloneDeep(this.viewModel.compareList)
                }
            })
        );
    }

    private compareChange() {
        this.viewModel.compareList = _.cloneDeep(this.dataModel.compareList);
        this.viewModel.activityList.map(
            (activityItem: any): any => {
                activityItem.checked = false;
                this.viewModel.compareList.map(
                    (item: any): void => {
                        if (item.activityIndex === activityItem.activityIndex) {
                            activityItem.checked = true;
                        }
                    }
                );

                return activityItem;
            }
        );
    }

    public onCompare(event: MouseEvent, state: string) {
        event && event.preventDefault();

        if (state === SearchResultPageState.IS_DEFAULT) {
            this.viewModel.uiState.state = SearchResultPageState.IS_COMPARE;
        } else {
            this.viewModel.uiState.state = SearchResultPageState.IS_DEFAULT;
        }

        this.uiStateUpdate();

        this.dataModel.compareList = [];
        this.viewModel.compareList = [];
        this.viewModel.activityList = this.viewModel.activityList.map(
            (item: any) => {
                item.checked = false;
                return item;
            }
        );
    }

    /**
    * onChangeMode
    * 리스트, 이미지 모드 변경
    */
    public onChangeMode(event: MouseEvent, state: string) {
        event && event.preventDefault();

        this.viewModel.uiState.listState = state;
        this.uiStateUpdate();
    }

    /**
    * onCompareCheck
    * 비교 대상 선택
    *
    * @param event
    * @param index
    */
    public onCompareCheck(event: any, index: number) {
        event && event.preventDefault();

        this.viewModel.activityList[index].checked = event.target.checked;
        const activityIndex = this.viewModel.activityList[index].activityIndex;
        this.viewModel.compareList = _.cloneDeep(this.dataModel.compareList);

        if (event.target.checked) {
            if (this.dataModel.compareList.length < 3) {
                this.viewModel.compareList.push(this.viewModel.activityList[index]);
            } else {
                this.viewModel.activityList[index].checked = event.target.checked = false;
            }
        } else {
            const newArray: Array<any> = _.cloneDeep(this.viewModel.compareList);
            this.viewModel.compareList = newArray.filter(
                (item: any) => {
                    if (item.activityIndex && (item.activityIndex !== activityIndex)) {
                        return item;
                    }
                }
            );
        }

        this.compareUpdate();
    }

    /**
    * onPageChange
    * 페이지 변경
    *
    * @param data
    */
    public onPageChange(data: any) {
        if (data.page !== this.viewModel.pagination.currentPage) {
            this.makeLimits(data);
            this.uiStateUpdate();
            this.goPageEvt.emit(this.dataModel.request.rq);
        }
    }

    public onGoToMain(event: MouseEvent) {
        event && event.preventDefault();

        const path = '/activity-main';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    public onGoDetailPage(event: MouseEvent, item: any) {
        event && event.preventDefault();

        const activityOptionInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                transactionSetId: this.dataModel.transactionSetId,
                condition: {
                    activityCode: Number(item.activityCode)
                }
            },
            searchCityName: this.dataModel.request.searchCityName,
            searchCategoryName: this.dataModel.request.searchCategoryName
        };

        const qsStr = qs.stringify(activityOptionInfo);
        const path = ActivityCommon.PAGE_SEARCH_RESULT_DETAIL + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
}
