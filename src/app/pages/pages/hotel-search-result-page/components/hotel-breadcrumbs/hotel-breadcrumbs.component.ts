import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as hotelSearchResultPageSelectors from '@store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { HotelResultVm } from 'src/app/pages/hotel-search-result-page/insterfaces/hote-result-vm';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-breadcrumbs',
    templateUrl: './hotel-breadcrumbs.component.html',
    styleUrls: ['./hotel-breadcrumbs.component.scss']
})
export class HotelBreadcrumbsComponent extends BaseChildComponent implements OnInit, OnDestroy {
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;

    vm: HotelResultVm;
    resolveData: any = null;
    searchResultInfo: any = null;

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
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.observableInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    observableInit() {
        this.hotelResolveData$ = this.store.pipe(
            select(hotelSearchResultPageSelectors.getSelectId('hotel-resolve-data'))
        );

        this.hotelSearchResultInfo$ = this.store.pipe(
            select(hotelSearchResultPageSelectors.getSelectId('hotel-search-result-info'))
        );

    }

    subscribeInit() {
        this.subscriptionList.push(
            this.hotelResolveData$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev) => {
                        if (ev) {
                            console.info('[hotel-breadcrumbs > hotelResolveData$]', ev);
                            this.resolveData = ev.result;
                            this.resolveDataInit();
                            this.loadingBool = true;
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.hotelSearchResultInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[hotel-breadcrumbs > hotelSearchResultInfo$]', ev);
                            this.searchResultInfo = ev.result;
                            this.searchResultInfoInit();
                            this.apiLoadingBool = true;
                        }
                    }
                )
        );
    }

    resolveDataInit() {
        this.vm = { ...this.resolveData };
    }

    searchResultInfoInit() {
        this.vm = { ...this.searchResultInfo };
    }
}
