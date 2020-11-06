import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { clearRentModalCalendars } from '@/app/store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';
import { clearRentModalDestinations } from '@/app/store/rent-common/rent-modal-destination/rent-modal-destination.actions';
import { upsertRentSearchResultPage } from '@/app/store/rent-search-result-page/rent-search-result-page/rent-search-result-page.actions';

import * as rentSearchResultPageSelectors from '@/app/store/rent-search-result-page/rent-search-result-page/rent-search-result-page.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import {
    VehicleVendorsCheckBoxParam,
    VehicleTypesCheckBoxParam,
    PassengerCountsCheckBoxParam,
    MileagesCheckBoxParam,
    PickupLocationsCheckBoxParam
} from './models/rent-modal-detail-filter.model';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-modal-detail-filter',
    templateUrl: './rent-modal-detail-filter.component.html',
    styleUrls: ['./rent-modal-detail-filter.component.scss']
})
export class RentModalDetailFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;

    mainForm: FormGroup; // 생성된 폼 저장

    rqInfo: any;

    vm: any = {
        keyword: '',
        vehicleVendors: null, // 차량 공급사
        vehicleVendorsAll: false,
        vehicleTypes: null, // 차량 등급
        vehicleTypesAll: false,
        passengerCounts: null, // 허용 승객수
        mileages: null, // 주행거리
        mileagesAll: false,
        pickupLocations: null, // 픽업 장소
        pickupLocationsAll: false,
    };

    rxAlive: boolean = true;
    rentListRq$: Observable<any>; // 렌터카 검색 request
    rentListRs$: Observable<any>; // 렌터카 검색 결과

    loadingBool: boolean = false;
    isListType: boolean;
    transactionSetId: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        private el: ElementRef,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);

        this.element = this.el.nativeElement;
        this.subscriptionList = [];
        this.mainFormCreate();
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.observableInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    observableInit() {
        this.rentListRq$ = this.store
            .pipe(select(rentSearchResultPageSelectors.getSelectId('rent-list-rq-info')));
        this.rentListRs$ = this.store
            .pipe(select(rentSearchResultPageSelectors.getSelectId('rent-list-rs')));
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.rentListRq$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[rentListRq$ > subscribe]', ev);
                        if (ev) {
                            this.rqInfo = _.cloneDeep(ev.result);
                            this.loadingBool = true;

                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.rentListRs$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[rentListRs$ > subscribe]', ev);
                        if (ev) {
                            this.setFilter(ev.res.result);
                            this.transactionSetId = ev.res.transactionSetId;
                            this.loadingBool = true;
                            this.isListType = ev.res.isListType;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );
    }

    /**
     * 폼 생성
     */
    private mainFormCreate(): void {
        this.mainForm = this.fb.group({
            keyword: [this.vm.keyword],
            vehicleVendorList: this.fb.array([], []), // 차량공급사
            vehicleTypeList: this.fb.array([], []), // 차량등급
            passengerCountList: this.fb.array([], []), // 허용승객수
            mileagesList: this.fb.array([], []), // 주행거리
            pickupLocationList: this.fb.array([], []) // 픽업장소
        });
    }

    /**
     * 필터 셋팅
     * rent/list rs 값을 통해 필터 값 셋팅
     * 1. 전체 필터 범위 셋팅
     * 2. 선택된 필터 셋팅
     */
    setFilter($result) {
        console.info('[forFilter]', $result.forFilter);
        this.vm.vehicleVendors = $result.forFilter.vehicleVendors.map(
            (item: any): VehicleVendorsCheckBoxParam => {
                return { ...item, ...{ checked: false } };
            }
        );
        this.vm.vehicleTypes = $result.forFilter.vehicleTypes.map(
            (item: any): VehicleTypesCheckBoxParam => {
                return { ...item, ...{ checked: false } };
            }
        );
        this.vm.passengerCounts = _.sortBy($result.forFilter.passengerCounts.map(
            (item: any): PassengerCountsCheckBoxParam => {
                return { ...item, ...{ checked: false } };
            }
        ), 'passengerCount'); // 데이터 정렬
        this.vm.mileages = $result.forFilter.mileages.map(
            (item: any): MileagesCheckBoxParam => {
                return { ...item, ...{ checked: false } };
            }
        );
        this.vm.pickupLocations = $result.forFilter.pickupLocations.map(
            (item: any): PickupLocationsCheckBoxParam => {
                return { ...item, ...{ checked: false } };
            }
        );

        /**
         * 선택한 필터가 있을 경우
         * 값 셋팅
         */
        if ($result.filter) { // 선택한 필터가 있을 경우
            console.info('[filter]', $result.filter);

            if (_.has($result.filter, 'keyword.length')) {
                this.vm.keyword = $result.filter.keyword;
                this.mainForm.get(`keyword`).setValue($result.filter.keyword);
            }

            if (_.has($result.filter, 'vehicleVendors')) {
                this.addFormArrayFilter($result.filter, 'vehicleVendorList', 'vehicleVendors', 'code');
            }

            if (_.has($result.filter, 'vehicleTypes')) {
                this.addFormArrayFilter($result.filter, 'vehicleTypeList', 'vehicleTypes', 'code');
            }

            if (_.has($result.filter, 'passengerCounts')) {
                this.addFormArrayFilter($result.filter, 'passengerCountList', 'passengerCounts', 'passengerCount');
            }

            if (_.has($result.filter, 'mileages')) {
                this.addFormArrayFilter($result.filter, 'mileagesList', 'mileages', 'code');
            }

            if (_.has($result.filter, 'pickupLocations')) {
                this.addFormArrayFilter($result.filter, 'pickupLocationList', 'pickupLocations', 'typeCode');
            }
        }
    }

    public modalClose(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * 체크된 필터 값 FormArray 에 추가
     * 여러번 필터 적용 시,
     * 이전 필터값이 store에 저장 안되는 현상 방지
     *
     * @param filter hotel/list rs 필터 데이터
     * @param filterKey 필터 아이템명
     * @param vieModelName 뷰모델 아이템명
     * @param keyName 키 아이템명
     */
    private addFormArrayFilter(filter: any, filterKey: string, viewModelName: string, keyName: string): void {
        const formArray: FormArray = this.mainForm.get(`${filterKey}`) as FormArray;

        let totalCount = 0;

        filter[viewModelName].map(
            (item: any): void => {
                let originalVal = '';

                if (item.constructor === Object) {
                    originalVal = item[keyName];
                } else {
                    originalVal = item;
                }

                formArray.push(new FormControl(originalVal));

                this.vm[viewModelName].map(
                    (vmItem: any): any => {
                        if (String(originalVal) === String(vmItem[keyName])) {
                            vmItem.checked = true;
                            totalCount++;
                        }

                        return vmItem;
                    }
                );
            }
        );

        if (totalCount === this.vm[viewModelName].length) {
            this.vm[`${viewModelName}All`] = true;
        }
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertRentSearchResultPage({
            rentSearchResultPage: $obj
        }));
    }

    /**
     * store > rent-common 초기화
     */
    storeRentCommonInit() {
        console.info('[0. store > rent-common 초기화]');
        this.store.dispatch(clearRentModalDestinations());
        this.store.dispatch(clearRentModalCalendars());
    }

    /**
     * 필터 적용하기
     * vehicleVendors : 차량공급사
     * vehicleTypes : 차량듭급
     * passengerCounts : 허용 승객수
     * mileages : 주행거리
     * pickupLocations: 픽업장소
     * @param $form
     */
    onSubmit($form: any) {
        this.modalClose();
        console.info('[onSubmit]', $form.value);
        console.info('[onSubmit > this.rqInfo]', this.rqInfo);

        /**
         * filter 초기화
         */
        const filter = {
            keyword: '',
            vehicleVendors: [],
            vehicleTypes: [],
            passengerCounts: [],
            mileages: [],
            pickupLocations: []

        };
        this.rqInfo.rq.condition = { ...this.rqInfo.rq.condition, filter };
        // end filter 초기화

        console.info('[this.rqInfo.rq.condition]', this.rqInfo.rq.condition);

        this.rqInfo.rq.condition.filter.keyword = $form.value.keyword.trim();

        this.rqInfo.rq.condition.filter.vehicleVendors = _.map($form.value.vehicleVendorList, ($item) => {
            return { 'code': $item };
        });
        this.rqInfo.rq.condition.filter.vehicleTypes = _.map($form.value.vehicleTypeList, ($item) => {
            return { 'code': $item };
        });
        this.rqInfo.rq.condition.filter.passengerCounts = _.map($form.value.passengerCountList, ($item) => {
            return { 'passengerCount': $item };
        });
        this.rqInfo.rq.condition.filter.mileages = _.map($form.value.mileagesList, ($item) => {
            return { 'code': $item };
        });
        this.rqInfo.rq.condition.filter.pickupLocations = _.map($form.value.pickupLocationList, ($item) => {
            return { 'typeCode': $item };
        });


        this.rqInfo.rq = { ...this.rqInfo.rq, transactionSetId: this.transactionSetId };

        console.info('[onSubmit > this.rqInfo]', this.rqInfo);

        this.rqInfo.detailUpdate = 'false';
        this.rqInfo.isListType = this.isListType;

        Object.entries(this.rqInfo.rq.condition.filter).map(
            ([key, item]) => {
                const originItem: any = item as any;
                if (
                    (this.rqInfo.detailUpdate !== 'true') &&
                    (originItem.constructor === Array) &&
                    (originItem.length > 0)
                ) {
                    this.rqInfo.detailUpdate = 'true';
                } else if (
                    (this.rqInfo.detailUpdate !== 'true') &&
                    (this.rqInfo.rq.condition.filter.keyword !== '')
                ) {
                    this.rqInfo.detailUpdate = 'true';
                }
            }
        );

        /**
         * 결과페이지 라어터 이동
         */
        const qsStr = qs.stringify(this.rqInfo);
        const path = '/rent-search-result/' + qsStr;

        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }

    /**
     * onCheckboxChange
     * 체크 박스 체크
     *
     * @param {any} event 폼 이벤트
     * @param {string} formTargetName 전체 선택한 셀렉트
     * @param {string} viewTargetName 전체 선택한 셀렉트
     */
    onCheckboxChange(event: any, formTargetName: string, viewTargetName: string): void {
        event && event.preventDefault();

        const formArray: FormArray = this.mainForm.get(`${formTargetName}`) as FormArray;

        // 전체는 value가 on과 off로 확인됨.
        switch (event.target.value) {
            case 'on':
            case 'off':
                formArray.clear();

                this.vm[viewTargetName].map(
                    (item: any) => {
                        if (event.target.checked) {
                            item.checked = true;

                            if (viewTargetName.indexOf('passengerCount') > -1) {
                                formArray.push(new FormControl(item.passengerCount));
                            } else if (viewTargetName.indexOf('pickupLocations') > -1) {
                                formArray.push(new FormControl(item.typeCode));
                            } else {
                                formArray.push(new FormControl(item.code));
                            }
                        } else {
                            item.checked = false;
                        }
                    }
                );

                this.vm[`${viewTargetName}All`] = event.target.checked;
                break;

            default:
                if (event.target.checked) {
                    formArray.push(new FormControl(event.target.value));
                } else {
                    let itemValue = '';
                    formArray.controls.map(
                        (item: FormControl, index: number): void => {
                            if (String(item.value) === String(event.target.value)) {
                                formArray.removeAt(index);
                                itemValue = item.value;
                            }
                        }
                    );
                }

                this.vm[viewTargetName].map(
                    (item: any): void => {
                        if (viewTargetName.indexOf('passengerCount') > -1) {
                            if (String(item.passengerCount) === String(event.target.value)) {
                                item.checked = event.target.checked;
                            }
                        } else {
                            if (String(item.code) === String(event.target.value)) {
                                item.checked = event.target.checked;
                            }
                        }
                    }
                );

                if (formArray.controls.length === this.vm[viewTargetName].length) {
                    this.vm[`${viewTargetName}All`] = true;
                } else {
                    this.vm[`${viewTargetName}All`] = false;
                }
                break;
        }
    }

    /**
     * onCloseClick
     * 팝업 닫음
     *
     * @param {any} event 폼 이벤트
     */
    public onCloseClick(event: any): void {
        event && event.preventDefault();
        console.info('모달 닫기');
        this.modalClose();
    }

    /**
     * resetModalData
     * 모델 초기화
     */
    private resetModalData(): void {
        this.resetText();
        this.mainFormCreate();

        Object.entries(this.vm).map(
            ([key, item]) => {
                if (key.indexOf('All') > -1) {
                    this.vm[key] = false;
                } else if (item && (item.constructor === Array)) {
                    this.vm[key].map(
                        (subItem: any) => {
                            subItem.checked = false;
                        }
                    );
                }
            }
        );
    }

    /**
     * onReloadClick
     * 필터 초기화
     *
     * @param {any} event 폼 이벤트
     */
    public onReloadClick(event: any): void {
        event && event.preventDefault();

        this.resetModalData();
    }

    /**
     * resetText
     * 텍스트 박스 리셋
     *
     * @param event? 돔 이벤트
     */
    public resetText(event?: any): void {
        event && event.preventDefault();

        this.vm.keyword = '';
        this.mainForm.get('keyword').setValue('');
    }
}
