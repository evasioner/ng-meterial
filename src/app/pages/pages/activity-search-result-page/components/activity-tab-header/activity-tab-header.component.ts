import { Component, OnInit, OnDestroy, EventEmitter, Output, PLATFORM_ID, Inject } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as activitySearchResultPageSelectors from '@store/activity-search-result-page/activity-result-search/activity-result-search.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { SortOrderSet, SortOrder } from './models/activity-tab-header.model';

import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-tab-header',
    templateUrl: './activity-tab-header.component.html',
    styleUrls: ['./activity-tab-header.component.scss']
})
export class ActivityTabHeaderComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Output() public searchEvt: EventEmitter<any> = new EventEmitter();
    private subscriptionList: Subscription[];
    private dataModel: any;

    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private initialize(): void {
        this.dataModel = {};
        this.viewModel = {
            sortOrder: SortOrderSet
        };
        this.subscriptionInit();
    }

    /**
     * subscriptionInit
     * 구독 시작
     */
    private subscriptionInit(): void {
        this.subscriptionList = [
            combineLatest(
                this.store
                    .pipe(
                        select(activitySearchResultPageSelectors.getSelectId(ActivityStore.STORE_SEARCH_RESULT_RQ)),
                        distinctUntilChanged(
                            (before: any, now: any) => _.isEqual(before, now)
                        )
                    ),
                this.store
                    .pipe(
                        select(activitySearchResultPageSelectors.getSelectId(ActivityStore.STORE_SEARCH_RESULT_RS)),
                        distinctUntilChanged(
                            (before: any, now: any) => _.isEqual(before, now)
                        )
                    )
            )
                .subscribe(
                    ([resp1, resp2]: any) => {
                        if (resp1 && resp2) {
                            console.info('tab-header 리스트를 알려 다오오오옹 : ', resp1, resp2);
                            this.dataModel.request = _.cloneDeep(resp1.result);
                            this.dataModel.result = _.cloneDeep(resp2.result);

                            if (this.dataModel.request && this.dataModel.result) {
                                this.viewModel.sortOrder.map(
                                    (item: SortOrder): void => {
                                        if (item.value === this.dataModel.result.sortOrder) {
                                            item.active = true;
                                        } else {
                                            item.active = false;
                                        }
                                    }
                                );
                            }
                        }

                    }
                )
        ];
    }

    private onSearch(index: number) {

        this.searchEvt.emit(
            { sortOrder: this.viewModel.sortOrder[index].value }
        );
    }

    /**
     * selectSortOrder
     * 사용자가 선택 한 정렬로 변경
     *
     * @param event
     * @param index
     */
    public selectSortOrder(event: MouseEvent, index: number): void {
        event && event.preventDefault();

        this.viewModel.sortOrder.map(
            (item: SortOrder, itemIndex: number): void => {
                item.active = false;

                if (itemIndex === index) {
                    item.active = true;
                }
            }
        );

        this.onSearch(index);
    }
}
