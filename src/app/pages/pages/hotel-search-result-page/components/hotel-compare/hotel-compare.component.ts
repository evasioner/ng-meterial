import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { HotelModalCompareComponent } from '../../modal-components/hotel-modal-compare/hotel-modal-compare.component';

import { HotelResultVm } from '../../insterfaces/hote-result-vm';
import { HotelUiState } from '../../insterfaces/hotel-ui-state';

//store
import * as hotelSearchResultPageSelectors
    from '../../../../store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.selectors';
import * as hotelCompareListSelectors
    from '../../../../store/hotel-search-result-page/hotel-search-result-page-compare-list/hotel-search-result-page-compare-list.selectors';
import * as hotelUiStateSelectors
    from '../../../../store/hotel-search-result-page/hotel-search-result-page-ui-state/hotel-search-result-page-ui-state.selectors';
import { upsertHotelSearchResultPageUiState } from 'src/app/store/hotel-search-result-page/hotel-search-result-page-ui-state/hotel-search-result-page-ui-state.actions';
import { clearHotelSearchResultPageCompareLists, deleteHotelSearchResultPageCompareList } from 'src/app/store/hotel-search-result-page/hotel-search-result-page-compare-list/hotel-search-result-page-compare-list.actions';
import { clearHotelSessionStorageCompareLists, deleteHotelSessionStorageCompareList } from 'src/app/store/hotel-common/hotel-session-storage-compare-list/hotel-session-storage-compare-list.actions';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-hotel-compare',
    templateUrl: './hotel-compare.component.html',
    styleUrls: ['./hotel-compare.component.scss']
})
export class HotelCompareComponent extends BaseChildComponent implements OnInit, OnDestroy {
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;

    vm: HotelResultVm;
    hotelTabBodyStateInfo: HotelUiState;

    compareList: any;
    defalutList: any;
    compareTgIdList: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        @Inject(DOCUMENT) private document: Document,
        private store: Store<any>,
        private bsModalService: BsModalService,
        public translateService: TranslateService
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        this.hotelResolveInit();
        this.hotelSearchResultInfoInit();
        this.compareListInit();
        this.hotelTabBodyTopInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    hotelResolveInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelSearchResultPageSelectors.getSelectId('hotel-resolve-data')),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[compare-wrap > hotelResolveInit]', ev);
                            this.vm = { ...ev.result };
                            this.loadingBool = true;
                        }
                    }
                )
        );
    }

    hotelSearchResultInfoInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelSearchResultPageSelectors.getSelectId('hotel-search-result-info')),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            console.info('[compare-wrap > hotelSearchResultInfoInit]', ev);
                            this.vm = { ...ev.result };
                            this.apiLoadingBool = true;
                        }
                    }
                )
        );
    }

    /**
     * ui 데이터 변경시점
     */
    hotelTabBodyTopInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelUiStateSelectors.getSelectId('hotel-tab-body-top')),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[compare-wrap > hotelTabBodyTopInit]', ev);

                        if (ev) {
                            this.hotelTabBodyStateInfo = { ...ev.result };
                        }
                    }
                )
        );
    }

    /**
     * 비교하기 리스트 초기화
     * compareList 데이터를 확인 후 compareTgIdList 만든다.
     */
    compareListInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelCompareListSelectors.selectAll),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[compare-wrap > compareListInit]', ev);
                        if (ev) {
                            this.compareList = ev;
                            const defalutNum = 3 - this.compareList.length;
                            this.defalutList = [];
                            this.defalutList = Array(defalutNum).fill(null).map((x, i) => i); // [0,1,2,3,4]
                            this.compareTgIdListInit();
                        } else {
                            this.compareList = [];
                            this.defalutList = [0, 1, 2];
                        }
                    }
                )
        );
    }

    /**
     * 선택된 항목 ID 리스트 : compareTgIdList 초기화
     */
    compareTgIdListInit() {
        console.info('[compareTgIdListInit > compareList]', this.compareList);
        this.compareTgIdList = _.map(this.compareList, ($item) => {
            return 'hotItemIndex_' + $item.id;
        });
        console.info('[compareTgIdListInit > compareTgIdList]', this.compareTgIdList);

    }

    /**
     * 리스트 엘리먼트 초기화
     */
    allListElInit() {
        console.info('[compareList]', this.compareList);
        console.info('[compareTgIdList]', this.compareTgIdList);

        const tgClass = 'hotel-list-item';
        const listEl = this.document.querySelectorAll(`.${tgClass}`);
        console.info('[listElInit > listEl]', listEl);
        _.forEach(listEl, ($itemEl) => {
            $itemEl.className = tgClass;
            const inputEl = $itemEl.querySelector(`input[type='checkbox']`);
            if (inputEl) {
                inputEl['checked'] = false;
            }
        });
    }

    uiStateUpdate() {
        this.store.dispatch(upsertHotelSearchResultPageUiState({
            hotelSearchResultPageUiState: {
                id: 'hotel-tab-body-top',
                result: this.hotelTabBodyStateInfo
            }
        }));
    }
    onAllDelete() {
        console.info('[onAllDelete]', this.document);
        this.allListElInit();

        //session clear
        this.store.dispatch(clearHotelSessionStorageCompareLists());

        //store clear
        this.store.dispatch(clearHotelSearchResultPageCompareLists());
    }

    onTgDelete(e, $idx) {
        console.info('[onTgDelete]', e, $idx);
        console.info('[compareList]', this.compareList);
        console.info('[compareTgIdList]', this.compareTgIdList);
        const tgId = this.compareTgIdList[$idx];
        const tgEl = this.document.querySelector(`[data-target="${tgId}"]`);
        const compareId = this.compareList[$idx].id;

        const tgClass = 'hotel-list-item';
        const listEl = this.document.querySelectorAll(`.${tgClass}`);

        if (tgEl) {
            tgEl.className = tgClass;
        }

        const inputEl = tgEl && tgEl.querySelector(`input[type='checkbox']`);
        if (inputEl) {
            inputEl['checked'] = false;
        }

        //session delete
        this.store.dispatch(deleteHotelSessionStorageCompareList({ id: compareId }));

        //store delete
        this.store.dispatch(deleteHotelSearchResultPageCompareList({ id: compareId }));

    }

    onCompare() {
        console.info('[onCompare]', this.compareList.length);
        if (this.compareList.length < 2) {
            console.error('2개 이상 선택해야 비교하기 진행');
            return;
        }

        // 모달 전달 데이터
        const initialState = {};

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(HotelModalCompareComponent, { initialState, ...configInfo });
    }

    onToggleClick() {
        if (this.hotelTabBodyStateInfo.btnCompareToggleBool) {
            this.hotelTabBodyStateInfo.btnCompareToggleBool = false;
        } else {
            this.hotelTabBodyStateInfo.btnCompareToggleBool = true;
        }
        this.uiStateUpdate();
    }


}

