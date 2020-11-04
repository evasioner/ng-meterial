import { Component, Inject, OnInit, ElementRef, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as activitySearchResultPageSelectors from '../../../../store/activity-search-result-page/activity-result-search/activity-result-search.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { ActivityComServiceService } from 'src/app/common-source/services/activity-com-service/activity-com-service.service';

import { ActivityEnums } from '../../../activity-page/enums/activity-enums.enum';

import { BaseChildComponent } from '../../../../pages/base-page/components/base-child/base-child.component';
import { ViewModelCheckBoxGuideSet } from './models/activity-modal-detail-filter.model';

@Component({
    selector: 'app-activity-modal-detail-filter',
    templateUrl: './activity-modal-detail-filter.component.html',
    styleUrls: ['./activity-modal-detail-filter.component.scss']
})
export class ActivityModalDetailFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    mainForm: FormGroup; // 생성된 폼 저장
    rqInfo: any;
    filter: any;
    forFilter: any;
    public vm: any = {
        keyword: '', // 필터 내의 검색어
        amount: null, // 가격대
        tags: [], // 상품 태그
        tagsAll: false,
        tagsCount: 5,
        tagsDetail: false,
        reviewAverage: null, // 평점
        paxCount: null,// 인원
        duration: {}, // 소요시간
        deliveryTypes: [], // 수령방법
        deliveryTypesAll: false,
        guideExists: [],  // 가이드여부
        guideExistsAll: false,
        guideLanguages: [], // 가이드언어
        guideLanguagesAll: false
    };

    private amountMin: number;
    private amountMax: number;
    private reviewAverageMin: number;
    private reviewAverageMax: number;
    private subscriptionList: Subscription[];

    private durationMin: number;
    private durationMax: number;

    rxAlive: boolean = true;
    activityListRq$: Observable<any>; // 액티비티 검색 request
    activityListRs$: Observable<any>; // 액티비티 검색 결과
    loadingBool: Boolean = false;
    ctx: any = this;
    transactionSetId: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private router: Router,
        private fb: FormBuilder,
        public translateService: TranslateService,
        private el: ElementRef,
        private readonly activityComServiceService: ActivityComServiceService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.subscriptionList = [];

        this.mainFormCreate();
        this.observableInit();
        this.subscribeInit();
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
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

    /**
     * mainFormCreate
     * 폼 생성
     */
    private mainFormCreate(): void {
        this.mainForm = this.fb.group({
            keyword: [this.vm.keyword], // 검색어
            tagItemList: this.fb.array([], []), // 상품 태그
            deliveryList: this.fb.array([], []), // 수령방법
            guideExistsList: this.fb.array([], []), // 가이드여부
            guideLanguagesList: this.fb.array([], []) // 가이드언어
        });
    }

    observableInit() {
        this.activityListRq$ = this.store
            .pipe(select(activitySearchResultPageSelectors.getSelectId(ActivityEnums.STORE_RESULT_LIST_RQ)));
        this.activityListRs$ = this.store
            .pipe(select(activitySearchResultPageSelectors.getSelectId(ActivityEnums.STORE_RESULT_LIST_RS)));
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.activityListRq$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
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
            this.activityListRs$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.setFilter(ev.result.result);
                            this.transactionSetId = ev.result['transactionSetId'];
                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );
    }

    /**
     * 필터 셋팅
     * rent/list rs 값을 통해 필터 값 셋팅
     * 1. 전체 필터 범위 셋팅
     * 2. 선택된 필터 셋팅
     */
    private setFilter($result: any): void {
        this.filter = _.cloneDeep($result.filter);
        this.forFilter = _.cloneDeep($result.forFilter);

        // 가격대
        if (_.has($result.forFilter, 'amount')) {
            this.amountMin = Math.ceil(Number($result.forFilter.amount.lowestAmount));
            this.amountMax = Math.ceil(Number($result.forFilter.amount.highestAmount));
            this.vm.amount = {
                value: [this.amountMin, this.amountMax],
                min: this.amountMin,
                max: this.amountMax,
                setMin: this.amountMin,
                setMax: this.amountMax,
                ctx: this.ctx
            };
        }

        // 상품 태그
        if (_.has($result.forFilter, 'tags')) {
            this.vm.tags = $result.forFilter.tags.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            );
        }

        // 평점
        if (_.has($result.forFilter, 'reviewAverage')) {
            this.reviewAverageMin = Math.ceil(Number($result.forFilter.reviewAverage.minimum));
            this.reviewAverageMax = Math.ceil(Number($result.forFilter.reviewAverage.maximum));
            this.vm.reviewAverage = {
                value: [this.reviewAverageMin, this.reviewAverageMax],
                min: this.reviewAverageMin,
                max: this.reviewAverageMax,
                setMin: this.reviewAverageMin,
                setMax: this.reviewAverageMax,
                rangeMin: this.reviewAverageMin,
                rangeMax: this.reviewAverageMax,
                ctx: this.ctx
            };
        }

        // 인원

        // 소요시간
        if (_.has($result.forFilter, 'duration')) {
            this.durationMin = Math.ceil(Number($result.forFilter.duration.minimum));
            this.durationMax = Math.ceil(Number($result.forFilter.duration.maximum));
            this.vm.duration = {
                value: [this.durationMin, this.durationMax],
                min: this.durationMin,
                max: this.durationMax,
                setMin: this.durationMin,
                setMax: this.durationMax,
                rangeMin: this.durationMin,
                rangeMax: this.durationMax,
                ctx: this.ctx
            };
        }

        // 수령방법
        if (_.has($result.forFilter, 'deliveryTypes')) {
            this.vm.deliveryTypes = $result.forFilter.deliveryTypes.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            );
        }

        // 가이드
        if (_.has($result.forFilter, 'guide')) {
            this.vm.guideExists = ViewModelCheckBoxGuideSet;
        }

        // 가이드 사용언어
        if (_.has($result.forFilter, 'languages')) {
            this.vm.guideLanguages = $result.forFilter.languages.map(
                (item: any): any => {
                    return { ...item, ...{ checked: false } };
                }
            );
        }

        /**
         * 선택한 필터가 있을 경우
         * 값 셋팅
         */
        if ($result.filter != null) { // 선택한 필터가 있을 경우
            // 결과내검색
            if (_.has($result.filter, 'keyword')) {
                this.vm.hotelName = $result.filter.keyword;
                this.mainForm.get(`keyword`).setValue($result.filter.keyword);
            }

            // 가격대
            if (_.has($result.filter, 'amount')) {
                const min = Number($result.filter.amount.lowestAmount);
                const max = Number($result.filter.amount.highestAmount);

                if (this.amountMin < min) {
                    this.amountMin = min;
                }

                if (this.amountMax > max) {
                    this.amountMax = max;
                }

                this.vm.amount = {
                    value: [this.amountMin, this.amountMax],
                    min: this.amountMin,
                    max: this.amountMax,
                    setMin: this.amountMin,
                    setMax: this.amountMax,
                    rangeMin: this.amountMin,
                    rangeMax: this.amountMax,
                    ctx: this.ctx
                };
            }

            //     // 상품 태그
            if (_.has($result.filter, 'tags')) {
                this.addFormArrayFilter($result.filter, 'tags', 'tags', 'code');
            }

            // 평점
            if (_.has($result.filter, 'reviewAverage')) {
                const min = Number($result.filter.reviewAverage.minimum);
                const max = Number($result.filter.reviewAverage.maximum);

                if (this.reviewAverageMin < min) {
                    this.reviewAverageMin = min;
                }

                if (this.reviewAverageMax > max) {
                    this.reviewAverageMax = max;
                }

                this.vm.reviewAverage = {
                    value: [this.reviewAverageMin, this.reviewAverageMax],
                    min: this.reviewAverageMin,
                    max: this.reviewAverageMax,
                    setMin: this.reviewAverageMin,
                    setMax: this.reviewAverageMax,
                    rangeMin: this.reviewAverageMin,
                    rangeMax: this.reviewAverageMax,
                    ctx: this.ctx
                };
            }

            // 인원
            if (_.has($result.filter, 'paxCount')) {
                if ('adult' in $result.filter.paxCount) {
                    this.vm.paxCount.adult = $result.filter.paxCount.adult;
                }
                if ('child' in $result.filter.paxCount) {
                    this.vm.paxCount.child = $result.filter.paxCount.child;
                }
            }

            // 소요시간
            if (_.has($result.filter, 'duration')) {
                const min = Number($result.filter.duration.minimum);
                const max = Number($result.filter.duration.maximum);

                if (this.durationMin < min) {
                    this.durationMin = min;
                }

                if (this.durationMax > max) {
                    this.durationMax = max;
                }

                this.vm.duration = {
                    value: [this.durationMin, this.durationMax],
                    min: this.durationMin,
                    max: this.durationMax,
                    setMin: this.durationMin,
                    setMax: this.durationMax,
                    rangeMin: this.durationMin,
                    rangeMax: this.durationMax,
                    ctx: this.ctx
                };
            }

            // 수령방법
            if (_.has($result.filter, 'deliveryTypes')) {
                this.addFormArrayFilter($result.filter, 'deliveryList', 'deliveryTypes', 'code');
            }

            // 가이드여부
            if (_.has($result.filter, 'guide')) {
                this.addFormArrayFilter($result.filter, 'guideExistsList', 'guideExists', 'code');
            }

            // 가이드 사용언어
            if (_.has($result.filter, 'languages')) {
                this.addFormArrayFilter($result.filter, 'guideLanguagesList', 'guideLanguages', 'code');
            }
        }
    }

    /**
     * modalClose
     * 실제 모달 닫기
     */
    public modalClose(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * 인원수 계산
     * @param $type A:성인수, C:아동수
     * @param $calType P:더하기, M:빼기
     */
    onCalPaxCount($type, $calType) {
        let tmpValue = 1;
        tmpValue = ($type == 'A') ? this.vm.paxCount.adult : this.vm.paxCount.child;
        tmpValue = ($calType == 'P') ? tmpValue + 1 : tmpValue - 1;

        if (tmpValue <= 0) {
            tmpValue = 1; // default minimum value
        }
        if (tmpValue > 9) {
            tmpValue = 9; // default maximum value
        }

        if ($type == 'A') {
            this.vm.paxCount.adult = tmpValue;
        } else {
            this.vm.paxCount.child = tmpValue;
        }
    }

    /**
     * 적용하기
     * @param $form
     */
    public onSubmit($form: any): void {
        this.modalClose();

        console.info('[onSubmit]', $form.value);
        const forFilter = this.forFilter;


        this.rqInfo.rq.condition.filter = {};

        // 결과내검색
        if ($form.value.keyword) {
            this.rqInfo.rq.condition.filter.keyword = $form.value.keyword;
        } else {
            this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'keyword');
        }

        // 가격대
        this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'amount');
        this.vm.amount && this.vm.amount.value.map(
            (value: number, index: number): void => {
                if (index === 0 && this.amountMin !== value) {
                    this.rqInfo.rq.condition.filter.amount = {
                        lowestAmount: this.vm.amount.value[index],
                        highestAmount: this.amountMax
                    };
                } else if (index !== 0 && this.amountMax !== value) {
                    this.rqInfo.rq.condition.filter.amount = {
                        lowestAmount: this.vm.amount.value[0],
                        highestAmount: this.vm.amount.value[index]
                    };
                }
            }
        );

        // 상품 태그
        if ($form.value.tagItemList.length > 0) {
            this.rqInfo.rq.condition.filter.tags = _.cloneDeep($form.value.tagItemList);
        } else {
            this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'tags');
        }

        // 평점
        this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'reviewAverage');

        this.vm.reviewAverage && this.vm.reviewAverage.value.map(
            (value: number, index: number): void => {
                if (index === 0 && this.reviewAverageMin !== value) {
                    this.rqInfo.rq.condition.filter.reviewAverage = {
                        minimum: this.vm.reviewAverage.value[index],
                        maximum: this.reviewAverageMax
                    };
                } else if (index !== 0 && this.reviewAverageMax !== value) {
                    this.rqInfo.rq.condition.filter.reviewAverage = {
                        minimum: this.vm.reviewAverage.value[0],
                        maximum: this.vm.reviewAverage.value[index]
                    };
                }
            }
        );

        // 인원
        // const paxCount = {
        //     adult: this.vm.paxCount.adult,
        //     child: this.vm.paxCount.child
        // };
        // console.log("paxCount is empty : ", _.isEmpty(paxCount));
        // this.rqInfo.rq.condition.filter.paxCount = paxCount;


        // 소요시간
        this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'duration');
        this.vm.duration && this.vm.duration.value.map(
            (value: number, index: number): void => {
                if (index === 0 && this.durationMin !== value) {
                    this.rqInfo.rq.condition.filter.duration = {
                        minimum: this.vm.duration.value[0],
                        maximum: this.durationMax
                    };
                } else if (index !== 0 && this.durationMax !== value) {
                    this.rqInfo.rq.condition.filter.duration = {
                        minimum: this.vm.duration.value[0],
                        maximum: this.vm.duration.value[index]
                    };
                }
            }
        );

        // 수령방법
        if ($form.value.deliveryList.length > 0) {
            this.rqInfo.rq.condition.filter.deliveryTypes = $form.value.deliveryList.map(
                (item: string): any => {
                    return { code: item };
                }
            );
        } else {
            this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'deliveryTypes');
        }

        // 가이드
        if ($form.value.guideExistsList.length === 1) {
            this.rqInfo.rq.condition.filter.guide = $form.value.guideExistsList[0];
        } else {
            this.rqInfo.rq.condition.filter = _.omit(this.rqInfo.rq.condition.filter, 'guide');
        }

        // 사용언어
        if ($form.value.guideLanguagesList.length > 0) {
            this.rqInfo.rq.condition.filter.languages = $form.value.guideLanguagesList.map(
                (item: string): any => {
                    return { code: item };
                }
            );
        }

        if (Object.keys(this.rqInfo.rq.condition.filter).length > 0) {
            this.rqInfo.rq.detailUpdate = 'true';
        } else {
            this.rqInfo.rq.condition = _.omit(this.rqInfo.rq.condition, 'filter');
            this.rqInfo.rq.detailUpdate = 'false';
        }

        this.rqInfo.rq.condition.limits = [0, 10]; // 페이지 초기화
        this.rqInfo.rq = { ...this.rqInfo.rq, transactionSetId: this.transactionSetId };
        const rsData = this.activityComServiceService.beforeEncodingRq(_.cloneDeep(this.rqInfo));

        // 결과페이지 라우터 이동
        const qsStr = qs.stringify(rsData);
        const path = ActivityEnums.PAGE_SEARCH_RESULT + qsStr;

        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }

    /**
     * 체크된 필터 값 FormArray 에 추가
     * 여러번 필터 적용 시,
     * 이전 필터값이 store에 저장 안되는 현상 방지
     *
     * @param filter forFilter 데이터
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
     * onCheckboxChange
     * 체크 박스 체크
     *
     * @param {any} event 폼 이벤트
     * @param {string} formTargetName 전체 선택한 셀렉트
     * @param {string} viewTargetName 전체 선택한 셀렉트
     */
    public onCheckboxChange(event: any, formTargetName: string, viewTargetName: string) {
        event && event.preventDefault();

        const formArray: FormArray = this.mainForm.get(`${formTargetName}`) as FormArray;

        switch (event.target.value) {
            case 'on':
            case 'off':
                formArray.clear();

                this.vm[viewTargetName].map(
                    (item: any) => {
                        if (event.target.checked) {
                            item.checked = true;
                            formArray.push(new FormControl(item.code));
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
                    formArray.controls.map(
                        (item: FormControl, index: number) => {
                            if (String(item.value) === String(event.target.value)) {
                                formArray.removeAt(index);
                                return;
                            }
                        }
                    );
                }

                this.vm[viewTargetName].map(
                    (item: any) => {
                        if (String(item.code) === String(event.target.value)) {
                            item.checked = event.target.checked;
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
     * resetModalData
     * 모델 초기화
     */
    private resetModalData(): void {
        this.resetText();
        this.mainFormCreate();
        // 요금 초기화
        Object.entries(this.vm).map(
            ([key, item]) => {
                if (
                    this.vm[key] !== undefined &&
                    this.vm[key] !== null
                ) {
                    if (key.indexOf('All') > -1) {
                        this.vm[key] = false;
                    } else if (item && (item.constructor === Array)) {
                        this.vm[key].map(
                            (subItem: any) => {
                                subItem.checked = false;
                            }
                        );
                    } else {
                        switch (key) {
                            case 'amount':
                            case 'reviewAverage':
                            case 'duration':
                                this.vm[key] = {
                                    value: [this[key + 'Min'], this[key + 'Max']],
                                    min: this[key + 'Min'],
                                    max: this[key + 'Max'],
                                    setMin: this[key + 'Min'],
                                    setMax: this[key + 'Max'],
                                    rangeMin: this[key + 'Min'],
                                    rangeMax: this[key + 'Max'],
                                    ctx: this.ctx
                                };
                                break;
                        }
                    }
                }
            }
        );
    }

    /**
     * onCloseClick
     * 팝업 닫음
     *
     * @param {any} event 폼 이벤트
     */
    public onCloseClick(event: any): void {
        event && event.preventDefault();

        this.modalClose();
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


    public onTagMoreClick(event: any): void {
        event && event.preventDefault();

        this.vm.tagsDetail = !this.vm.tagsDetail;
        this.vm.tagsCount = this.vm.tagsDetail ? 5 : this.vm.airlines.length;
    }
}
