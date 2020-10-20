import { Component, EventEmitter, Inject, OnInit, PLATFORM_ID, Output, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertHotelSearchResultPage } from '@store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.actions';

import * as hotelSearchResultPageSelectors from '@store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { HotelResultVm } from '@app/pages/hotel-search-result-page/insterfaces/hote-result-vm';

import { BaseChildComponent } from '@app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-tab-header',
    templateUrl: './hotel-tab-header.component.html',
    styleUrls: ['./hotel-tab-header.component.scss']
})
export class HotelTabHeaderComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Output() searchEvt: EventEmitter<any> = new EventEmitter();
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;

    vm: HotelResultVm;
    hotelSearchTrd: any;

    resolveData: any = null;
    searchResultInfo: any = null;

    sortOrderData: any = [
        {
            txt: '추천순',
            val: 'Recommend',
            active: false
        },
        {
            txt: '높은 등급 순',
            val: 'StarRatingHighest',
            active: false
        },
        {
            txt: '낮은 등급 순',
            val: 'StarRatingLowest',
            active: false
        },
        {
            txt: '높은 가격 순',
            val: 'AmountHighest',
            active: false
        },
        {
            txt: '낮은 가격 순',
            val: 'AmountLowest',
            active: false
        }
    ];

    selSortOrder: object;

    ctx: any = this;

    hotelResolveData$: Observable<any>;
    hoteltResolveData$: Observable<any>;
    hotelSearchResultInfo$: Observable<any>;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService
    ) {
        super(platformId);
        this.subscribeInit();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    subscribeInit() {
        this.subscriptionList = [
            this.store
                .pipe(
                    select(hotelSearchResultPageSelectors.getSelectId('hotel-resolve-data')),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[hotel-tab-header > hotelResolveData$]', ev);
                            this.resolveData = ev.result;
                            this.resolveDataInit();
                            this.loadingBool = true;
                        }
                    }),

            this.store
                .pipe(
                    select(hotelSearchResultPageSelectors.getSelectId('hotel-search-result-info')),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[hotel-tab-header > hotelSearchResultInfo$]', ev);
                            this.searchResultInfo = ev.result;
                            this.searchResultInfoInit();

                            if (_.has(this.searchResultInfo, 'sortOrder')) {
                                _.forEach(this.sortOrderData, (item, idx) => {
                                    if (item.val === this.searchResultInfo.sortOrder) {
                                        item.active = true;
                                    }
                                });
                            } else {
                                this.sortOrderData[0].active = true;
                            }

                            this.apiLoadingBool = true;
                        }
                    })
        ];
    }

    resolveDataInit() {
        this.vm = { ...this.resolveData };
    }

    searchResultInfoInit() {
        this.vm = { ...this.searchResultInfo };
    }

    /**
    * 데이터 추가 | 업데이트
    * action > key 값을 확인.
    */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelSearchResultPage({
            hotelSearchResultPage: $obj
        }));
    }

    vmUpdate($rq) {
        this.upsertOne({
            id: 'hotel-search-result-info',
            result: $rq
        });
    }

    selectSortOrder($selIdx) {
        _.forEach(this.sortOrderData, (item, idx) => {
            if (idx === $selIdx) {
                item.active = true;
            } else {
                item.active = false;
            }
        });
        this.onSearch(this.sortOrderData[$selIdx].val);
    }

    onSearch($sortOrder) {
        const vm = _.cloneDeep(this.vm);
        vm['hotelSearchTrd'] = this.vm.rs.transactionSetId;
        vm['sortOrder'] = $sortOrder;
        vm['limits'] = [0, 10];

        console.info('onSearch', vm);
        this.vmUpdate(vm);
        this.searchEvt.emit({
            rq: vm,
            url: 'hotel-search-result'
        });
    }
}

