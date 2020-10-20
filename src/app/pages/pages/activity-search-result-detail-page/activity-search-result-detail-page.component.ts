import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertActivitySearchResultDetail } from '@/app/store/activity-search-result-detail-page/activity-search-result-detail/activity-search-result-detail.actions';
import { upsertActivitySessionStorage } from '@/app/store/activity-common/activity-session-storage/activity-session-storage.actions';

import * as activityModalCalendarSelectors from '@/app/store/activity-common/activity-modal-calendar/activity-modal-calendar.selectors';

import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { ApiActivityService } from '@/app/api/activity/api-activity.service';
import { StorageService } from '@/app/common-source/services/storage/storage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '@/app/common-source/enums/page-codes.enum';
import { CalendarState } from '@/app/common-source/enums/calendar-state.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { StoreCategoryTypes } from '@/app/common-source/enums/store-category-types.enum';
import { ActivityAge } from '@/app/common-source/enums/activity/activity-age.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { ActivityModalDetailImageComponent } from './model-component/activity-modal-detail-image/activity-modal-detail-image.component';

@Component({
    selector: 'app-activity-search-result-detail-page',
    templateUrl: './activity-search-result-detail-page.component.html',
    styleUrls: ['./activity-search-result-detail-page.component.scss']
})
export class ActivitySearchResultDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private dataModel: any;

    public headerType: any;
    public headerConfig: any;
    public viewModel: any;
    public calendarObj: any;
    public mainForm: FormGroup;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private loadingBar: LoadingBarService,
        private activityComServiceService: ActivityComServiceService,
        private apiActivityService: ApiActivityService,
        private scrollToService: ScrollToService,
        private bsModalService: BsModalService,
        private storageS: StorageService,
        private fb: FormBuilder,
        private router: Router,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.formInit();
        this.initialize();
        this.subscribeInit();
    }

    ngOnInit() {
        super.ngOnInit();
        this.headerInit();
    }

    ngOnDestroy() {
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    private formInit() {
        this.mainForm = this.fb.group(
            {
                serviceDate: new FormControl('', Validators.required),
                optionCode: new FormControl('', Validators.required)
            }
        );
    }

    private initialize() {
        this.subscriptionList = [];
        this.dataModel = {};
        this.viewModel = {
            pageState: 'detail',
            loadingBool: true,
            mainImage: '',
            images: [],
            imageCount: 0,
            optionList: []
        };
        this.calendarObj = {
            storeCategoryType: StoreCategoryTypes.ACTIVITY,
            typeId: null,
            state: CalendarState.IS_DEFAULT,
            right: 0,
            top: 0,
            initialState: null
        };
    }

    private subscribeInit() {
        this.subscriptionList = [
            // url data
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('activity-search-result-page > route data -> ', data);
                        if (data) {
                            this.viewModel.loadingBool = true;
                            this.dataModel = this.activityComServiceService.afterEncodingRq(_.cloneDeep(data.resolveData));

                            this.upsertOne(
                                {
                                    id: ActivityStore.STORE_SEARCH_RESULT_RQ,
                                    result: _.cloneDeep(this.dataModel)
                                }
                            );
                            this.onSearch();
                        }
                    }
                ),
            this.store
                .pipe(
                    select(activityModalCalendarSelectors.getSelectId('activity-booking'))
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.calendarObj.state = CalendarState.IS_DEFAULT;
                            console.log('우헤헤헤헤 나오나? ', ev);
                            this.mainForm.patchValue(
                                { serviceDate: ev.result.selectList[0] }
                            );

                            this.getOption();
                        }
                    }
                )
        ];
    }

    private onSearch() {
        this.loadingBar.start();
        this.subscriptionList.push(
            this.apiActivityService.POST_ACTIVITY_INFORMATION(this.dataModel.rq)
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.dataModel.result = _.cloneDeep(resp.result);
                            this.dataModel.transactionSetId = resp.transactionSetId;

                            this.upsertOne(
                                {
                                    id: ActivityStore.STORE_SEARCH_RESULT_RQ,
                                    result: {
                                        activities: [
                                            {
                                                serviceCities: [
                                                    {
                                                        cityNameLn: this.dataModel.result.serviceCities[0].cityNameLn,
                                                        cityNameEn: this.dataModel.result.serviceCities[0].cityNameEn
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            );

                            this.upsertOne(
                                {
                                    id: ActivityStore.STORE_SEARCH_RESULT_DETAIL_RS,
                                    result: _.cloneDeep(resp.result)
                                }
                            );

                            this.storageS.makeRecentData(
                                'local',
                                {
                                    resolveData: resp,
                                    cityNameLn: resp.result.serviceCities[0].cityNameLn,
                                    activityNameEn: resp.result.activityNameEn,
                                    includedDetail: resp.result.info.includedDetail,
                                    photoUrl: resp.result.photos[0].photoUrl,
                                    amountSum: resp.result.amountSum,
                                },
                                'activity'
                            );
                            this.setViewModel();
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    },
                    () => {
                        this.loadingBar.complete();
                    }
                )
        );
    }

    private setViewModel() {
        const info = this.dataModel.result.info ? true : false;
        this.viewModel = {
            maxInfoLength: 3,
            mainImage: '',
            images: [],
            imageCount: 0,
            activityName: this.dataModel.result.activityNameLn,
            activityCode: this.dataModel.result.activityCode,
            reviewAverage: this.dataModel.result.reviewAverage,
            reviewCount: this.dataModel.result.reviewCount,
            instantConfirmYn: this.dataModel.result.instantConfirmYn,
            vendorCompName: this.dataModel.result.provider.name,
            vendorCompImage: this.dataModel.result.provider.photoUrl,
            caution: info && this.dataModel.result.info.caution,
            amountSum: (this.dataModel.result.amountSum || 0),
            tabMenuList: [
                { text: '상품설명', id: 'info', count: 0, active: true, show: false, more: false },
                { text: '상세일정', id: 'itinerary', count: 0, active: true, show: false, more: true },
                { text: '사용방법', id: 'use', count: 0, active: false, show: false, more: true },
                { text: '취소규정', id: 'cancel', count: 0, active: false, show: false, more: true },
                { text: '이용후기', id: 'after', count: 0, active: false, show: false, more: true }
            ],
            optionList: [],
            totalSelectText: '',
            countPayment: [],
            age: [],
            itineraries: []
        };

        if (!_.isEmpty(this.dataModel.result.photos)) {
            this.viewModel.mainImage = this.dataModel.result.photos[0].photoUrl;
            this.viewModel.images = this.dataModel.result.photos;
            this.viewModel.imageCount = (this.dataModel.result.photos.length - 4) < 0 ? 0 : `+${(this.dataModel.result.photos.length - 4)}`;
        }

        Object.entries(this.dataModel.result.info)
            .map(
                ([key, value]: any) => {
                    if (value) {
                        switch (key) {
                            case 'caution':
                                this.viewModel.tabMenuList[0].show = true;
                                this.viewModel.tabMenuList[0].count++;
                                this.viewModel.cautionDetail = value;
                                break;

                            case 'excludedDetail':
                                this.viewModel.tabMenuList[0].show = true;
                                this.viewModel.tabMenuList[0].count++;
                                this.viewModel.excludedDetail = value;
                                break;

                            case 'howToUse':
                                this.viewModel.tabMenuList[2].show = true;
                                this.viewModel.howToUse = value;
                                break;

                            case 'includedDetail':
                                this.viewModel.tabMenuList[0].show = true;
                                this.viewModel.tabMenuList[0].count++;
                                this.viewModel.includedDetail = value;
                                break;

                            case 'itineraryDetail':
                                this.viewModel.tabMenuList[0].show = true;
                                this.viewModel.tabMenuList[0].count++;
                                this.viewModel.itineraryDetail = value;
                                break;

                            case 'othersDesc':
                                this.viewModel.tabMenuList[3].show = true;
                                this.viewModel.othersDescDetail = value;
                                break;

                            case 'productDesc':
                                this.viewModel.tabMenuList[0].show = true;
                                this.viewModel.tabMenuList[0].count++;
                                this.viewModel.productDescDetail = value;
                                break;
                        }
                    } else {
                        this.viewModel[key] = '';
                    }
                }
            );

        if (this.dataModel.result.itineraries.length > 0) {
            this.viewModel.tabMenuList[1].show = true;
            this.viewModel.tabMenuList[1].active = false;
            this.viewModel.tabMenuList[1].count++;
            this.viewModel.itineraries = _.cloneDeep(this.dataModel.result.itineraries);
        }
    }

    private getOption() {
        const rq: any = _.cloneDeep(this.dataModel.rq);
        rq.transactionSetId = this.dataModel.transactionSetId;
        rq.condition.serviceDate = this.mainForm.value.serviceDate;

        this.upsertOne({
            id: ActivityStore.STORE_SEARCH_RESULT_OPTION_RQ,
            result: rq
        });
        // ---------[api 호출 | 액티비티 옵션]
        this.subscriptionList.push(
            this.apiActivityService.POST_ACTIVITY_OPTION(rq)
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.dataModel.optionResponse = _.cloneDeep(resp.result);
                            this.dataModel.transactionSetId = resp.transactionSetId;
                            this.upsertOne({
                                id: ActivityStore.STORE_SEARCH_RESULT_OPTION_RS,
                                result: _.cloneDeep(this.dataModel.optionResponse)
                            });

                            this.setOptionView();
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );
        // ---------[End api 호출 | 액티비티 옵션]
    }

    private setOptionView() {
        this.dataModel.optionResponse.options.map(
            (item: any) => {
                if (item.counts.length > 0) {
                    this.viewModel.optionList.push(item);
                }
            }
        );
    }

    /**
    * getSelectAmount
    *
    * @param newIndex 신규 인덱스
    * @param oldIndex 구 인덱스
    */
    private getSelectAmount(newIndex: number, oldIndex: number) {
        this.viewModel.countPayment[newIndex].map(
            (newItem: any) => {
                if (this.viewModel.age[oldIndex].code === newItem.code) {
                    this.viewModel.age[oldIndex] = _.cloneDeep(newItem);
                }
            }
        );

        this.setAmountSum();
    }

    /**
    * setAmountSum
    * 총 합계 금액 표시
    */
    private setAmountSum() {
        this.viewModel.amountSum = 0;
        this.viewModel.age.map(
            (item: any) => {
                this.viewModel.amountSum += item.countAmountSum;
            }
        );
    }

    private makeCondition() {
        const activityItem: any = {
            activityCode: this.dataModel.optionResponse.activityCode,
            optionCode: Number(this.mainForm.value.optionCode),
            serviceDate: this.dataModel.optionResponse.date,
            travelers: this.viewModel.age.map(
                (ageItem: any): any => {
                    return {
                        optionCodedData: ageItem.optionCodedData,
                        code: ageItem.code,
                        count: ageItem.count
                    };
                }
            )
        };

        return activityItem;
    }

    private goBookingInformation() {
        const rqData: any = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                transactionSetId: this.dataModel.transactionSetId,
                condition: this.makeCondition()
            },
            view: this.viewModel,
        };

        this.upsertOneSession({
            id: ActivityStore.STORE_BOOKING_INFORMATION,
            result: rqData
        });
        this.router.navigate([ActivityCommon.PAGE_BOOKING_INFORMATION], { relativeTo: this.route });
    }

    private headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    /**
    * 데이터 추가 | 업데이트
    * action > key 값을 확인.
    */
    private upsertOne(obj: any) {
        this.store.dispatch(
            upsertActivitySearchResultDetail({ activitySearchResultDetail: obj })
        );
    }

    /**
    * upsertOneSession
    * 세션스토리지에 저장되는 스토어에 값 수정 및 저장
    *
    * @param obj
    */
    private upsertOneSession(obj: any) {
        this.store.dispatch(
            upsertActivitySessionStorage({ activitySessionStorage: _.cloneDeep(obj) })
        );
    }


    public onThumbnailClick(event: MouseEvent, index: number) {
        event && event.preventDefault();

        console.log('사진 누름');

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        const initialState = {
            currentSlide: index
        };

        this.bsModalService.show(ActivityModalDetailImageComponent, { initialState, ...configInfo });
    }

    public onTabClick(event: MouseEvent, item: any) {
        event && event.preventDefault();

        this.viewModel.tabMenuList.map(
            (tabItem: any) => {
                tabItem.active = false;

                if (item.id === tabItem.id) {
                    tabItem.active = true;
                }
            }
        );
        const config: ScrollToConfigOptions = {
            target: item.id,
            duration: 200,
            offset: -150
        };

        this.scrollToService.scrollTo(config);
    }

    public moreInfo(event: MouseEvent, item: any) {
        event && event.preventDefault();

        item.more = true;
    }

    public onCalendar(event: MouseEvent) {
        event && event.preventDefault();

        this.calendarObj.state = CalendarState.IS_OPEN;
        this.calendarObj.initialState = {
            storeId: 'activity-booking',
            step: 0,
            totStep: 1,
            tabTxtList: ['수령일'],
            selectList: [],
            rq: {
                currency: 'KRW',
                language: 'KO',
                stationTypeCode: environment.STATION_CODE,
                condition: {
                    itemCategoryCode: ActivityCommon.IITEM_CATEGORY_CODE
                }
            }
        };
    }

    public onCanlendarClose() {
        console.info('[onCanlendarClose]');
        this.calendarObj.state = CalendarState.IS_DEFAULT;
    }

    public selectOption(event: any) {
        event && event.preventDefault();

        let optionText: string;
        let count: Array<any> = [];
        this.viewModel.optionList.map(
            (item: any) => {
                console.log(item.optionCode, event.target.value);
                if (item.optionCode === Number(event.target.value)) {
                    optionText = item.optionNameLn;
                    count = item.counts;
                }
            }
        );
        this.viewModel.totalSelectText = `${optionText} / ${moment(this.mainForm.value.serviceDate, 'YYYY-MM-DD').format('YYYY년 MM월 DD일')}`;

        count.map(
            (countItem: any, countIndex: number) => {
                if (countIndex < 9) {
                    let adult: any;
                    let child: any;

                    countItem.ageTypes.map(
                        (ageItem: any) => {
                            switch (ageItem.code) {
                                case ActivityAge.CHILD:
                                    child = { ...ageItem, ...{ countAmountSum: ageItem.amountSum, count: (countIndex + 1) } };
                                    break;

                                default:
                                    adult = { ...ageItem, ...{ countAmountSum: ageItem.amountSum, count: (countIndex + 1) } };
                                    break;
                            }
                        }
                    );

                    this.viewModel.countPayment[(countIndex + 1)] = [];

                    if (!_.isEmpty(adult)) {
                        this.viewModel.countPayment[(countIndex + 1)].push(adult);
                    }
                    if (!_.isEmpty(child)) {
                        this.viewModel.countPayment[(countIndex + 1)].push(child);
                    }
                }
            }
        );

        // 1개만 있을 경우 총 9개가 되게 만든다.
        if (Object.keys(this.viewModel.countPayment).length === 1) {
            new Array(8)
                .fill(this.viewModel.countPayment['1'])
                .map(
                    (fillItem: any, fillIndex: number) => {
                        fillItem.map(
                            (newItem: any) => {
                                const count: number = (newItem.count + fillIndex + 1);
                                this.viewModel.countPayment[count] = [];
                                this.viewModel.countPayment[count].push({ ...newItem, ...{ countAmountSum: (newItem.amountSum * count), count: count } });
                            }
                        );
                    }
                );
        }

        this.viewModel.age = _.cloneDeep(this.viewModel.countPayment['1']);

        console.log('countPayment : ', this.viewModel.countPayment);
        console.log('age : ', this.viewModel.age);

        this.setAmountSum();
    }

    public onOptionDown(event: MouseEvent, index: number) {
        event && event.preventDefault();

        const newCount = (this.viewModel.age[index].count - 1);
        if (newCount >= 1) {
            this.getSelectAmount(newCount, index);
        }
    }

    public onOptionUp(event: MouseEvent, index: number) {
        event && event.preventDefault();

        const newCount = (this.viewModel.age[index].count + 1);
        if (newCount < 10) {
            this.getSelectAmount(newCount, index);
        }
    }

    public onSubmit(event: MouseEvent) {
        event && event.preventDefault();

        if (this.mainForm.valid) {
            this.goBookingInformation();
        }
    }
}
