import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { upsertRentSearchResultPage } from '@/app/store/rent-search-result-page/rent-search-result-page/rent-search-result-page.actions';
import { upsertRentSearchResultPageUiState } from '@/app/store/rent-search-result-page/rent-search-result-page-ui-state/rent-search-result-page-ui-state.actions';
import { upsertRentSearchResultPageCompareList } from '@/app/store/rent-search-result-page/rent-search-result-page-compare-list/rent-search-result-page-compare-list.actions';

import * as rentSearchResultPageSelectors from '@store/rent-search-result-page/rent-search-result-page/rent-search-result-page.selectors';
import * as rentUiStateSelectors from '@store/rent-search-result-page/rent-search-result-page-ui-state/rent-search-result-page-ui-state.selectors';
import * as rentCompareListSelectors from '@store/rent-search-result-page/rent-search-result-page-compare-list/rent-search-result-page-compare-list.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { ViewModel, ViewModelSet } from './models/rent-tab-body.model';

import { RentSearchResultPageStoreIds } from '../../enums/rent-search-result-page-store-ids.enum';
import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-tab-body',
    templateUrl: './rent-tab-body.component.html',
    styleUrls: ['./rent-tab-body.component.scss']
})
export class RentTabBodyComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Output() goPageEvt: EventEmitter<any> = new EventEmitter<any>();
    private dataModel: any;
    private subscriptionList: Subscription[];

    public viewModel: ViewModel;
    locationType: boolean = true;
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
        public translateService: TranslateService
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

    private initialize() {
        this.dataModel = {
            compareList: []
        };
        this.viewModel = ViewModelSet;
    }

    private subscriptionInit() {
        this.subscriptionList = [
            this.store
                .pipe(
                    select(rentSearchResultPageSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_RESOLVE_DATA)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp1) => {
                        if (resp1) {
                            this.dataModelInit('resolveData', resp1.result);
                        }
                    }
                ),
            this.store
                .pipe(
                    select(rentSearchResultPageSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_SEARCH_RESULT_INFO)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp2) => {
                        if (resp2) {
                            this.viewModel.apiComplete = true;
                            this.dataModelInit('resolveData', resp2.result);

                            this.setViewModel();
                            this.paginationInit();

                            if (resp2.result.locationAccept.countryCode === 'KR')
                                this.locationType = true;
                            else {
                                this.locationType = false;
                            }
                        }
                    }
                ),
            this.store
                .pipe(
                    select(rentUiStateSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_TAB_BODY_TOP)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp1: any) => {
                        if (resp1) {
                            this.dataModelInit('state', resp1.result);
                            this.viewChange();
                        }
                    }
                ),
            this.store
                .pipe(select(rentCompareListSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_COMPARE_LIST)),
                    distinctUntilChanged(
                        (before: any, now: any) => _.isEqual(before, now)
                    )
                )
                .subscribe(
                    (resp2) => {
                        if (resp2) {
                            this.dataModelInit('compareList', resp2.result);
                            this.compareChange();

                        }
                    }
                )
        ];
    }

    private dataModelInit(modelKey: string, newData: any): void {
        this.dataModel[modelKey] = _.cloneDeep(newData);

    }

    private setViewModel() {
        if (
            this.dataModel.resolveData.rs !== undefined &&
            this.dataModel.resolveData.rs !== null &&
            this.dataModel.resolveData.rs !== ''
        ) {
            this.viewModel.carList = this.dataModel.resolveData.rs.result.vehicles.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            );
        }

        this.compareChange();
    }

    private paginationInit() {
        this.viewModel.pagination.currentPage = this.getLimitsToPageNum();
        this.viewModel.pagination.totalItems = _.chain(this.dataModel.resolveData).get('rs.result.totalVehicleCount').value();

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
        return _.chain(this.dataModel.resolveData)
            .get('rq.condition.limits')
            .value();
    }

    private viewChange() {
        this.viewModel.uiState = _.cloneDeep(this.dataModel.state);
    }

    private compareChange() {
        this.viewModel.compareList = _.cloneDeep(this.dataModel.compareList);

        this.viewModel.carList.map(
            (carItem: any): any => {
                carItem.checked = false;
                this.viewModel.compareList.map(
                    (item: any): void => {
                        if (item.vehicleIndex === carItem.vehicleIndex) {
                            carItem.checked = true;
                        }
                    }
                );

                return carItem;
            }
        );
    }

    private makeLimits(data: any) {
        const maxPage = (this.viewModel.pagination.itemsPerPage * data.page);
        this.dataModel.resolveData.rq.condition.limits = [
            (maxPage - this.viewModel.pagination.itemsPerPage), maxPage
        ];
    }

    private resolveUpdate() {
        console.log('[tab-body resolveUpdate] ', this.dataModel.resolveData);
        this.store.dispatch(
            upsertRentSearchResultPage({
                rentSearchResultPage: {
                    id: RentSearchResultPageStoreIds.RENT_SEARCH_RESULT_INFO,
                    result: _.cloneDeep(this.dataModel.resolveData)
                }
            }));
    }

    private uiStateUpdate() {
        console.log('[tab-body uiStateUpdate] ', this.viewModel.uiState);
        this.store.dispatch(
            upsertRentSearchResultPageUiState({
                rentSearchResultPageUiState: {
                    id: RentSearchResultPageStoreIds.RENT_TAB_BODY_TOP,
                    result: _.cloneDeep(this.viewModel.uiState)
                }
            })
        );
    }

    private compareUpdate() {
        console.log('[tab-body compareUpdate] ', this.viewModel.compareList);
        this.store.dispatch(
            upsertRentSearchResultPageCompareList({
                rentSearchResultPageCompareList: {
                    id: RentSearchResultPageStoreIds.RENT_COMPARE_LIST,
                    result: _.cloneDeep(this.viewModel.compareList)
                }
            })
        );
    }

    /**
     * onCompare
     * 비교하기 실행
     *
     * @param event 마우스 이벤트
     * @param state 상태
     */
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
        this.viewModel.carList = this.viewModel.carList.map(
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

        this.viewModel.carList[index].checked = event.target.checked;
        const vehicleIndex = this.viewModel.carList[index].vehicleIndex;
        this.viewModel.compareList = _.cloneDeep(this.dataModel.compareList);

        if (event.target.checked) {
            if (this.dataModel.compareList.length < 3) {
                const locations = this.dataModel.resolveData.rs.result.locations;
                const pickupLocationInfo = _.find(locations, { 'locationCode': this.viewModel.carList[index].pickup.locationCode });
                this.viewModel.compareList.push({ ...this.viewModel.carList[index], pickupLocationInfo });
            } else {
                this.viewModel.carList[index].checked = event.target.checked = false;
            }
        } else {
            const newArray: Array<any> = _.cloneDeep(this.viewModel.compareList);
            this.viewModel.compareList = newArray.filter(
                (item: any) => {
                    if (item.vehicleIndex && (item.vehicleIndex !== vehicleIndex)) {
                        return item;
                    }
                }
            );
        }

        this.compareUpdate();
    }

    /**
     *
     * @param event
     * @param item
     */
    public onItemClick(event: MouseEvent, item: any) {
        event && event.preventDefault();

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                pickup: {
                    cityCodeIata: item.pickup.cityCodeIata,
                    locationCode: item.pickup.locationCode,
                    datetime: item.pickup.datetime
                },
                return: {
                    cityCodeIata: item.return.cityCodeIata,
                    locationCode: item.return.locationCode,
                    datetime: item.return.datetime
                },
                vehicleIndex: item.vehicleIndex,
                accessLevel: item.accessLevel,
                vehicleVendorCode: item.vehicleVendorCode,
                sippCode: item.sippCode,
                vendorCurrencyCode: item.vendorCurrencyCode,
                baseRateTypeCode: item.baseRateTypeCode,
                vendorAmountSum: item.vendorAmountSum,
                rateIdentifier: item.rateIdentifier,
                rateCategoryCode: item.rateCategoryCode,
                fareTypeCode: item.fareTypeCode,
                vehicleTypeOwner: item.vehicleTypeOwner
            }

        };

        const resolveDataRqCondition = this.dataModel.resolveData.rq.condition;

        const listFilterRq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                pickupCityCodeIata: resolveDataRqCondition.pickupCityCodeIata,
                pickupDatetime: resolveDataRqCondition.pickupDatetime,
                returnCityCodeIata: resolveDataRqCondition.returnCityCodeIata,
                returnDatetime: resolveDataRqCondition.returnDatetime,
                driverBirthday: resolveDataRqCondition.driverBirthday,
                limits: [0, 10],
                sortOrder: resolveDataRqCondition.sortOrder,
                filter: {
                    vehicleIndex: item.vehicleIndex
                }
            },
            transactionSetId: this.dataModel.resolveData.rs.transactionSetId

        };

        const rqInfo = {
            listFilterRq: listFilterRq,
            rq: rq
        };

        console.info('[vm]', this.dataModel.resolveData);
        console.info('[데이터 rqInfo]', rqInfo);

        const qsStr = qs.stringify(rqInfo);
        const path = '/rent-booking-information/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
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
            this.dataModel.resolveData.rq.transactionSetId = this.dataModel.resolveData.rs.transactionSetId;
            this.dataModel.resolveData.rs = null;
            this.resolveUpdate();
            this.uiStateUpdate();
            this.goPageEvt.emit(this.dataModel.resolveData);
        }
    }

    public onGoToMain(event: MouseEvent) {
        event && event.preventDefault();

        const path = '/rent-main';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    /**
     * imgLoadError
     * 이미지 로드 에러 시 이미지 변경
     *
     * @param event
     */
    public imgLoadError(event: any, typeCode: string) {
        event && event.preventDefault();
        console.info('[imgLoadError > typeCode]', typeCode);
        event.target.src = `/assets/images/car/${typeCode}.JPG`;
    }
}