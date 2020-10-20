import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as rentSearchResultPageSelectors from '@store/rent-search-result-page/rent-search-result-page/rent-search-result-page.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { SortOrderSet, ViewModel, Sort } from './models/rent-tab-header.model';

import { RentSearchResultPageStoreIds } from '../../enums/rent-search-result-page-store-ids.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-tab-header',
    templateUrl: './rent-tab-header.component.html',
    styleUrls: ['./rent-tab-header.component.scss']
})
export class RentTabHeaderComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Output() private searchEvt: EventEmitter<any> = new EventEmitter();
    private subscriptionList: Subscription[];
    private dataModel: any;

    public viewModel: ViewModel;

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
                        select(
                            rentSearchResultPageSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_RESOLVE_DATA)
                        )
                    ),
                this.store
                    .pipe(
                        select(
                            rentSearchResultPageSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_SEARCH_RESULT_INFO)
                        )
                    )
            )
                .subscribe(
                    ([resp1, resp2]) => {
                        if (resp1) {
                            this.dataModelInit(resp1);
                        }

                        if (resp2) {
                            this.dataModelInit(resp2);

                            if (_.has(this.dataModel.resolveData.rq.condition, 'sortOrder')) {
                                this.viewModel.sortOrder.map(
                                    (item: Sort): void => {
                                        if (item.value === this.dataModel.resolveData.rq.condition.sortOrder) {
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

    private dataModelInit(newData: any) {
        this.dataModel.resolveData = _.cloneDeep(newData.result);
    }

    private onSearch(index: number) {
        console.log(this.dataModel.resolveData);

        const resolveData = _.cloneDeep(this.dataModel.resolveData);
        resolveData.rq.transactionSetId = this.dataModel.resolveData.rs.transactionSetId;
        resolveData.rq.condition.sortOrder = this.viewModel.sortOrder[index].value;
        resolveData.rq.condition.limits = [0, 12];
        const newRequest = {
            locationAccept: resolveData.locationAccept,
            locationReturn: resolveData.locationReturn,
            locationReturnBool: resolveData.locationReturnBool,

            formDateStr: resolveData.formDateStr,
            formTimeList: resolveData.formTimeList,
            formTimeVal: resolveData.formTimeVal,

            toDateStr: resolveData.toDateStr,
            toTimeList: resolveData.toTimeList,
            toTimeVal: resolveData.toTimeVal,

            driverBirthday: resolveData.driverBirthday,

            rq: resolveData.rq
        };

        this.searchEvt.emit({
            rq: newRequest,
            url: 'rent-search-result'
        });
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
            (item: Sort, itemIndex: number): void => {
                item.active = false;

                if (itemIndex === index) {
                    item.active = true;
                }
            }
        );

        this.onSearch(index);
    }
}
