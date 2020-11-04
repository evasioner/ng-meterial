import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, distinct } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { clearActivityModalDestinations } from '@/app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';
import { clearActivityResultSearchs } from '@/app/store/activity-search-result-page/activity-result-search/activity-result-search.actions';
import { clearActivityCitySearchs } from '@/app/store/activity-city-intro-page/activity-city-search/activity-city-search.actions';
import { clearActivitySearchResultDetailPages } from '@/app/store/activity-search-result-detail-page/activity-search-result-detail-page/activity-search-result-detail-page.actions';
import { upsertActivitySearchResultOptionPage } from '@/app/store/activity-search-result-option-page/activity-search-result-option-page/activity-search-result-option-page.actions';
import { upsertActivitySessionStorage } from '@/app/store/activity-common/activity-session-storage/activity-session-storage.actions';
import { clearActivityCalendars } from '@/app/store/activity-search-result-option-page/activity-calendar/activity-calendar.actions';

import * as activityCalendarSelectors from '@/app/store/activity-search-result-option-page/activity-calendar/activity-calendar.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';
import * as _ from 'lodash';

import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { ApiActivityService } from 'src/app/api/activity/api-activity.service';
import { UtilUrlService } from '../../common-source/services/util-url/util-url.service';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ActivityComServiceService } from 'src/app/common-source/services/activity-com-service/activity-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { ActivityEnums } from '../activity-page/enums/activity-enums.enum';
import { AgeCode } from './enums/age-code.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-activity-search-result-option-page',
    templateUrl: './activity-search-result-option-page.component.html',
    styleUrls: ['./activity-search-result-option-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivitySearchResultOptionPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private ctx: any = this;
    private rqInfo: any;
    private subscriptionList: Subscription[];
    private dataModel: any;

    public headerType: any;
    public headerConfig: any;
    public viewModel: any;


    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        public jwtService: JwtService,
        public utilUrlService: UtilUrlService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private apiActivityService: ApiActivityService,
        private activityComServiceService: ActivityComServiceService,
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
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private initialize() {
        this.dataModel = {};
        this.viewModel = {
            options: [],
            age: [],
            amountSum: 0
        };
        this.subscriptionList = [];

        this.headerInit();
        this.storeActivityClear(); // store > activity-common 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    private headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '예약하기',
            key: 'TITLE',
            ctx: this.ctx
        };
    }

    /**
     * store > activity-common 초기화
     */
    private storeActivityClear() {
        this.store.dispatch(clearActivityModalDestinations());
        this.store.dispatch(clearActivityCitySearchs());
        this.store.dispatch(clearActivityResultSearchs());
        this.store.dispatch(clearActivitySearchResultDetailPages());
        this.store.dispatch(clearActivityCalendars());
    }

    /**
     * 서브스크라이브 초기화
     */
    private subscribeInit() {
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        const rsData = this.activityComServiceService.afterEncodingRq(_.cloneDeep(data.resolveData));
                        this.rqInfo = rsData;
                    }
                ),
            this.store
                .pipe(select(activityCalendarSelectors.getSelectId([ActivityEnums.STORE_CALENDAR])))
                .pipe(
                    distinct(
                        (item: any) => {
                            if (item && item.result.length > 0) {
                                return item;
                            }
                        }
                    )
                )
                .subscribe(
                    (resp: any): void => {
                        if (resp) {
                            console.log('선택 날짜 : ', resp);

                            this.resetViewModel();
                            if (resp.result[1].fullDate) {
                                this.rqInfo.rq.condition.serviceDate = moment(resp.result[0].fullDate, 'YYYY.MM.DD').format('YYYY-MM-DD');
                                this.getOption();
                            }
                        }
                    }
                )
        );
    }

    private resetViewModel() {
        this.dataModel = {};
        this.viewModel = {
            options: [],
            age: [],
            amountSum: 0
        };
    }

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     */
    private getOption() {
        // ---------[api 호출 | 액티비티 옵션]
        this.subscriptionList.push(
            this.apiActivityService.POST_ACTIVITY_OPTION(this.rqInfo.rq)
                .subscribe(
                    (resp: any) => {
                        if (resp.succeedYn) {
                            this.dataModel.response = _.cloneDeep(resp.result);
                            this.dataModel.transactionSetId = resp.transactionSetId;
                            this.upsertOne({
                                id: ActivityEnums.STORE_RESULT_OPTION_RS,
                                result: this.dataModel.response
                            });

                            this.setViewModel();
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
        // ---------[End api 호출 | 액티비티 옵션]
    }

    /**
    * setViewModel
    * 뷰용 데이터 설정
    */
    private setViewModel() {
        this.dataModel.response.options.map(
            (item: any) => {
                // counts 안에 count 값이 1만 있으면 1의 가격을 숫자만큼 곱하고
                // counts 안에 여러개의 count 값이 있으면 해당 숫자와 일치한 값의 가격을 표시한다.
                // counts가 없으면 화면에 표시하지 않는다
                if (item.counts && item.counts.length > 0) {
                    if (
                        item.optionNameLn !== undefined &&
                        item.optionNameLn !== null &&
                        item.optionNameLn !== 'null'
                    ) {
                        this.viewModel.options.push(item);
                        if (this.viewModel.options.length === 1) {
                            this.viewModel.selectOption = item.optionCode;
                            this.viewModel.selectOptionIndex = 0;
                        }
                    }
                }

            }
        );

        this.onOptionChange();
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    private upsertOne($obj: any) {
        this.store.dispatch(upsertActivitySearchResultOptionPage({
            activitySearchResultOptionPage: $obj
        }));
    }

    /**
      * 세션스토리지에 저장되는 스토어에 값 수정 및 저장
      *
     * @param $obj
     */
    private upsertOneSession($obj) {
        this.store.dispatch(upsertActivitySessionStorage({
            activitySessionStorage: _.cloneDeep($obj)
        }));
    }

    /**
     * makeCondition
     * 컨디션 만들기
     */
    private makeCondition() {
        return {
            activityCode: this.dataModel.response.activityCode,
            optionCode: this.viewModel.selectOption,
            serviceDate: this.dataModel.response.date,
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
    }

    /**
     *
     * @param id ngrx id
     * @param option 저장 데이터
     * @param isSession 세션저장인지 아닌지
     */
    private modelInit(id: string, option: any, isSession?: any) {
        const storeModel = {
            id: id,
            result: option
        };

        if (isSession) {
            this.upsertOneSession(storeModel);
        } else {
            this.upsertOne(storeModel);
        }
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

    public onOptionChange(event?: any) {
        event && event.preventDefault();

        this.viewModel.countPayment = {};
        this.viewModel.age = [];
        // const index = event.target.selectedIndex;
        // console.log(index);

        this.viewModel.options[this.viewModel.selectOptionIndex].counts.map(
            (countItem: any, countIndex: number) => {
                if (countIndex < 9) {
                    let adult: any;
                    let child: any;

                    countItem.ageTypes.map(
                        (ageItem: any) => {
                            switch (ageItem.code) {
                                case AgeCode.Child:
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

    /**
     * onOptionDown
     * 숫자를 줄여준다
     *
     * @param event
     * @param item
     * @param index
     */
    public onOptionDown(event: MouseEvent, index: number) {
        event && event.preventDefault();

        const newCount = (this.viewModel.age[index].count - 1);
        if (newCount >= 1) {
            this.getSelectAmount(newCount, index);
        }
    }

    /**
     * onOptionUp
     * 옵션 숫자 늘리기
     *
     * @param event 마우스 이벤트
     * @param item 선택한 아이템
     * @param index 더 해줄 위치
     */
    public onOptionUp(event: MouseEvent, index: number) {
        event && event.preventDefault();

        const newCount = (this.viewModel.age[index].count + 1);
        if (newCount < 10) {
            this.getSelectAmount(newCount, index);
        }
    }

    public onSubmit(event: any) {
        event && event.preventDefault();

        if (this.viewModel.amountSum <= 0) {
            return;
        }

        console.log(this.viewModel);
        const rqData = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                transactionSetId: this.dataModel.transactionSetId,
                condition: this.makeCondition()
            },
            view: this.viewModel,
        };

        this.modelInit(ActivityEnums.STORE_BOOKING_INFORMATION, rqData, true);
        this.router.navigate([ActivityEnums.PAGE_BOOKING_INFORMATION], { relativeTo: this.route });
    }
}


