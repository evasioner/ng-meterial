import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertActivitySearchResultPageCompareList } from '@/app/store/activity-search-result-page/activity-search-result-page-compare-list/activity-search-result-page-compare-list.actions';

import * as activitySearchResultPageUiStateSelectors from '@/app/store/activity-search-result-page/activity-search-result-page-ui-state/activity-search-result-page-ui-state.selectors';
import * as activitySearchResultPageCompareListSelectors from '@/app/store/activity-search-result-page/activity-search-result-page-compare-list/activity-search-result-page-compare-list.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';
import { SearchResultListState } from '@/app/common-source/enums/search-result-list-state.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { ActivityModalCompareComponent } from '../../modal-components/activity-modal-compare/activity-modal-compare.component';

@Component({
    selector: 'app-activity-compare',
    templateUrl: './activity-compare.component.html',
    styleUrls: ['./activity-compare.component.scss']
})
export class ActivityCompareComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscriptionList: Subscription[];

    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        private store: Store<any>,
        private bsModalService: BsModalService,
    ) {
        super(platformId);

        this.initialize();
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

    private initialize() {
        this.dataModel = {};
        this.viewModel = {
            viewFlag: false,
            uiState: {
                state: SearchResultPageState.IS_DEFAULT,
                listState: SearchResultListState.IS_LIST
            },
            compareEnums: SearchResultPageState,
            listEnums: SearchResultListState,
            compareList: [
                { checked: false },
                { checked: false },
                { checked: false }
            ],
            compareCount: 0
        };
        this.subscriptionInit();
    }

    /**
      * subscriptionInit
      * 구독 시작
      */
    private subscriptionInit(): void {
        this.subscriptionList = [
            this.store
                .pipe(
                    select(activitySearchResultPageUiStateSelectors.getSelectId(ActivityStore.STORE_TAB_BODY)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp1: any) => {
                        if (resp1) {
                            console.log('왜 안 오냐? : ', resp1);
                            this.dataModelInit('state', resp1.result);
                            this.setState();
                        }
                    }
                ),
            this.store
                .pipe(
                    select(activitySearchResultPageCompareListSelectors.getSelectId(ActivityStore.STORE_COMPARE_LIST))
                )
                .subscribe(
                    (resp2: any) => {
                        if (resp2) {
                            this.dataModelInit('compareList', resp2.result);
                            console.info('[activity-compare compareListInit]', this.dataModel.compareList);
                            this.makeCompare();
                        } else {
                            this.dataModel.compareList = [];
                        }
                    }
                )
        ];
    }

    private dataModelInit(modelKey: string, newData: any): void {
        this.dataModel[modelKey] = _.cloneDeep(newData);
    }

    private setState() {
        this.viewModel.viewFlag = true;
        this.viewModel.uiState = _.cloneDeep(this.dataModel.state);
    }

    private openAlert(title: string) {
        // ngx-bootstrap config
        const initialState = {
            titleTxt: title,
            closeObj: {
                fun: () => { }
            },
            okObj: {
                fun: () => { }
            }
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false,
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    private makeCompare() {
        this.viewModel.compareCount = this.dataModel.compareList.length;

        if (this.dataModel.compareList.length > 0) {
            this.viewModel.compareList = _.cloneDeep(this.dataModel.compareList);

            this.viewModel.compareList = new Array(3).fill(null).map(
                (value: any, arrayIndex: number) => {
                    if (
                        this.viewModel.compareList[arrayIndex] &&
                        this.viewModel.compareList[arrayIndex].activityIndex
                    ) {
                        return this.viewModel.compareList[arrayIndex];
                    } else {
                        return { checked: false };
                    }
                }
            );
        } else {
            this.viewModel.compareCount = 0;
            this.viewModel.compareList = [
                { checked: false },
                { checked: false },
                { checked: false }
            ];
        }
    }

    private compareUpdate(newData: Array<any>) {
        console.log('[activity-compare compareUpdate] ', newData);

        this.store.dispatch(
            upsertActivitySearchResultPageCompareList({
                activitySearchResultPageCompareList: {
                    id: ActivityStore.STORE_COMPARE_LIST,
                    result: _.cloneDeep(newData)
                }
            })
        );
    }

    public onToggle(event: MouseEvent) {
        event && event.preventDefault();

        this.viewModel.viewFlag = !this.viewModel.viewFlag;
    }

    public onDelete(event: MouseEvent, index: number) {
        event && event.preventDefault();

        this.viewModel.compareCount = 0;
        const newArray: Array<any> = this.dataModel.compareList.filter(
            (item: any, compareIndex: number) => {
                if (compareIndex !== index) {
                    this.viewModel.compareCount++;
                    return item;
                }
            }
        );

        this.dataModel.compareList = [];
        new Array(3).fill(null).map(
            (item: any, index: number) => {
                let newItem: any = {};

                if (!newArray[index]) {
                    newItem = { checked: false };
                } else {
                    newItem = newArray[index];
                }
                this.viewModel.compareList.push(newItem);
            }
        );
        this.compareUpdate(newArray);
    }

    public onAllDelete(event: MouseEvent) {
        event && event.preventDefault();

        this.viewModel.compareCount = 0;
        this.viewModel.compareList = [
            { checked: false },
            { checked: false },
            { checked: false }
        ];

        this.compareUpdate([]);
    }

    public onCompare(event: MouseEvent) {
        event && event.preventDefault();

        if (this.viewModel.compareCount < 2) {
            return this.openAlert('비교할 대상을 선택하시기 바랍니다.');
        }

        const initialState = {};

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(ActivityModalCompareComponent, { initialState, ...configInfo });
    }

    public trackByActivityIndex(index: number, item: any): number {
        return item.activityIndex;
    }

}
