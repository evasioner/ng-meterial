import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { take, distinct } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as activityModalDestinationSelectors from '@/app/store/activity-common/activity-modal-destination/activity-modal-destination.selectors';
import * as activityCityIntroPageSelectors from '@/app/store/activity-city-intro-page/activity-city-search/activity-city-search.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { ActivityEnums } from '../../../activity-page/enums/activity-enums.enum';
import { ViewModelSet, ViewModel, ViewModelCurrencySet, ViewModelPlugSet, ViewModeltimeSet, ViewModelWeatherSet, ViewModelCategorySet, ViewModelCategory } from './models/activity-city-search.model';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { ActivityModalCityInformationComponent } from '../../modal-components/activity-modal-city-information/activity-modal-city-information.component';
import { ModalDestinationComponent } from '@/app/common-source/modal-components/modal-destination/modal-destination.component';

@Component({
    selector: 'app-activity-city-search',
    templateUrl: './activity-city-search.component.html',
    styleUrls: ['./activity-city-search.component.scss']
})
export class ActivityCitySearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    public viewModel: ViewModel;
    private dataModel: any;
    private observableList: any;
    private subscribeList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private bsModalService: BsModalService
    ) {
        super(platformId);
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initialize();
    }

    ngOnDestroy() {
        this.subscribeList && this.subscribeList.map(
            (item: Subscription) => {
                item && item.unsubscribe();
            }
        );
        this.closeAllModals();
    }

    /**
     * initialize
     * 데이터 초기화
     */
    private initialize(): void {
        this.viewModel = ViewModelSet;
        this.dataModel = {
            request: {},
            response: {},
            cityName: {},
            translate: {},
            modal: {},
        };
        this.observableList = {
            modalDestinationSearch$: null as Observable<any>,
            activityCityRq$: null as Observable<any>,
            activityCityRs$: null as Observable<any>,
            activityCityName$: null as Observable<any>,
            translate$: null as Observable<any>
        };
        this.subscribeList = [];
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    /**
     * observableInit
     * 감시 초기화
     */
    private observableInit(): void {
        this.observableList = {
            modalDestinationSearch$: this.store
                .pipe(select(activityModalDestinationSelectors.getSelectId(['search']))),
            activityCityRq$: this.store
                .pipe(select(activityCityIntroPageSelectors.getSelectId(ActivityEnums.STORE_CITYINTRO_RQ))),
            activityCityRs$: this.store
                .pipe(select(activityCityIntroPageSelectors.getSelectId(ActivityEnums.STORE_CITYINTRO_RS))),
            activityCityName$: this.store
                .pipe(select(activityCityIntroPageSelectors.getSelectId(ActivityEnums.STORE_CITYINTRO_CITYNAME))),
            translate$: this.translateService.getTranslation(
                this.translateService.getDefaultLang()
            )
                .pipe(take(1))
        };
    }

    /**
     * subscribeInit
     * 구독 생성
     */
    private subscribeInit(): void {
        this.subscribeList = [
            combineLatest(
                this.observableList.activityCityRq$,
                this.observableList.activityCityRs$,
                this.observableList.activityCityName$,
                this.observableList.translate$
            )
                .subscribe(
                    ([res1, res2, res3, res4]): void => {
                        this.dataModel.request = _.cloneDeep(res1);
                        this.dataModel.response = _.cloneDeep(res2);
                        this.dataModel.cityName = _.cloneDeep(res3);
                        this.dataModel.translate = _.cloneDeep(res4);

                        if (
                            this.dataModel.request &&
                            this.dataModel.response &&
                            this.dataModel.cityName &&
                            this.dataModel.translate
                        ) {
                            this.setViewMode();
                        }
                    }
                ),
            this.observableList.modalDestinationSearch$
                .pipe(distinct((item: any) => item && item.val))
                .subscribe(
                    (item: any): void => {
                        if (item) {
                            this.dataModel.modal = _.cloneDeep(item);
                            this.setDestinationSearch();
                        }
                    }
                )
        ];
    }

    /**
    * setViewModel
    * 화면 구성용 값 설정
    */
    private setViewMode(): void {
        this.viewModel = {
            loadingFlag: true,
            cityName: this.dataModel.cityName.result || ViewModelSet.cityName,
            cityImage: this.dataModel.response.result.city.defaultPhotoUrl || ViewModelSet.cityImage,
            cityInfoFlag: Object.keys(this.dataModel.response.result.info).length > 0 ? true : false,
            currency: { ...this.dataModel.response.result.info.currency, ...{ now: new Date() } } || ViewModelCurrencySet,
            plug: this.dataModel.response.result.info.plug || ViewModelPlugSet,
            time: this.dataModel.response.result.info.time || ViewModeltimeSet,
            weather: this.dataModel.response.result.info.weathers || ViewModelWeatherSet,
            categoryList: this.dataModel.response.result.category && ViewModelCategorySet.map(
                (item: ViewModelCategory): ViewModelCategory => {
                    let originItem: ViewModelCategory = item;

                    this.dataModel.response.result.category.map(
                        (categoryItem: ViewModelCategory) => {
                            if (item.code === categoryItem.code) {
                                originItem = { ...item, ...categoryItem };
                            }
                        }
                    );

                    return originItem = { ...originItem, 'translateName': this.dataModel.translate.MAIN_SEARCH[item.categoryName] };
                }
            ),
            bsModalRef: null,
            bsModalCityInfoRef: null
        };

        this.viewModel.time.fullLocalTime = moment(this.viewModel.time.local, 'hh:mm').format('YYYY/MM/DD hh:mm');
        this.viewModel.categoryList[0].count = _.sumBy(this.viewModel.categoryList, (item) => item.count);
    }

    /**
     * setDestinationSearch
     * 검색 창에서 넘어온 검색 결과 저장
     */
    private setDestinationSearch(): void {
        this.dataModel.modal.searchType = this.dataModel.modal.type; // INPUT : 검색어 입력, CITY : 도시 선택, CATEGORY : 카테고리 선택, DETAIL : 상품 선택.

        if (this.dataModel.modal.type === ActivityEnums.SEARCH_TYPE_CITY) {
            this.dataModel.modal.cityCode = this.dataModel.modal.val;
            this.dataModel.modal.cityName = this.dataModel.modal.name;
        } else if (this.dataModel.modal.type === ActivityEnums.SEARCH_TYPE_DETAIL) {
            this.dataModel.modal.detailId = Number(this.dataModel.modal.val);
        }

        this.onGoNextPage();
    }

    /**
     * onGoSearchClick
     * 도시 내 상품검색 팝업
     *
     * @param event 폼 이벤트
     */
    public onGoSearchClick(event: any): void {
        event && event.preventDefault();

        const initialState: any = {
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
                        cityCode: this.dataModel.response.result.city.cityCode,
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

        this.viewModel.bsModalRef = this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
    }

    /**
     * onGoCityInfo
     * 도시 상세로 이동
     *
     * @param event 돔 이벤트
     */
    public onGoCityInfo(event: any): void {
        event && event.preventDefault();

        const initialState: any = {
            storeId: 'activity-modal-city-information'
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.viewModel.bsModalCityInfoRef = this.bsModalService.show(
            ActivityModalCityInformationComponent,
            { initialState, ...configInfo }
        );
    }

    /**
     * onGoCategorySearchClick
     * 카테고리 선택
     */
    public onGoCategorySearchClick(event: any, index: number) {
        event && event.preventDefault();

        console.log(ActivityEnums.SEARCH_TYPE_CATEGORY);

        this.dataModel.modal.searchType = ActivityEnums.SEARCH_TYPE_CATEGORY;
        this.dataModel.modal.categoryCode = this.viewModel.categoryList[index].code;

        if (this.viewModel.categoryList[index].code === 'ALL') {
            this.dataModel.modal.categoryName = this.viewModel.categoryList[index].translateName + ' 카테고리';
        } else {
            this.dataModel.modal.categoryName = this.viewModel.categoryList[index].translateName;
        }

        this.onGoNextPage();
    }

    /**
     * closeAllModals
     * 팝업 닫기
     */
    private closeAllModals(): void {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * onGoNextPage
     * 다음 스탭으로 이동하는 로직
     * searchType에 따라 다른 페이지를 호출한다.
     */
    private onGoNextPage(): void {
        if (!this.dataModel.modal.searchType) { // Defensive coding
            return;
        }

        let rqCondition = {};
        let tmpPath = '';

        if (this.dataModel.modal.searchType === ActivityEnums.SEARCH_TYPE_DETAIL) {
            if (!this.dataModel.modal.detailId) { // Defensive coding
                return;
            }

            // transactionSetId : this.transactionSetId, // 메인에서 바로 detail로 이동할 경우, 본 값이 없다.
            rqCondition = {
                activityCode: this.dataModel.modal.detailId
            };
            tmpPath = ActivityEnums.PAGE_SEARCH_RESULT_DETAIL;
        } else {
            if (!this.dataModel.modal.categoryCode && !this.dataModel.modal.cityCode) { // Defensive coding
                return;
            }

            if (!this.dataModel.modal.categoryCode) { // searchCityCode 값만 있는 경우
                rqCondition = {
                    cityCode: this.dataModel.modal.cityCode,
                    limits: [0, 10]
                };
                tmpPath = ActivityEnums.PAGE_CITY_INTRO;
            } else { // searchCityCode, searchCategoryCode 값이 있는 경우
                rqCondition = {
                    cityCode: this.dataModel.response.result.city.cityCode,
                    filter: {},
                    limits: [0, 10]
                };

                if (this.dataModel.modal.categoryCode !== 'ALL') {
                    rqCondition['activityCategoryCode'] = this.dataModel.modal.categoryCode;
                }

                tmpPath = ActivityEnums.PAGE_SEARCH_RESULT;
            }
        }

        const activityInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                condition: rqCondition
            },
            searchCityName: this.dataModel.modal.cityName,
            searchCategoryName: this.dataModel.modal.categoryName
        };

        const qsStr = qs.stringify(activityInfo);
        const path = tmpPath + qsStr;
        const extras = {
            relativeTo: this.route
        };

        this.viewModel.loadingFlag = true;
        if (tmpPath !== ActivityEnums.PAGE_CITY_INTRO) {
            this.router.navigate([path], extras);
        } else {
            // 같은 페이지 재호출시 상위 컴포넌트에 onInit을 다시 실행하기 위해 아래의 코드로 작성.
            this.router.navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate([path]));
        }
    }
}
