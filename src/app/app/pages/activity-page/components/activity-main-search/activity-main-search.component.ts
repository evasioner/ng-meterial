import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { clearActivityModalDestinations } from '@app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';

import * as activityModalDestinationSelectors from '@app/store/activity-common/activity-modal-destination/activity-modal-destination.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { ActivityEnums } from '../../enums/activity-enums.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { ModalDestinationComponent } from '@/app/common-source/modal-components/modal-destination/modal-destination.component';

@Component({
    selector: 'app-activity-main-search',
    templateUrl: './activity-main-search.component.html',
    styleUrls: ['./activity-main-search.component.scss']
})
export class ActivityMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    vm: any = {
        searchType: null, // CITY : 도시 선택, CATEGORY : 카테고리 선택, DETAIL : 상품 선택.
        searchCityCode: null,
        searchCityName: null,
        searchCategoryCode: null,
        searchCategoryName: null,
        detailId: null,
        categoryList: null
    };

    rxAlive: boolean = true;
    modalDestinationSearch$: Observable<any>; // 검색 모달창

    bsModalRef: BsModalRef;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private readonly store: Store<any>,
        public translateService: TranslateService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private bsModalService: BsModalService
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.storeActivityCommonInit(); // store > activity-common 초기화
        this.vmInit();
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * vm 초기화
     */
    vmInit() {
        this.rxAlive = true;
        this.vm.categoryList = [
            { categoryId: 'AC01', styleType: 'sim', categoryName: 'CATEGORY_ITEM_TITLE_TYPE1', translateName: '' }, // WIFI&SIM카드
            { categoryId: 'AC02', styleType: 'service', categoryName: 'CATEGORY_ITEM_TITLE_TYPE2', translateName: '' }, // 여행서비스
            { categoryId: 'AC03', styleType: 'pickup', categoryName: 'CATEGORY_ITEM_TITLE_TYPE3', translateName: '' }, // 픽업/샌딩
            { categoryId: 'AC04', styleType: 'ticket', categoryName: 'CATEGORY_ITEM_TITLE_TYPE4', translateName: '' }, // 티켓/패스
            { categoryId: 'AC05', styleType: 'tour', categoryName: 'CATEGORY_ITEM_TITLE_TYPE5', translateName: '' }, // 투어
            { categoryId: 'AC06', styleType: 'experience', categoryName: 'CATEGORY_ITEM_TITLE_TYPE6', translateName: '' }, // 체험
            { categoryId: 'AC07', styleType: 'delicious', categoryName: 'CATEGORY_ITEM_TITLE_TYPE7', translateName: '' } // 맛집
        ];

        // 카테고리 목록에 다국어 title setting
        this.subscriptionList.push(
            this.translateService.getTranslation(this.translateService.getDefaultLang())
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        this.vm.categoryList = _.map(this.vm.categoryList, item => ({
                            ...item,
                            'translateName': ev.MAIN_SEARCH[item.categoryName]
                        }));
                    }
                )
        );
    }

    /**
     * 옵져버블 초기화
     */
    observableInit() {
        this.modalDestinationSearch$ = this.store.pipe(
            select(activityModalDestinationSelectors.getSelectId(['search']))
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        this.subscriptionList.push(
            this.modalDestinationSearch$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.vm.searchType = ev.type; // CITY : 도시 선택, CATEGORY : 카테고리 선택, DETAIL : 상품 선택.

                            if (this.vm.searchType === ActivityEnums.SEARCH_TYPE_CITY) {
                                this.vm.searchCityCode = ev.val;
                                this.vm.searchCityName = ev.name;
                            } else if (this.vm.searchType === ActivityEnums.SEARCH_TYPE_DETAIL) {
                                this.vm.detailId = Number(ev.val);
                            }

                            this.onGoNextPage();
                        }
                    }
                )
        );
    }

    /**
     * 다음 스탭으로 이동하는 로직
     * searchType에 따라 다른 페이지를 호출한다.
     */
    onGoNextPage() {
        if (this.vm.searchType == null) { // Defensive coding
            return;
        }


        let rqCondition = {};
        let tmpPath = '';

        if (this.vm.searchType === ActivityEnums.SEARCH_TYPE_DETAIL) {
            if (this.vm.detailId === null) { // Defensive coding
                return;
            }

            rqCondition = {
                activityCode: this.vm.detailId
            };
            tmpPath = ActivityEnums.PAGE_SEARCH_RESULT_DETAIL;
        } else {
            if (this.vm.searchCategoryCode === null && this.vm.searchCityCode === null) { // Defensive coding
                return;
            }

            if (this.vm.searchCategoryCode === null) { // searchCityCode 값만 있는 경우
                rqCondition = {
                    cityCode: this.vm.searchCityCode,
                    limits: [0, 10]
                };
                tmpPath = ActivityEnums.PAGE_CITY_INTRO;
            } else { // searchCityCode, searchCategoryCode 값이 있는 경우
                rqCondition = {
                    activityCategoryCode: this.vm.searchCategoryCode,
                    cityCode: this.vm.searchCityCode,
                    filter: {},
                    limits: [0, 10]
                };
                tmpPath = ActivityEnums.PAGE_SEARCH_RESULT;
            }
        }

        const activityMainInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                condition: rqCondition
            },
            searchCityName: this.vm.searchCityName, // display용
            searchCategoryName: this.vm.searchCategoryName // display용
        };

        this.rxAlive = false;
        const qsStr = qs.stringify(activityMainInfo);
        const path = tmpPath + qsStr;
        const extras = {
            relativeTo: this.route
        };

        console.log('activity-main-search.component : ', activityMainInfo);
        // this.location.replaceState(ActivityEnums.PAGE_MAIN+);
        this.router.navigate([path], extras);
    }

    searchModal() {
        const initialState = {
            storeId: 'search',
            majorDestinationRq: { // 주요도시 API RQ
                rq: {
                    currency: 'KRW', // TODO - user setting
                    language: 'KO', // TODO - user setting
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: ActivityEnums.IITEM_CATEGORY_CODE,
                        compCode: environment.COMP_CODE
                    }
                }
            },
            destinationRq: { // 목적지검색 API RQ
                rq: {
                    currency: 'KRW', // TODO - user setting
                    language: 'KO', // TODO - user setting
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: ActivityEnums.IITEM_CATEGORY_CODE,
                        keyword: null,
                        limits: [0, 20]
                    }
                }
            }
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        // console.info('[initialState]', initialState);
        this.bsModalRef = this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
    }

    /**
     * store > activity-common 초기화
     */
    storeActivityCommonInit() {
        this.store.dispatch(clearActivityModalDestinations());
    }

    /**
     * 검색어 클릭
     */
    onGoSearchClick() {
        this.vm.searchCategoryCode = null;
        this.vm.searchCategoryName = null;
        this.searchModal();
    }

    /**
     * 검색 카테고리 클릭
     */
    onGoCategorySearchClick($categoryIndex) {
        this.vm.searchCategoryCode = this.vm.categoryList[$categoryIndex].categoryId;
        this.vm.searchCategoryName = this.vm.categoryList[$categoryIndex].translateName;
        this.searchModal();
    }
}

