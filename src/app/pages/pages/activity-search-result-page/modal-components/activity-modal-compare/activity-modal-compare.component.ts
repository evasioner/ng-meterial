import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import * as activitySearchResultPageCompareListSelectors from '@/app/store/activity-search-result-page/activity-search-result-page-compare-list/activity-search-result-page-compare-list.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-modal-compare',
    templateUrl: './activity-modal-compare.component.html',
    styleUrls: ['./activity-modal-compare.component.scss']
})
export class ActivityModalCompareComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private pageId: string;

    public compareList: Array<any>;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public bsModalRef: BsModalRef,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.compareListInit();
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

    /**
     * 비교하기 리스트 초기화
     */
    private compareListInit() {
        this.pageId = '';
        this.compareList = [];
        this.subscriptionList = [
            this.store
                .pipe(
                    select(activitySearchResultPageCompareListSelectors.getSelectId(ActivityStore.STORE_COMPARE_LIST))
                )
                .subscribe(
                    (resp2: any) => {
                        if (resp2) {
                            this.compareList = _.cloneDeep(resp2.result).map(
                                (item: any) => {
                                    item.instantConfirmType = item.instantConfirmYn ? '즉시 확정' : '-';
                                    return item;
                                }
                            );
                        } else {
                            this.compareList = [];
                        }
                    }
                )
        ];
    }

    private modalClose() {
        this.bsModalRef.hide();
    }

    private setStoreData(id: string, option: any) {
        // 어디로 보낼지는 생각해봅시다
    }

    public onCloseClick(event: MouseEvent) {
        event && event.preventDefault();

        this.modalClose();
    }

    public onSelectItemClick(event: any, item: any) {
        event && event.preventDefault();

        this.setStoreData('activity-selected-item', item);
        this.modalClose();
    }
}
