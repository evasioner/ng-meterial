import { Component, ElementRef, EventEmitter, Inject, OnInit, PLATFORM_ID, Output, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertHotelSearchResultPageUiState } from 'src/app/store/hotel-search-result-page/hotel-search-result-page-ui-state/hotel-search-result-page-ui-state.actions';
import { addHotelSearchResultPageCompareList, deleteHotelSearchResultPageCompareList, clearHotelSearchResultPageCompareLists } from 'src/app/store/hotel-search-result-page/hotel-search-result-page-compare-list/hotel-search-result-page-compare-list.actions';
import { upsertHotelSearchResultPage } from 'src/app/store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.actions';
import { upsertHotelSessionStorage } from 'src/app/store/hotel-common/hotel-session-storage/hotel-session-storage.actions';
import { addHotelSessionStorageCompareList, clearHotelSessionStorageCompareLists, deleteHotelSessionStorageCompareList } from 'src/app/store/hotel-common/hotel-session-storage-compare-list/hotel-session-storage-compare-list.actions';

import * as hotelSearchResultPageSelectors from '../../../../store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.selectors';
import * as hotelUiStateSelectors from '../../../../store/hotel-search-result-page/hotel-search-result-page-ui-state/hotel-search-result-page-ui-state.selectors';
import * as hotelCompareListSelectors from '../../../../store/hotel-search-result-page/hotel-search-result-page-compare-list/hotel-search-result-page-compare-list.selectors';

import * as _ from 'lodash';

import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { HotelResultVm } from 'src/app/pages/hotel-search-result-page/insterfaces/hote-result-vm';
import { HotelUiState } from '../../insterfaces/hotel-ui-state';

import { SearchResultPageState } from '../../../../common-source/enums/search-result-page-state.enum';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

//store

