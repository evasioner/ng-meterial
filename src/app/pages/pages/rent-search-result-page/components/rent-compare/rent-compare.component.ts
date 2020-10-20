import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store, select } from '@ngrx/store';

import * as rentUiStateSelectors from '@store/rent-search-result-page/rent-search-result-page-ui-state/rent-search-result-page-ui-state.selectors';
import * as rentCompareListSelectors from '@store/rent-search-result-page/rent-search-result-page-compare-list/rent-search-result-page-compare-list.selectors';

import { upsertRentSearchResultPageCompareList } from '@/app/store/rent-search-result-page/rent-search-result-page-compare-list/rent-search-result-page-compare-list.actions';

import { BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { RentSearchResultPageStoreIds } from '../../enums/rent-search-result-page-store-ids.enum';
import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';
import { SearchResultListState } from '@/app/common-source/enums/search-result-list-state.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { RentModalCompareComponent } from '../../modal-components/rent-modal-compare/rent-modal-compare.component';

@Component({
    selector: 'app-rent-compare',
    templateUrl: './rent-compare.component.html',
    styleUrls: ['./rent-compare.component.scss']
})
export class RentCompareComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscriptionList: Subscription[];

    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private bsModalService: BsModalService,
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
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private initialize() {
        this.dataModel = {};
        this.viewModel = {
            viewFlag: true,
            uiState: {
                state: SearchResultPageState.IS_DEFAULT,
                listState: SearchResultListState.IS_LIST,
                btnCompareToggleBool: false
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

    private subscriptionInit() {
        this.subscriptionList = [
            this.store
                .pipe(
                    select(
                        rentUiStateSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_TAB_BODY_TOP)
                    )
                )
                .subscribe(
                    (resp1) => {
                        if (resp1) {
                            this.dataModelInit('state', resp1.result);
                            this.setState();
                        }
                    }
                ),
            this.store
                .pipe(
                    select(rentCompareListSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_COMPARE_LIST))
                )
                .subscribe(
                    (resp2) => {
                        if (resp2) {
                            this.dataModelInit('compareList', resp2.result);
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

    private makeCompare() {
        this.viewModel.compareCount = this.dataModel.compareList.length;

        if (this.dataModel.compareList.length > 0) {
            this.viewModel.compareList = _.cloneDeep(this.dataModel.compareList);
            this.viewModel.compareList = new Array(3).fill(null).map(
                (value: any, arrayIndex: number) => {
                    if (
                        this.viewModel.compareList[arrayIndex] &&
                        this.viewModel.compareList[arrayIndex].vehicleIndex
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

        this.store.dispatch(
            upsertRentSearchResultPageCompareList({
                rentSearchResultPageCompareList: {
                    id: RentSearchResultPageStoreIds.RENT_COMPARE_LIST,
                    result: _.cloneDeep(newData)
                }
            })
        );
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

    public imgLoadError(event: any, typeCode: string) {
        console.info('[imgLoadError > typeCode]', typeCode);
        event.target.src = `/assets/images/car/${typeCode}.JPG`;
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

    public onAllDelete(event: any) {
        event && event.preventDefault();

        this.viewModel.compareCount = 0;
        this.viewModel.compareList = [
            { checked: false },
            { checked: false },
            { checked: false }
        ];

        this.compareUpdate([]);
    }

    public onCompare(event: any) {
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

        this.bsModalService.show(RentModalCompareComponent, { initialState, ...configInfo });
    }

    public trackByVehicleIndex(item: any): number {
        return item.vehicleIndex;
    }
}
