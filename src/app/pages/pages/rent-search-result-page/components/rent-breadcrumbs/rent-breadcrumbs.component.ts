import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as rentSearchResultPageSelectors from '@store/rent-search-result-page/rent-search-result-page/rent-search-result-page.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { RentSearchResultPageStoreIds } from '../../enums/rent-search-result-page-store-ids.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-breadcrumbs',
    templateUrl: './rent-breadcrumbs.component.html',
    styleUrls: ['./rent-breadcrumbs.component.scss']
})
export class RentBreadcrumbsComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscriptionList: Subscription[];

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
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private initialize(): void {
        this.dataModel = {};
        this.viewModel = {};
        this.subscriptionInit();
    }

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
                            this.makeViewModel();
                        }
                    }
                )
        ];
    }

    private dataModelInit(newData: any): void {
        this.dataModel.resolveData = _.cloneDeep(newData.result);
    }

    private makeViewModel(): void {
        this.viewModel = {
            locationName: this.dataModel.resolveData.locationAccept.name,
            fromDate: this.dataModel.resolveData.formDateStr,
            fromTime: this.dataModel.resolveData.formTimeVal,
            toDate: this.dataModel.resolveData.toDateStr,
            toTime: this.dataModel.resolveData.toTimeVal
        };
    }
}