@Component({
    selector: 'app-hotel-tab-body',
    templateUrl: './hotel-tab-body.component.html',
    styleUrls: ['./hotel-tab-body.component.scss']
})
export class HotelTabBodyComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Output() goPageEvt: EventEmitter<any> = new EventEmitter();
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;

    vm: HotelResultVm;
    hotelList: Array<any> = []; // hotel/list rs > hotelList
    hotelTabBodyStateInfo: HotelUiState;

    paginationInfo: any;  // 페이지 네이션

    resolveData: any = null;
    searchResultInfo: any = null;


    compareList: any;
    compareTgIdList: any;
    defalutNum: number = 3; // default 갯수 3개
    defalutList: Array<any>;
    element: any;

    hotelResolveData$: Observable<any>;
    hotelSearchResultInfo$: Observable<any>;

    itemsPerPage: number = 10;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private el: ElementRef,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
        private comService: HotelComService,
        public translateService: TranslateService
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.observableInit();
        this.subscribeInit();
        this.compareListInit();
        this.hotelTabBodyTopInit();
    }

    ngOnDestroy() {
        console.info('[ >   ngOnDestroy() ');
        this.rxAlive = false;
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
                    (ev: any) => {
                        if (ev) {
                            console.info('[hotel-tab-body > hotelResolveData$]', ev);
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
                            console.info('[hotel-tab-body > hotelSearchResultInfo$]', ev);
                            this.searchResultInfo = ev.result;
                            this.searchResultInfoInit();
                            this.apiLoadingBool = true;
                            this.doCheckedIsCompare();
                            this.paginationInit();
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
                        console.info('[hotelTabBodyTopInit]', ev);
                        if (ev) {
                            this.hotelTabBodyStateInfo = { ...ev.result };
                            this.viewUpdate();
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
        console.info('[compareListInit] >>>>>>>>>>>>> ');
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelCompareListSelectors.selectAll),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[compareListInit]', ev);

                        if (ev) {
                            this.compareList = ev;
                        } else {
                            this.compareList = [];
                        }
                    }
                )
        );
    }

    /**
     * ui 데이터가 변경된 시점에서 화면 체크
     * 1. ui state 정보 세션 저장
     * 2. 비교하기 화면 > 체크 박스 checked
     */
    viewUpdate() {
        // --------------- [1. ui state 정보 세션 저장]
        this.vmSessionUpdate('hotel-tab-body-top', this.hotelTabBodyStateInfo);
        // --------------- [2. 비교하기 화면 > 체크 박스 checked]
        if (this.hotelTabBodyStateInfo.state === SearchResultPageState.IS_COMPARE) {
            console.info('[hotelTabBodyTopInit > IS_COMPARE]');
            this.doCheckedIsCompare();
        } else {
            console.info('[hotelTabBodyTopInit > not IS_COMPARE]');
            this.doCheckedIsDefault();
        }

    }

    paginationInit() {
        console.info('[paginationInit] >>> ', this.vm);

        const hotelList = _.chain(this.vm).get('rs.result.hotels').value();
        this.hotelList = this.changeDefaultPhotoUrl(hotelList);
        const itemsPerPage = this.itemsPerPage; // 1페이지당 10개 아이템

        // limits 가져오기
        const limits = this.getRqLimits();
        const curPage = this.getLimitsToPageNum(limits[0], itemsPerPage);

        const nowItem = _.chain(this.vm).get('rs.result.count.nowItem').value();

        console.info('[paginationInit > hotelList]', this.hotelList);
        console.info('[paginationInit > limits]', limits);
        console.info('[paginationInit > ]', nowItem);

        this.paginationInfo = {
            currentPage: curPage,
            totalItems: nowItem,
            itemsPerPage: itemsPerPage,
            maxSize: 5,
            disabled: false
        };
    }


    /**
     * 호텔 리스트 화질 변경
     * @param $hotels
     */
    changeDefaultPhotoUrl($hotels) {
        const hotels = JSON.parse(JSON.stringify($hotels));
        hotels.forEach((item) => {
            if (item.defaultPhotoUrl)
                item.defaultPhotoUrl = this.comService.replaceImageQulaity(item.defaultPhotoUrl, '_b');
        });
        return hotels;
    }


    /**
     * 선택된 항목 ID 리스트 : compareTgIdList 초기화
     */
    compareTgIdListInit() {
        console.info('[compareTgIdListInit > compareList]', this.compareList);
        this.compareTgIdList = _.map(this.compareList, ($item) => {
            return 'hotItemIndex_' + $item.id;
        });

    }


    /**
     * 비교하기 활성화 됐을때 화면 초기화
     */
    doCheckedIsCompare() {
        this.compareTgIdListInit();
        const tgIdList = this.compareTgIdList;
        console.info('[doCheckedIsCompare > tgIdList]', tgIdList);
        _.forEach(tgIdList, ($id) => {
            const tgEl = this.element.querySelector(`[data-target="${$id}"]`);
            console.info('[$id]', $id, tgEl);

            if (tgEl) {
                tgEl.classList.add('compare-checked');
                tgEl.querySelector(`input[type='checkbox']`).checked = true;
            }

        });
    }

    /**
     * 비교하기 체키 안됐을때 화면 초기화
     */
    doCheckedIsDefault() {
        this.compareTgIdListInit();
        const tgIdList = this.compareTgIdList;
        console.info('[doCheckedIsDefault > tgIdList]', tgIdList);
        _.forEach(tgIdList, ($id) => {
            const tgEl = this.element.querySelector(`[data-target="${$id}"]`);
            console.info('[$id]', $id, tgEl);

            if (tgEl && tgEl.classList.contains('compare-checked')) {
                tgEl.classList.remove('compare-checked');
            }

        });
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

    upsertSessionOne($obj) {
        this.store.dispatch(upsertHotelSessionStorage({
            hotelSessionStorage: _.cloneDeep($obj)
        }));
    }

    chkActive(): boolean {
        if (this.apiLoadingBool) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Limits[0] 에서 현제 페이지 구하기
     * @param $num
     * @param $itemsPerPage
     */
    getLimitsToPageNum($num: number, $itemsPerPage: number): number {
        const tgNum = $num;
        const divideNum = $itemsPerPage; // 1페이지당 10개 아이템

        let curPage;

        const temp = Math.floor(tgNum / divideNum);

        if (temp === 0) {
            curPage = 1;
        } else {
            curPage = temp + 1;
        }
        return curPage;
    }

    /**
     * $goPage 에서 limits[] 구하기
     * @param $goPage
     * @param $itemsPerPage
     */
    getPageNumToLimits($goPage: number, $itemsPerPage: number): Array<number> {
        const itemsPerPage = $itemsPerPage;
        const goPage = $goPage;
        const tempLimits = [0, itemsPerPage];

        tempLimits[0] = (() => {
            const tempNum = goPage - 1;
            if (tempNum === 0) {
                return tempNum;
            } else {
                return tempNum * itemsPerPage;
            }
        })();

        tempLimits[1] = (() => {
            const tempNum = goPage - 1;
            if (tempNum === 0) {
                return itemsPerPage;
            } else {
                return goPage * itemsPerPage;
            }
        })();

        return tempLimits;
    }

    setRqLimits($limits: Array<number>) {
        console.info('[setRqLimits]', $limits);
        const vm = _.cloneDeep(this.vm);
        vm.limits = $limits;
        vm.rq.condition.limits = $limits;
        this.vm = vm;
    }

    setRqTransactionSetId($transactionSetId) {
        console.info('[$transactionSetId]', $transactionSetId);
        const rq = _.cloneDeep(this.vm.rq);
        rq.transactionSetId = $transactionSetId;
        this.vm.rq = rq;
    }

    getRqLimits(): Array<number> {
        const limits = _
            .chain(this.vm.rq.condition)
            .get('limits')
            .value();
        return limits;
    }

    vmUpdate() {
        this.upsertOne({
            id: 'hotel-search-result-info',
            result: this.vm
        });
    }

    vmSessionUpdate($id, $result) {
        this.upsertSessionOne({
            id: $id,
            result: $result
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

    /**
      * 선택 아이템 스토어에 저장
      * hotel-compare-info
      */
    addCompareItem($item) {
        console.info('[setCompareItem]', $item);

        const id = $item.hotelCode;
        const result = $item;

        //store Add
        this.store.dispatch(addHotelSearchResultPageCompareList({
            hotelSearchResultPageCompareList: {
                id,
                result
            }
        }));
        //Session Add
        this.store.dispatch(addHotelSessionStorageCompareList({
            hotelSessionStorageCompareList: {
                id,
                result
            }
        }));
        //this.vmSessionUpdate(id, result);
    }

    deleteCompareItem($item) {
        console.info('[setCompareItem]', $item);
        const id = $item.hotelCode;

        //store Delete
        this.store.dispatch(deleteHotelSearchResultPageCompareList({ id }));

        //Session Delete
        this.store.dispatch(deleteHotelSessionStorageCompareList({ id }));
    }
    /**
    * 비교하기 클릭
    * @param $bool
    */
    onCompare($bool: boolean) {
        if (this.apiLoadingBool) {
            console.info('[onCompare]', $bool);
            if ($bool) {
                this.hotelTabBodyStateInfo.state = SearchResultPageState.IS_COMPARE;
                this.doCheckedIsCompare();
            } else {
                this.hotelTabBodyStateInfo.state = SearchResultPageState.IS_DEFAULT;
                this.doCheckedIsDefault();
                //session clear
                this.store.dispatch(clearHotelSessionStorageCompareLists());

                //store clear
                this.store.dispatch(clearHotelSearchResultPageCompareLists());
            }

            this.vmUpdate();
            this.uiStateUpdate();
        }
    }


    /**
      *호텔 등급 클래스명 구하기
      * @param $star -> ex) 5.0 / 4.5 ...
      */
    getHotelStarRating($star) {
        if (!$star) {
            return '0';
        }

        const hotelGradeCodeSplit = $star.split('.');
        let result = hotelGradeCodeSplit[0];
        if (hotelGradeCodeSplit[1] > 0) {
            result += 'h';
        }
        return result;
    }

    /**
     * 리스트 아이템 체크
     * @param e
     */
    onListItemInputChange(e, $item) {
        console.info('[onListItemInputChange]', e, $item);
        /**
         * 공통
         */
        const hotelalListItemEl = e.target.closest('.hotel-list-item');
        const isChecked = e.target.checked;
        const compareListTotalCount = this.compareList.length;

        if (isChecked) { // *** 추가 할 경우

            if (compareListTotalCount >= 3) {
                console.info('[compareList 3개 초가 될수 없음]');
                e.target.checked = false;

                if (hotelalListItemEl && hotelalListItemEl.classList.contains('compare-checked')) {
                    hotelalListItemEl.classList.remove('compare-checked');
                }

                return;
            }

            this.addCompareItem($item);

            if (hotelalListItemEl) {
                hotelalListItemEl.classList.add('compare-checked');
            }


        } else { // *** 취소 할 경우
            this.deleteCompareItem($item);
            if (hotelalListItemEl && hotelalListItemEl.classList.contains('compare-checked')) {
                hotelalListItemEl.classList.remove('compare-checked');
            }

        }

    }

    /**
     * 페이지 네이션
     */
    onPageChange(e) {
        console.info('[this.vm]', this.vm);

        console.info('[onPageChange]', e.page);
        console.info('[this.paginationInfo]', this.paginationInfo.currentPage);

        if (e.page === this.paginationInfo.currentPage) {
            console.info('[현재 페이지]', e.page, this.paginationInfo.currentPage);
        } else {
            console.info('[다른 페이지]', e.page, this.paginationInfo.currentPage);
            const itemsPerPage = this.itemsPerPage;
            const goPage = e.page;
            const tempLimits = this.getPageNumToLimits(goPage, itemsPerPage);

            this.setRqLimits(tempLimits);
            this.setRqTransactionSetId(this.vm.rs.transactionSetId);

            console.info('onPageChange', this.vm);

            //return false;
            const opt = {
                limits: tempLimits,
                transactionSetId: this.vm.rs.transactionSetId
            };

            this.vmUpdate();
            this.vmSessionUpdate('hotel-search-limit', opt);
            this.goPageEvt.emit(this.vm);
        }
    }

    onGoToMain() {
        const path = '/hotel-main';
        this.router.navigate([path], { relativeTo: this.route });
    }

    onHotelDtl($hotelItem) {
        console.log('move hotel detail...', this.searchResultInfo);
        const VM_DATA = this.vm;
        if (this.apiLoadingBool && this.hotelTabBodyStateInfo.state !== 'isCompare') {
            const rqInfo = {
                city: VM_DATA.city,
                chkIn: VM_DATA.chkIn,
                chkOut: VM_DATA.chkOut,
                roomList: VM_DATA.roomList,
                hCode: $hotelItem.hotelCode
            };

            let regionCode;
            if (_.has(VM_DATA.rq.condition, 'regionCode'))
                regionCode = VM_DATA.rq.condition.regionCode;

            console.info('[데이터 rqInfo]', rqInfo);
            this.comService.moveRoomtypePage(rqInfo, VM_DATA.rs.transactionSetId, regionCode);
        }
    }

}

