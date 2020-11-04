import { Component, Inject, OnInit, PLATFORM_ID, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { takeWhile, take } from 'rxjs/operators';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

import { getSelectId } from 'src/app/store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.selectors';
import { upsertHotelModalDetailOption, clearHotelModalDetailOptions } from 'src/app/store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.actions';
import * as hotelSearchResultPageSelectors from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { HotelComService } from '../../services/hotel-com-service/hotel-com-service.service';

@Component({
    selector: 'app-hotel-modal-detail-option',
    templateUrl: './hotel-modal-detail-option.component.html',
    styleUrls: ['./hotel-modal-detail-option.component.scss']
})
export class HotelModalDetailOptionComponent extends BaseChildComponent implements OnInit, AfterViewInit, OnDestroy {
    updateModel: object = {
        id: 'hotelDetailOpt'
    };

    element: any;
    detailForm: FormGroup; // 생성된 폼 저장
    ctx: any = this;
    starAllchecked: boolean = false;

    /**
      * 호텔 재검색 에서 모달창 오픈 시
      * isResearch = true
      */
    isResearch: boolean = false;

    /**
     * 가격대 슬라이드 옵션
     */
    priceMin: number = 0;
    priceMax: number = 1000000;

    /**
     * 이용자 평점 슬라이드 옵션
     */
    reviewMin: number = 0;
    reviewMax: number = 5;
    reviewStep: number = 0.5;

    vm: any = {
        priceRanges: {
            val: [this.priceMin, this.priceMax],
            min: this.priceMin,
            max: this.priceMax,
            enabled: true,
            ctx: this.ctx
        },
        reviewRatings: {
            val: [this.reviewMin, this.reviewMax],
            min: this.reviewMin,
            max: this.reviewMax,
            step: this.reviewStep,
            enabled: true,
            ctx: this.ctx
        },
        starRatings: null,
        detailInfo: null
    };

    hotelListRq: any;
    hotelDetailOpt: any;
    modalDetailOpt: object;

    rxAlive: boolean = true;
    loadingBool: boolean = false;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private route: ActivatedRoute,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private el: ElementRef,
        private comService: HotelComService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.subscriptionList = [];
        this.detailFormCreate();
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        if (data.resolveData)
                            this.isResearch = data.resolveData.isResearch;
                    }
                )
        );

        this.subscribeInit();
        //필터 셋팅
        this.modalDataInit();
    }

    ngAfterViewInit(): void {
        this.loadingBool = true;
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

    private subscribeInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelSearchResultPageSelectors.getSelectId('hotel-list-rq-info')),
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelListRq observableInit > subscribe]', ev);
                        if (ev) {
                            this.hotelListRq = _.cloneDeep(ev.res);
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.store
                .pipe(
                    select(getSelectId(['hotelDetailOpt'])),
                    takeWhile(() => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('[DetailOption observableInit > subscribe]', ev);
                        if (ev) {
                            this.hotelDetailOpt = _.cloneDeep(ev);
                        }
                    }
                )
        );
    }

    /**
     * 폼 생성
     */
    detailFormCreate() {
        this.detailForm = this.fb.group({
            priceList: this.fb.array([], []),  // 요금범위
            reviewRatingList: this.fb.array([], []), //이용자 평점
            starRatingList: this.fb.array([])// 호텔 성급
        });
    }

    get starRatingList(): FormArray { return this.detailForm.get('starRatingList') as FormArray; }

    addStarRatingList(bool: boolean) {
        this.starRatingList.push(this.fb.control(bool));
    }
    /**
     * 필터 셋팅
     */
    modalDataInit() {
        console.info('[$dtail.val]');

        this.vm.starRatings = [];

        /**
         * 호텔 등급
         * 2~5등급 데이터 셋팅
         */
        for (let index = 0; index < 5; index++) {
            this.addStarRatingList(false);
        }

        if (this.hotelDetailOpt) {  //모달 창에서 선택된 필터 값
            console.info('모달창 선택된  필터값 있음');
            this.modalDetailOpt = this.hotelDetailOpt;
        } else if (this.isResearch) {
            /**
             * 재검색 에서 모달창 오픈 시
             */
            console.info('메인에서 선택된  필터값 있음');

            const detail = this.hotelListRq.detail;
            let dObj: any = {};
            if (detail) {
                dObj = this.comService.deCodingDetailOpt(detail);
            }

            this.modalDetailOpt = dObj;
        }

        /**
         * 선택한 필터가 있을 경우
         * 값 셋팅
         */
        if (this.modalDetailOpt) { // 선택한 필터가 있을 경우
            console.info('[dtail]', this.modalDetailOpt);
            //이용 범위
            //_.has(this.modalDetailOpt, "priceRanges")
            if (_.has(this.modalDetailOpt, 'priceRanges')) {
                console.info('priceRanges 선택된 필터 있음');
                this.vm.priceRanges = {
                    val: [Number(this.modalDetailOpt['priceRanges'].min), Number(this.modalDetailOpt['priceRanges'].max)],
                    min: this.priceMin,
                    max: this.priceMax,
                    enabled: true,
                    ctx: this.ctx
                };
            }

            //이용자 평점
            if (_.has(this.modalDetailOpt, 'reviewRatings')) {
                console.info('reviewRatings 선택된 필터 있음');
                this.vm.reviewRatings = {
                    val: [Number(this.modalDetailOpt['reviewRatings'].min), Number(this.modalDetailOpt['reviewRatings'].max)],
                    min: this.reviewMin,
                    max: this.reviewMax,
                    step: this.reviewStep,
                    enabled: true,
                    ctx: this.ctx
                };
            }

            //호텔 성급
            if (_.has(this.modalDetailOpt, 'starRatings')) {
                console.info('starRatings 선택된 필터 있음');
                this.starAllchecked = false;
                /**
                 * 체크된 필터 값 FormArray 에 추가
                 * 여러번 필터 적용 시,
                 * 이전 필터값이 store에 저장 안되는 현상 방지
                 */
                this.setStarChecked();
            }
        } else {
            console.info('메인에서 선택된 필터 없음');
        }
    }

    deCodObject($objStr) {
        console.info('objStr', $objStr);
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * 호텔등급 항목과 일치하는 체크박스 선택하기
     */
    setStarChecked() {
        /**
         * 선택된 값, form update
         */
        const filteredStar = this.modalDetailOpt['starRatings']; // array
        _.forEach(this.starRatingList.value, ($star, index) => {
            const start = 5 - Number(index);
            const ratingTxt = _.toString(start.toFixed(1));
            const bool: boolean = _.some(filteredStar, (e) => e === ratingTxt);
            if (bool)
                this.starRatingList.controls[Number(index)].setValue(true);
        });

        /**
         * 모두 체크됐을시 전체 체크
         */
        const isTotChk = _.every(this.starRatingList.value);
        if (isTotChk) {
            this.starAllchecked = true;
        } else {
            this.starAllchecked = false;
        }

    }

    modelInit() {
        // 업데이트 모델 초기화
        this.updateModel = {
            id: 'hotelDetailOpt',
            priceRanges: {
                min: this.vm.priceRanges.val[0],
                max: this.vm.priceRanges.val[1]
            },
            reviewRatings: {
                min: this.vm.reviewRatings.val[0],
                max: this.vm.reviewRatings.val[1]
            },
            starRatings: this.vm.starRatings,
            detailInfo: this.vm.detailInfo
        };
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelModalDetailOption({
            hotelModalDetailOption: $obj
        }));
    }


    public onReloadClick(event: any) {
        event && event.preventDefault();

        console.info('초기화');
        this.vm.priceRanges = {
            val: [this.priceMin, this.priceMax],
            min: this.priceMin,
            max: this.priceMax,
            enabled: true,
            ctx: this.ctx
        };
        this.vm.reviewRatings = {
            val: [this.reviewMin, this.reviewMax],
            min: this.reviewMin,
            max: this.reviewMax,
            step: this.reviewStep,
            enabled: true,
            ctx: this.ctx
        };
        this.vm.detailInfo = null;
        // 호텔 성급 초기화
        this.starCheckReload();
    }
    /**
     * 호텔 성급 초기화
     * 선택된 박스 체크 해제 후, 전체 선택 체크
     */
    starCheckReload() {
        this.starAllchecked = false;
        this.starRatingList.controls.forEach(
            (item: any) => {
                item.setValue(false);
            }
        );
    }

    public onCloseClick(event: any) {
        event && event.preventDefault();

        console.info('모달 닫기');
        this.modalClose();
    }

    /**
     * 전체선택
     * @param e
     * @param $dataStr 데이터
     * @param $tgStr 체크박스 data-target
     */
    onCheckboxTotChange(e, $tgStr) {
        const tgElList = this.element.querySelectorAll(`[data-target="${$tgStr}"] input[type='checkbox']`);
        // }
        if (e.target.checked) {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = true;
                this.starRatingList.controls[index].setValue(true);
            });
        }
        else {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = false;
                this.starRatingList.controls[index].setValue(false);
            });
        }
    }

    /**
     * 체크박스
     * @param e
     * @param $fbGrpKey 폼 그룹 key
     */
    onCheckboxChange(e, $idx) {
        let chkBool: boolean = true;
        //checked false 경우
        if (!e.target.checked) {
            chkBool = false;
        }

        //form update
        this.starRatingList.controls[$idx].setValue(chkBool);


        //모든 동의 checkbox checked
        const isTotChk = _.every(this.starRatingList.value);
        const totChk = this.element.querySelector(`[data-target="starAllChk"] input[type='checkbox']`);
        if (isTotChk) { // 모두 동의
            totChk.checked = true;
        } else {
            totChk.checked = false;
        }

        console.info('onCheckboxChange', this.starRatingList.value);
    }

    /**
     * 적용하기
     * 1. hotel-list-rq 스토어에 저장
     * @param $form
     */
    onSubmit() {
        this.store.dispatch(clearHotelModalDetailOptions());
        setTimeout(() => {
            const updateObj: any = {};
            if (!(this.priceMin == this.vm.priceRanges.val[0] && this.priceMax == this.vm.priceRanges.val[1])) {
                console.info('priceMin *****************');
                updateObj.priceRanges = {
                    min: this.vm.priceRanges.val[0],
                    max: this.vm.priceRanges.val[1]
                };
            }

            if (!(this.reviewMin == this.vm.reviewRatings.val[0] && this.reviewMax == this.vm.reviewRatings.val[1])) {
                console.info('reviewMin *****************');
                updateObj.reviewRatings = {
                    min: this.vm.reviewRatings.val[0],
                    max: this.vm.reviewRatings.val[1]
                };
            }

            //호텔 성급
            const starAllFalse = _.every(this.starRatingList.value, (item) => item === false);
            if (!starAllFalse) {
                _.forEach(this.starRatingList.value, ($item, index) => {
                    console.info('$item ' + $item);
                    if ($item) {
                        const star = 5 - _.toNumber(index);
                        const returntxt = _.toString(star.toFixed(1));
                        console.log(returntxt);
                        this.vm.starRatings.push(returntxt);
                    }
                });
                updateObj.starRatings = _.sortBy(this.vm.starRatings);
            }
            if (updateObj) {
                updateObj.id = 'hotelDetailOpt';
                this.updateModel = updateObj;
                // 데이터 업데이트
                console.info('[onSubmit > upsertOne]', this.updateModel);
                this.upsertOne(this.updateModel);
            }
        });

        this.modalClose();
    }
}

