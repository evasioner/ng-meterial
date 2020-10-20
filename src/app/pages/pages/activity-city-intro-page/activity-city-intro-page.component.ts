import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { upsertActivityCitySearch } from '@/app/store/activity-city-intro-page/activity-city-search/activity-city-search.actions';

import * as activityModalDestinationSelectors from '@/app/store/activity-common/activity-modal-destination/activity-modal-destination.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';
import * as moment from 'moment';

import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiActivityService } from '../../api/activity/api-activity.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { ViewModelCategory, ViewModelCategorySet } from './models/activity-city-intro.model';

import { PageCodes } from '@app/common-source/enums/page-codes.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { DestinationState } from '@/app/common-source/enums/destination-state.enum';
import { ActivitySearch } from '@/app/common-source/enums/activity/activity-search.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { ActivityModalCityInformationComponent } from './modal-components/activity-modal-city-information/activity-modal-city-information.component';
import { DestinationStore } from '@/app/common-source/enums/destination/destination.enum';

@Component({
    selector: 'app-activity-city-intro-page',
    templateUrl: './activity-city-intro-page.component.html',
    styleUrls: ['./activity-city-intro-page.component.scss']
})
export class ActivityCityIntroPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscriptionList: Subscription[];

    public mainForm: FormGroup;
    public viewModel: any;
    public headerConfig: any;
    public destinationObj: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<any>,
        private apiActivityS: ApiActivityService,
        private bsModalService: BsModalService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private initialize() {
        this.dataModel = {
            modal: {}
        };
        this.viewModel = {};
        this.subscriptionList = [];
        this.mainFormInit(); //폼 초기화
        this.destinationObjInit();
        this.subscriptionInit();
        this.headerInit();
    }

    private subscriptionInit() {
        this.subscriptionList = [
            this.route.data
                .subscribe(
                    (data: any) => {
                        console.log('[activity-city-intro-page > route data] ', data);

                        if (data) {
                            this.dataModel.request = _.cloneDeep(data.resolveData);
                            this.dataModel.request.rq.condition.limits = this.dataModel.request.rq.condition.limits.map(
                                (value: string): number => {
                                    return Number(value);
                                }
                            );

                            this.viewModel.cityName = this.dataModel.request.searchCityName;
                            this.sendApi();
                        }
                    }
                ),
            this.route.queryParams
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.log('[activity-city-intro-page > route queryParams] ', data);

                        if (!_.isEmpty(data)) {
                            this.sendApi();
                        }
                    }
                ),
            this.store.pipe(
                select(activityModalDestinationSelectors.getSelectId(DestinationStore.activity))
            )
                .subscribe(
                    (resp: any) => {
                        if (resp) {
                            console.log('ddddddddestination : ', resp);
                            this.dataModel.type = resp.type;

                            if (this.dataModel.type === ActivitySearch.SEARCH_TYPE_CITY) {
                                this.mainForm.patchValue(
                                    { name: resp.name, cityName: resp.name, cityCode: resp.val, categoryCode: '', categoryName: '' }
                                );
                            } else if (this.dataModel.type === ActivitySearch.SEARCH_TYPE_DETAIL) {
                                this.mainForm.patchValue(
                                    {
                                        name: resp.name,
                                        cityName: resp.cityNameLn,
                                        cityCode: resp.cityCode,
                                        categoryCode: Number(resp.val),
                                        categoryName: resp.name
                                    }
                                );
                            }

                            this.viewModel.beforeCity = this.mainForm.value;
                            this.destinationObj.state = DestinationState.IS_DEFAULT;
                        } else {
                            this.dataModel.type = null;
                        }
                    }
                )
        ];
    }

    private headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_ACTIVITY
        };
    }

    private mainFormInit() {
        this.mainForm = this.fb.group({
            name: '',
            cityName: '',
            cityCode: '',
            categoryCode: '',
            categoryName: ''
        });
    }

    private destinationObjInit() {
        this.destinationObj = {
            storeCategoryType: 'ACTIVITY', // 카테고리 선택 | FLIGHT, HOTEL, AIRTEL, RENT, ACTIVITY, MY
            state: null,
            storeId: null,
            inputId: null,
            left: 0,
            top: 0,
            initialState: null,
            majorDestinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: ActivityCommon.IITEM_CATEGORY_CODE,
                        compCode: environment.COMP_CODE
                    }
                }
            },
            destinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: ActivityCommon.IITEM_CATEGORY_CODE,
                        keyword: null,
                        limits: [0, 20]
                    }
                }
            }
        };
    }

    private sendApi() {
        this.upsertOne({
            id: ActivityStore.STORE_CITYINTRO_RQ,
            result: _.cloneDeep(this.dataModel.request)
        });

        this.subscriptionList.push(
            combineLatest(
                this.apiActivityS.POST_ACTIVITY_CITY(this.dataModel.request.rq),
                this.translateService.getTranslation(this.translateService.getDefaultLang())
                    .pipe(take(1))
            )
                .subscribe(
                    ([resp1, resp2]: any) => {
                        console.log(resp1, resp2);

                        if (resp1.succeedYn) {
                            this.dataModel.result = _.cloneDeep(resp1.result);
                        } else {
                            this.alertService.showApiAlert(resp1.errorMessage);
                        }

                        this.dataModel.translate = _.cloneDeep(resp2);

                        if (this.dataModel.result && this.dataModel.translate) {
                            this.dataModel.transactionSetId = resp1.transactionSetId;
                            this.setViewModel();

                            this.upsertOne({
                                id: ActivityStore.STORE_CITYINTRO_RS,
                                result: this.dataModel.result
                            });
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );
    }

    private setViewModel() {
        this.viewModel = {
            cityName: this.dataModel.result.city.cityNameLn,
            cityImage: this.dataModel.result.city.defaultPhotoUrl,
            cityInfoFlag: Object.keys(this.dataModel.result.info).length > 0 ? true : false,
            currency: { ...this.dataModel.result.info.currency, ...{ now: new Date() } },
            plug: this.dataModel.result.info.plug,
            time: this.dataModel.result.info.time,
            weather: this.dataModel.result.info.weathers,
            categoryList: this.dataModel.result.category && ViewModelCategorySet.map(
                (item: ViewModelCategory): ViewModelCategory => {
                    let originItem: ViewModelCategory = item;

                    this.dataModel.result.category.map(
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
        this.viewModel.categoryList[0].count = _.sumBy(this.viewModel.categoryList, (item: ViewModelCategory): number => item.count);
    }

    private msgAlert(titleTxt: string) {
        const initialState = {
            titleTxt: titleTxt,
            okObj: {
                fun: () => { }
            }
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
    }

    private upsertOne(obj: any) {
        this.store.dispatch(
            upsertActivityCitySearch({ activityCitySearch: obj })
        );
    }

    public goCityDetail(event: MouseEvent) {
        event && event.preventDefault();

        const initialState: any = {
            storeId: 'activity-modal-city-information'
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.viewModel.bsModalCityInfoRef = this.bsModalService.show(ActivityModalCityInformationComponent, { initialState, ...configInfo });
    }

    /**
     * onDestinationFocus
     * 목적지 포커스 온
     *
     * @param event 마우스 이벤트
     */
    public onDestinationFocus(event: MouseEvent) {
        event && event.preventDefault();

        this.viewModel.beforeCity = this.mainForm.value;
        this.destinationObjInit();
        this.mainFormInit();

        this.destinationObj.storeId = 'search';
        this.destinationObj.inputId = 'tgDesInput'; // tgDesInput
        this.destinationObj.top = 0;
        this.destinationObj.state = DestinationState.IS_CITY;

        const tgWrapName = 'tg-search-area-form';
        const tgWrap = document.querySelector(`[data-target="${tgWrapName}"]`);
        this.destinationObj.top = tgWrap.clientHeight + 211;
    }

    /**
     *
     * @param event 키보드 이벤트
     */
    public onDestinationKeyup(event: any) {
        event && event.preventDefault();
        console.info('[onDestinationKeyup]', event.target.value);

        const tgVal = event.target.value;

        if (tgVal.length === 0) {  // 도시검색
            this.destinationObj.state = DestinationState.IS_CITY;
        } else if (tgVal.length > 0) { // 자동검색
            this.destinationObj.state = DestinationState.IS_AUTO;
        }
    }

    public clickOutsideDest(event?: any) {
        event && event.preventDefault();

        if (this.viewModel.beforeCity) {
            this.mainForm.patchValue(this.viewModel.beforeCity);
        }

        this.destinationObj.state = DestinationState.IS_DEFAULT;
    }

    /**
    * onGoCategorySearchClick
    * 카테고리 선택
    */
    public onGoCategorySearchClick(event: any, index: number) {
        event && event.preventDefault();

        this.dataModel.modal.searchType = ActivitySearch.SEARCH_TYPE_CATEGORY;
        this.dataModel.modal.categoryCode = this.viewModel.categoryList[index].code;

        if (this.viewModel.categoryList[index].code === 'ALL') {
            this.dataModel.modal.categoryName = this.viewModel.categoryList[index].translateName + ' 카테고리';
        } else {
            this.dataModel.modal.categoryName = this.viewModel.categoryList[index].translateName;
        }

        this.onGoNextPage();
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

        if (this.dataModel.modal.searchType === ActivitySearch.SEARCH_TYPE_DETAIL) {
            if (!this.dataModel.modal.detailId) { // Defensive coding
                return;
            }

            // transactionSetId : this.transactionSetId, // 메인에서 바로 detail로 이동할 경우, 본 값이 없다.
            rqCondition = {
                activityCode: this.dataModel.modal.detailId
            };
            tmpPath = ActivityCommon.PAGE_SEARCH_RESULT_DETAIL;
        } else {
            if (!this.dataModel.modal.categoryCode && !this.dataModel.modal.cityCode) { // Defensive coding
                return;
            }

            if (!this.dataModel.modal.categoryCode) { // searchCityCode 값만 있는 경우
                rqCondition = {
                    cityCode: this.dataModel.modal.cityCode,
                    limits: [0, 12]
                };
                tmpPath = ActivityCommon.PAGE_CITY_INTRO;
            } else { // searchCityCode, searchCategoryCode 값이 있는 경우
                rqCondition = {
                    cityCode: this.dataModel.result.city.cityCode,
                    filter: {},
                    limits: [0, 12]
                };

                if (this.dataModel.modal.categoryCode !== 'ALL') {
                    rqCondition['activityCategoryCode'] = this.dataModel.modal.categoryCode;
                }

                tmpPath = ActivityCommon.PAGE_SEARCH_RESULT;
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
        if (tmpPath !== ActivityCommon.PAGE_CITY_INTRO) {
            this.router.navigate([path], extras);
        } else {
            // 같은 페이지 재호출시 상위 컴포넌트에 onInit을 다시 실행하기 위해 아래의 코드로 작성.
            this.router.navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.router.navigate([path]));
        }
    }

    /**
    * onSubmit
    * 도시 검색 페이지로 이동
    */
    public onSubmit() {
        console.log(this.mainForm.value, this.dataModel);

        const newData = this.mainForm.value;
        let validFlag: boolean = false;
        let nextPage = '';
        const activityInfo: any = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                condition: {}
            }
        };
        switch (this.dataModel.type) {
            case ActivitySearch.SEARCH_TYPE_CITY:
                if (newData.cityCode === '') {
                    validFlag = true;
                }

                activityInfo.searchCityName = newData.cityName;
                activityInfo.rq.condition.cityCode = newData.cityCode;
                activityInfo.rq.condition.limits = [0, 12];

                nextPage = ActivityCommon.PAGE_CITY_INTRO;
                break;

            case ActivitySearch.SEARCH_TYPE_DETAIL:
                if (newData.categoryCode === '') {
                    validFlag = true;
                }

                activityInfo.searchCityName = newData.cityName;
                activityInfo.searchCategoryName = newData.name;
                activityInfo.rq.condition.activityCode = newData.categoryCode;
                nextPage = ActivityCommon.PAGE_SEARCH_RESULT_DETAIL;
                break;

            default:
                validFlag = true;
                break;
        }

        if (validFlag) {
            return this.msgAlert('검색조건이 모두 입력되지 않았습니다.<br>검색 조건을 확인해주세요.');
        } else {
            const qsStr = qs.stringify(activityInfo);
            const path = nextPage + qsStr;
            const extras = {
                relativeTo: this.route
            };

            console.log('activity-main-search.component : ', activityInfo);
            // this.location.replaceState(ActivityEnums.PAGE_MAIN+);
            this.router.navigate([path], extras);
        }
    }
}
