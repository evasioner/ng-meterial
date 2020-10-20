import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { RentResultVm } from '../../insterfaces/rent-result-vm';

import { select, Store } from '@ngrx/store';

import * as rentSearchResultPageSelectors from '@store/rent-search-result-page/rent-search-result-page/rent-search-result-page.selectors';
import * as rentCompareListSelectors from '@store/rent-search-result-page/rent-search-result-page-compare-list/rent-search-result-page-compare-list.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { RentUtilService } from '@common/services/rent-com-service/rent-util.service';

import { environment } from '@/environments/environment';

import { RentSearchResultPageStoreIds } from '../../enums/rent-search-result-page-store-ids.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-modal-compare',
    templateUrl: './rent-modal-compare.component.html',
    styleUrls: ['./rent-modal-compare.component.scss']
})
export class RentModalCompareComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];

    vm: RentResultVm;
    compareList: Array<any>;
    element: any;
    locationType: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public rentUtilSvc: RentUtilService,
        public bsModalRef: BsModalRef,
        public translateService: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super(platformId);

        this.compareList = [];
    }

    ngOnInit() {
        super.ngOnInit();

        this.compareListInit();
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
     * compareList 데이터를 확인 후 compareTgIdList 만든다.
     */
    private compareListInit() {

        this.subscriptionList = [
            this.store
                .pipe(
                    select(rentSearchResultPageSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_RESOLVE_DATA)),
                    distinctUntilChanged(
                        (before: any, now: any) => {
                            return _.isEqual(before.result, now.result);
                        }
                    )
                )
                .subscribe(
                    (resp1) => {
                        if (resp1) {
                            console.info('[rent-modal-compare : ' + RentSearchResultPageStoreIds.RENT_RESOLVE_DATA + '] : ', resp1.result);
                            this.vm = { ...resp1.result };
                        }
                    }
                ),
            this.store
                .pipe(
                    select(rentSearchResultPageSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_SEARCH_RESULT_INFO)),
                    distinctUntilChanged(
                        (before: any, now: any) => {
                            return _.isEqual(before.result, now.result);
                        }
                    )
                )
                .subscribe(
                    (resp2) => {
                        if (resp2) {
                            console.info('[rent-modal-compare ' + RentSearchResultPageStoreIds.RENT_RESOLVE_DATA + '] : ', resp2);
                            this.vm = { ...resp2.result };
                        }
                    }

                ),
            this.store
                .pipe(
                    select(rentCompareListSelectors.getSelectId(RentSearchResultPageStoreIds.RENT_COMPARE_LIST)),
                    distinctUntilChanged(
                        (before: any, now: any) => {
                            return _.isEqual(before, now);
                        }
                    )
                )
                .subscribe(
                    (ev) => {
                        console.info('[rent-modal-compare compareListInit]', ev);
                        if (ev) {
                            this.compareList = _.cloneDeep(ev.result);
                        } else {
                            this.compareList = [];
                        }
                    }
                )
        ];
        if (this.vm.locationAccept.countryCode === 'KR')
            this.locationType = true;
        else {
            this.locationType = false;
        }
    }

    modalClose() {
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    onSelectItemClick($vehicleItem) {
        console.info('[onSelectItemClick]', $vehicleItem);
        console.info('[onSelectItemClick > this.vm]', this.vm);

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                pickup: {
                    cityCodeIata: $vehicleItem.pickup.cityCodeIata,
                    locationCode: $vehicleItem.pickup.locationCode,
                    datetime: $vehicleItem.pickup.datetime
                },
                return: {
                    cityCodeIata: $vehicleItem.return.cityCodeIata,
                    locationCode: $vehicleItem.return.locationCode,
                    datetime: $vehicleItem.return.datetime
                },
                vehicleIndex: $vehicleItem.vehicleIndex,
                accessLevel: $vehicleItem.accessLevel,
                vehicleVendorCode: $vehicleItem.vehicleVendorCode,
                sippCode: $vehicleItem.sippCode,
                vendorCurrencyCode: $vehicleItem.vendorCurrencyCode,
                baseRateTypeCode: $vehicleItem.baseRateTypeCode,
                vendorAmountSum: $vehicleItem.vendorAmountSum,
                rateIdentifier: $vehicleItem.rateIdentifier,
                rateCategoryCode: $vehicleItem.rateCategoryCode,
                fareTypeCode: $vehicleItem.fareTypeCode,
                vehicleTypeOwner: $vehicleItem.vehicleTypeOwner
            }
        };

        const resolveDataRqCondition = this.vm.rq.condition;
        console.info('[resolveDataRqCondition]', resolveDataRqCondition);

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
                limits: [0, 12],
                sortOrder: resolveDataRqCondition.sortOrder,
                filter: {
                    vehicleIndex: $vehicleItem.vehicleIndex
                }
            },
            transactionSetId: this.vm.rs.transactionSetId

        };

        const rqInfo = {
            listFilterRq: listFilterRq,
            rq: rq
        };

        const qsStr = qs.stringify(rqInfo);
        const path = '/rent-booking-information/' + qsStr;
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
     * @param typeCode
     */
    public imgLoadError(event: any, typeCode: string) {
        event && event.preventDefault();

        console.info('[imgLoadError > typeCode]', typeCode);
        event.target.src = `/assets/images/car/${typeCode}.JPG`;
    }
}
