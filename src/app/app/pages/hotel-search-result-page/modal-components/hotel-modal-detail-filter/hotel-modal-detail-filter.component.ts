import { Component, Inject, OnInit, PLATFORM_ID, ElementRef, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getSelectId } from '@/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';

import {
    HotelTypeCheckBoxParam,
    BreakfastCheckBoxParam,
    BreakfastCheckBoxParamSet,
    ChainsCheckBoxParam,
    StarRatingCheckBoxParam
} from './models/hotel-modal-detail-filter.model';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-modal-detail-filter',
    templateUrl: './hotel-modal-detail-filter.component.html',
    styleUrls: ['./hotel-modal-detail-filter.component.scss']
})
export class HotelModalDetailFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    modalForm: FormGroup; // 생성된 폼 저장
    rqInfo: any;
    hotelSearchRes: any;
    hotelTransactionSetId: any;
    vm: any = {
        reload: '초기화',
        dSearch: '상세 검색',
        close: '닫기',
        all: '전체',
        allSel: '전체선택',
        startGrade: '성급',
        submit: '적용하기',
        placeholder: '찾고 있는 호텔명을 검색하세요',
        won: '원',
        hotelName: '',
        amount: null,
        starRatings: null,
        starRatingsAll: false,
        hotelTypes: null,
        hotelTypesAll: false,
        freeBreakfast: null,
        freeBreakfastAll: false,
        attractions: null,
        attractionsAll: false,
        reviewRatings: null,
        chains: null,
        chainsAll: false,
    };

    /**
    * 가격대 슬라이드 옵션
    */
    priceMin: number;
    priceMax: number;

    /**
     * 이용자 평점 슬라이드 옵션
     */
    reviewMin: number;
    reviewMax: number;
    reviewStep: number = 0.5;

    ctx: any = this;  // 현재 페이지 지시자

    hotelListRq$: Observable<any>;
    hotelListRes$: Observable<any>;

    all: boolean = false;
    rxAlive: boolean = true;
    loadingBool: Boolean = false;

    public breakfastCheckBoxParamList: BreakfastCheckBoxParam[];
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        private router: Router,
        private fb: FormBuilder,
        public el: ElementRef,
        public bsModalRef: BsModalRef,
        private comService: HotelComService
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.breakfastCheckBoxParamList = BreakfastCheckBoxParamSet;
        this.subscriptionList = [];
        this.modalFormCreate();
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.observableInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
    * modalFormCreate
    * 폼 생성
    */
    private modalFormCreate(): void {
        this.modalForm = this.fb.group({
            hotelName: [this.vm.hotelName], // 호텔명
            amount: this.fb.array([]),  // 가격대
            starRatingList: this.fb.array([]), // 호텔 성급
            hotelTypeList: this.fb.array([]), // 숙소 유형
            freeBreakfastList: this.fb.array([]), // 조식
            attractionList: this.fb.array([]), // 인근 지역
            reviewRatingList: this.fb.array([]), //이용자 평점
            chainList: this.fb.array([]) //호텔 체인
        });
    }

    /**
     * 옵저버블 초기화
     */
    observableInit() {
        this.hotelListRq$ = this.store
            .pipe(select(getSelectId(['hotel-list-rq-info'])));
        this.hotelListRes$ = this.store
            .pipe(select(getSelectId(['hotel-search-result'])));
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        console.info('[modal_detial_filter >> subscribeInit]');

        this.subscriptionList.push(
            this.hotelListRq$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelListRq$ > subscribe]', ev);
                        if (ev) {
                            this.rqInfo = _.cloneDeep(ev.res);
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.hotelListRes$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelListRes$ > subscribe]', ev);
                        if (ev) {
                            this.hotelSearchRes = _.cloneDeep(ev.res.result);
                            this.hotelTransactionSetId = _.cloneDeep(ev.res.transactionSetId);
                            this.filterDataInit(this.hotelSearchRes);
                            this.loadingBool = true;
                        }
                    }
                )
        );
    }

    /**
     * 필터 셋팅
     * hotel/list rs 값을 통해 필터 값 셋팅
     */
    filterDataInit($res) {
        console.info('[forFilter]', $res);

        if (_.has($res.forFilter, 'amount')) {
            this.priceMin = Number($res.forFilter.amount.lowestAmount);
            this.priceMax = Number($res.forFilter.amount.highestAmount);
            this.setSliderOption('amount', this.priceMin, this.priceMax, [this.priceMin, this.priceMax]);
        }

        if (_.has($res.forFilter, 'starRatings')) {
            this.vm.starRatings = _.orderBy($res.forFilter.starRatings, ['starRating'], ['desc'])
                .map(
                    (item: any): StarRatingCheckBoxParam => {
                        return { ...item, ...{ checked: false } };
                    }
                );
        }
        if (_.has($res.forFilter, 'hotelTypes')) {
            this.vm.hotelTypes = $res.forFilter.hotelTypes.map(
                (item: any): HotelTypeCheckBoxParam => {
                    return { ...item, ...{ checked: false } };
                }
            );
        }

        this.vm.freeBreakfast = BreakfastCheckBoxParamSet;

        if (_.has($res.forFilter, 'poi')) {
            if (_.has($res.forFilter.poi, 'attractions') && $res.forFilter.poi.attractions.length > 0) {
                this.vm.attractions = $res.forFilter.poi.attractions.map(
                    (item: any): any => {
                        return { ...item, ...{ checked: false } };
                    }
                );
            }
        }

        const review = $res.forFilter.reviewRatings;
        if (_.has($res.forFilter, 'reviewRatings')) {
            console.info('$res.forFilter > reviewRatings');
            this.reviewMin = Number(review.lowestRating);
            this.reviewMax = Number(review.highestRating);
            this.setSliderOption('reviewRatings', this.reviewMin, this.reviewMax, [this.reviewMin, this.reviewMax]);
        }

        if (_.has($res.forFilter, 'chains')) {
            this.vm.chains = $res.forFilter.chains.map(
                (item: any): ChainsCheckBoxParam => {
                    return { ...item, ...{ checked: false } };
                }
            );
        }

        /**
         * 선택한 필터가 있을 경우
         * 값 셋팅
         */
        if ($res.filter) { // 선택한 필터가 있을 경우
            console.info('[res filter]', $res.filter);

            if (_.has($res.filter, 'others')) {
                if (_.has($res.filter.others, 'hotelName')) {
                    this.vm.hotelName = $res.filter.others.hotelName;
                    this.modalForm.get(`hotelName`).setValue($res.filter.others.hotelName);
                }
            }

            if (_.has($res.filter, 'starRatings')) {
                this.addFormArrayFilter($res.filter, 'starRatingList', 'starRatings', 'starRating');
            }

            //가격대
            if (_.has($res.filter, 'amount')) {
                const lowestAmount = Number($res.filter.amount.lowestAmount);
                const highestAmount = Number($res.filter.amount.highestAmount);
                let lowestAmountVal: number = 0;
                let highestAmountVal: number = 0;


                if (this.priceMin < lowestAmount) {  //메인에서 선택한 최소값이 forFilter 값보다 클 경우
                    lowestAmountVal = lowestAmount;
                } else {
                    lowestAmountVal = this.priceMin;
                }

                if (this.priceMax < highestAmount) { //메인에서 선택한 최대값이 forFilter 값보다 클 경우
                    highestAmountVal = this.priceMax;
                } else {
                    highestAmountVal = highestAmount;
                }

                this.vm.amount.val = [lowestAmountVal, highestAmountVal];
            }

            if (_.has($res.filter, 'hotelTypes')) {
                this.addFormArrayFilter($res.filter, 'hotelTypeList', 'hotelTypes', 'code');
            }

            if (_.has($res.filter, 'poi')) {
                if (_.has($res.filter.poi, 'attractions')) {
                    this.addFormArrayFilter($res.filter.poi, 'attractionList', 'attractions', 'code');
                }
            }

            //이용자 평점
            if (_.has($res.filter, 'reviewRatings')) {
                console.info('$res.filtered > reviewRatings');
                const lowestRating = Number($res.filter.reviewRatings.lowestRating);
                const highestRating = Number($res.filter.reviewRatings.highestRating);
                let lowestRatingVal: number = 0;
                let highestRatingVal: number = 0;

                if (this.reviewMin < lowestRating) { //메인에서 선택한 최소값이 forFilter 값보다 클 경우
                    lowestRatingVal = lowestRating;
                } else {
                    lowestRatingVal = this.reviewMin;
                }

                if (this.reviewMax < highestRating) { //메인에서 선택한 최대값이 forFilter 값보다 클 경우
                    highestRatingVal = this.reviewMax;
                } else {
                    highestRatingVal = highestRating;
                }

                this.setSliderOption('reviewRatings', this.reviewMin, this.reviewMax, [lowestRatingVal, highestRatingVal]);
            }

            if (_.has($res.filter, 'chains')) {
                this.addFormArrayFilter($res.filter, 'chainList', 'chains', 'code');
            }
        }

        // 조식포함은 따로 체크
        if (_.has(this.rqInfo, 'filter.others.freeBreakfast')) {
            const deCodeStar = this.comService.deCodingStr(this.rqInfo.filter.others.freeBreakfast, '', '@');

            console.log('whats game : ', deCodeStar);
            /**
             *포함 미포함 모두 선택시
             *체크박스 전체 체크
             */
            if (deCodeStar.length > 0) {
                this.addFormArrayFilter({ 'freeBreakfast': deCodeStar }, 'freeBreakfastList', 'freeBreakfast', 'code');
            }
        }
    }

    /**
     * 체크된 필터가 있을시
     * forfilter and filter 데이터에 항목이 있는지 체크
     */

    filterValueCheck() {

    }

    /**
     * 슬라이더 옵션 세팅
     *  - min max 값이 같은때 화면상에서 보여주지 않는다.
     * @param key
     * @param min
     * @param max
     * @param value
     */
    setSliderOption(key: any, min: number, max: number, value: Array<any>) {
        this.vm[key] = {
            allChk: null,
            isCollapsed: true,
            val: [value[0], value[1]],
            min: min,
            max: max,
            step: 0.5,
            enabled: true,
            display: (min !== max) ? true : false,
            ctx: this.ctx
        };
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
        const formArray: FormArray = this.modalForm.get(`${filterKey}`) as FormArray;

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
     * 적용하기
     * 1. hotel-list-rq 스토어에 저장
     * @param $form
     */
    onSubmit($form: any) {
        this.modalClose();

        console.info('[onSubmit]', $form.value);
        const forFilter = this.hotelSearchRes.forFilter;
        const amount: any = {};
        const others: any = {};
        const poi: any = {};
        const reviewRatings: any = {};
        const filterObj: any = {};

        //호텔명
        if ($form.value.hotelName) {
            others.hotelName = $form.value.hotelName;
        }

        //호텔 성급
        if ($form.value.starRatingList.length > 0) {
            filterObj.starRatings = this.makeObjStr($form.value.starRatingList, '@');
        }

        //가격대
        const lowestAmount = forFilter.amount.lowestAmount;
        const highestAmount = forFilter.amount.highestAmount;
        if (!(lowestAmount == this.vm.amount.val[0] && highestAmount == this.vm.amount.val[1])) {
            amount.lowestAmount = this.vm.amount.val[0];
            amount.highestAmount = this.vm.amount.val[1];
            filterObj.amount = this.makeObjStr(amount, '@');
        }


        //숙소유형
        if ($form.value.hotelTypeList.length > 0) {
            const hotelTypes = _.map($form.value.hotelTypeList, ($item) => {
                return $item;
            });

            filterObj.hotelTypes = this.makeObjStr(hotelTypes, '@');
        }

        //조식포함
        if ($form.value.freeBreakfastList.length > 0) {
            const free = _.map($form.value.freeBreakfastList, ($item) => {
                return $item;
            });
            others.freeBreakfast = this.makeObjStr(free, '@');
        }

        //인근 지역
        if ($form.value.attractionList.length > 0) {
            const attractions = _.map($form.value.attractionList, ($item) => {
                return $item;
            });
            poi.attractions = this.makeObjStr(attractions, '@');
        }
        //이용자 평점
        if ($form.value.reviewRatingList.length > 0) {
            const lowestRating = forFilter.reviewRatings.lowestRating;
            const highestRating = forFilter.reviewRatings.highestRating;

            if (
                lowestRating != this.vm.reviewRatings.val[0] ||
                highestRating != this.vm.reviewRatings.val[1]
            ) {
                reviewRatings.lowestRating = this.vm.reviewRatings.val[0];
                reviewRatings.highestRating = this.vm.reviewRatings.val[1];
                filterObj.reviewRatings = this.makeObjStr(reviewRatings, '@');
            }
        }

        let chainInfo: any = '';
        if ($form.value.chainList.length > 0) {
            _.forEach($form.value.chainList, (codeItem, codeIdx) => {
                chainInfo += this.getChainInfo(codeItem, Number(codeIdx));
            });

            filterObj.chains = chainInfo;
        }

        if (!_.isEmpty(others)) {
            filterObj.others = others;
        }

        if (!_.isEmpty(poi)) {
            filterObj.poi = poi;
        }

        let rq = _.omit(this.rqInfo, 'rq');
        rq.hotelSearchTrd = this.hotelTransactionSetId;
        rq.filter = filterObj;

        console.info('rq', rq);

        /**
         * 결과페이지 이동
         */

        let qsStr = '';
        if (Object.keys(rq.filter).length > 0) {
            rq.detailUpdate = 'true';
        } else {
            rq = _.omit(rq, 'filter');
            rq.detailUpdate = 'false';
        }

        qsStr = qs.stringify(rq);

        const path = '/hotel-search-result/' + qsStr;

        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }

    makeObjStr(obj, gubun) {
        const list = [];
        _.forEach(obj, (v1) => {
            list.push(v1);
        });

        const returnStr = _.join(list, gubun);
        console.info('makeObjStr', returnStr);
        return returnStr;
    }

    /**
   * 체인 rq 정보 encoding
   * @param $chainCode
   * @param $chainIdx
   */
    getChainInfo($chainCode: string, $chainIdx: number) {
        let chainInfo = '';
        let brandInfo = '';

        _.forEach(this.vm.chains, (chainItem, cIdx) => {
            if (chainItem.code === $chainCode) {
                if (_.toNumber($chainIdx) !== 0)
                    chainInfo += '@';

                _.map(chainItem.brands, (brandItem) => {
                    brandInfo += brandItem.code;
                    if (_.toNumber(cIdx) < chainItem.brands.length - 1)
                        brandInfo += ',';
                });
                chainInfo += (chainItem.code + '^' + brandInfo);
            }
        });

        return chainInfo; //ex) code^brandsCode,brandsCode@code^brandsCode,brandsCode
    }

    /**
     * onCheckboxChange
     * 체크 박스 체크
     *
     * @param {any} event 폼 이벤트
     * @param {string} formTargetName 전체 선택한 셀렉트
     * @param {string} viewTargetName 전체 선택한 셀렉트
     */
    public onCheckboxChange(event: any, formTargetName: string, viewTargetName: string): void {
        event && event.preventDefault();

        const formArray: FormArray = this.modalForm.get(`${formTargetName}`) as FormArray;

        // 전체는 value가 on과 off로 확인됨.
        switch (event.target.value) {
            case 'on':
            case 'off':
                formArray.clear();

                this.vm[viewTargetName].map(
                    (item: any): void => {
                        if (event.target.checked) {
                            item.checked = true;

                            if (viewTargetName.indexOf('starRating') > -1) {
                                formArray.push(new FormControl(item.starRating));
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
                    formArray.controls.map(
                        (item: FormControl, index: number): void => {
                            if (String(item.value) === String(event.target.value)) {
                                formArray.removeAt(index);
                                return;
                            }
                        }
                    );
                }

                this.vm[viewTargetName].map(
                    (item: any) => {
                        if (viewTargetName.indexOf('starRating') > -1) {
                            if (String(item.starRating) === String(event.target.value)) {
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
     * resetModalData
     * 모델 초기화
     */
    private resetModalData(): void {
        this.resetText();
        this.modalFormCreate();
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
                    } else if (key === 'amount') {
                        this.setSliderOption(key, this.priceMin, this.priceMax, [this.priceMin, this.priceMax]);
                    } else if (key === 'reviewRatings') {
                        this.setSliderOption(key, this.reviewMin, this.reviewMax, [this.reviewMin, this.reviewMax]);
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

        this.vm.hotelName = '';
        this.modalForm.get('hotelName').setValue('');
    }
}
