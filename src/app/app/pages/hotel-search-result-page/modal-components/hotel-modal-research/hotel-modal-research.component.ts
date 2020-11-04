import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertHotelMainSearch } from '../../../../store/hotel-main-page/hotel-main-search/hotel-main-search.actions';
import * as hotelModalDestinationSelectors from '../../../../store/hotel-common/hotel-modal-destination/hotel-modal-destination.selectors';
import * as hotelModalCalendarSelectors from '../../../../store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.selectors';
import * as hotelModalTravelerOptionSelectors from '../../../../store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.selectors';
import * as hotelModalDetailOptionSelectors from '../../../../store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.selectors';
import * as hotelSearchResultPageSelectors from '../../../../store/hotel-search-result-page/hotel-search-result/hotel-search-result.selectors';
import { clearHotelModalDestinations } from '../../../../store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
import { clearHotelModalCalendars } from '../../../../store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { clearHotelModalTravelerOptions } from '../../../../store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import { clearHotelModalDetailOptions } from '../../../../store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as qs from 'qs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { HotelComService } from '@/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { StoreCategoryTypes } from '../../../../common-source/enums/store-category-types.enum';

import { ModalDestinationComponent } from '@/app/common-source/modal-components/modal-destination/modal-destination.component';
import { HotelModalDetailOptionComponent } from '@/app/common-source/modal-components/hotel-modal-detail-option/hotel-modal-detail-option.component';
import { CommonModalCalendarComponent } from '@/app/common-source/modal-components/common-modal-calendar/common-modal-calendar.component';
import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { environment } from '@/environments/environment';


@Component({
    selector: 'app-hotel-modal-research',
    templateUrl: './hotel-modal-research.component.html',
    styleUrls: ['./hotel-modal-research.component.scss']
})
export class HotelModalResearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup; // 생성된 폼 저장
    rqInfo: any;

    vm: any = {
        hotelCity: null,
        travelerInfo: null,
        detailInfo: null,
        checkDate: null,
        checkDateInOut: null,
        hotelTravelerOption: null,
        detailOption: null,
        amounts: null,
        reviewRatings: null,
        starRatings: null
    };

    rxAlive: boolean = true;
    modalhotelCity$: Observable<any>; //도시 or 공항 검색
    modalHotelCalendar$: Observable<any>; //여행날짜
    modalHotelTravelerOption$: Observable<any>; //인원 선택
    modalHotelDetailOption$: Observable<any>;   //상세 옵션

    hotelListRq$: Observable<any>; // 호텔 검색 request

    loadingBool: boolean = false;


    bsModalDestinatioRef: any;
    bsModalCalendarRef: any;
    bsModalRoomRef: any;
    bsModalDetailOptionRef: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private bsModalService: BsModalService,
        private comHotelS: HotelComService,
        public bsModalRef: BsModalRef,
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        super.ngOnInit();
        this.storeHotelCommonInit(); // store > hotel-common 초기화
        this.vmInit(); // vm 초기화
        this.mainFormInit(); // 폼 초기화
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.modalClose();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
    }

    /**
     * store > hotel-common 초기화
     */
    storeHotelCommonInit() {
        console.info('[0. store > hotel-common 초기화]');
        this.store.dispatch(clearHotelModalDestinations());
        this.store.dispatch(clearHotelModalCalendars());
        this.store.dispatch(clearHotelModalTravelerOptions());
        this.store.dispatch(clearHotelModalDetailOptions());
    }

    /**
     * vm 초기화
     */
    vmInit() {
        console.info('[vm 초기화]');
        this.vm.hotelCity = {};

        this.vm.checkDate = {};

        this.vm.hotelTravelerOption = {};

        this.vm.detailOption = {};
    }

    rqInfoInit() {
        setTimeout(() => {
            console.info('[rqInfo 셋팅]', this.rqInfo.cityName);
            // this.vm.hotelCity = this.rqInfo.hotelCity;
            // this.vm.checkDate = this.rqInfo.checkDate;
            const lang = this.translateService.getDefaultLang();
            const chkIn = moment(this.rqInfo.chkIn, 'YYYY-MM-DD');
            const chkOut = moment(this.rqInfo.chkOut, 'YYYY-MM-DD');
            const dayDiff = chkOut.diff(chkIn, 'days'); //여행일수
            let dayTxt = '';
            if (lang == 'ko') {
                dayTxt = '박';
            } else {
                if (dayDiff > 1)
                    dayTxt = 'nights';
                else
                    dayTxt = 'night';
            }

            this.vm.hotelCity.name = this.rqInfo.cityName;
            this.vm.hotelCity.val = this.rqInfo.city;
            this.vm.hotelCity.codeName = this.rqInfo.cityGubun;
            this.vm.checkDate.in = this.rqInfo.chkIn;
            this.vm.checkDate.out = this.rqInfo.chkOut;
            this.vm.hotelTravelerOption.roomList = this.rqInfo.roomList;

            this.vm.checkInOutDate = moment(this.rqInfo.chkIn.toString()).locale(lang).format('MM/DD (ddd)');
            this.vm.checkInOutDate += '-';
            this.vm.checkInOutDate += moment(this.rqInfo.chkOut.toString()).locale(lang).format('MM/DD (ddd)');
            this.vm.checkInOutDate += ' ' + dayDiff + dayTxt;

            this.vm.travelerInfo = this.comHotelS.getTravelerInfo(this.rqInfo.roomList, true);

            if (_.has(this.rqInfo, 'detail')) {
                const detail = this.rqInfo.detail;
                const dObj = this.comHotelS.deCodingDetailOpt(detail);
                this.vm.detailInfo = this.comHotelS.getDetailOptInfo(dObj);
                this.vm.detailOption = detail;
            }


            this.mainForm.get('hotelCity').setValue(this.rqInfo.cityName);
            this.mainForm.get('checkDate').setValue(this.vm.checkDate);
            this.mainForm.get('checkInOutDate').setValue(this.vm.checkInOutDate);

            this.mainForm.get('hotelTravelerOption').setValue(this.vm.hotelTravelerOption);
            this.mainForm.get('travelerInfo').setValue(this.vm.travelerInfo);

            this.mainForm.get('detailOption').setValue(this.vm.detailOption);
            this.mainForm.get('detailInfo').setValue(this.vm.detailInfo);

        });

    }

    /**
     * 옵져버블 초기화
     */
    observableInit() {
        this.modalhotelCity$ = this.store
            .pipe(select(hotelModalDestinationSelectors.getSelectId(['hotelCity'])));
        this.modalHotelCalendar$ = this.store
            .pipe(select(hotelModalCalendarSelectors.getSelectId(['hotelCalendar'])));
        this.modalHotelTravelerOption$ = this.store
            .pipe(select(hotelModalTravelerOptionSelectors.getSelectId(['hotelTravelerOption'])));
        this.modalHotelDetailOption$ = this.store
            .pipe(select(hotelModalDetailOptionSelectors.getSelectId(['hotelDetailOpt'])));
        this.hotelListRq$ = this.store
            .pipe(select(hotelSearchResultPageSelectors.getSelectId('hotel-list-rq-info')));
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {

        /**
         * 도시 검색
         */
        this.subscriptionList.push(
            this.modalhotelCity$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalhotelCity$ > subscribe]', ev);
                        if (ev) {
                            this.vm.hotelCity = ev;
                            console.info('[vm.hotelCity]', this.vm.hotelCity);
                            this.mainForm.patchValue({
                                hotelCity: this.vm.hotelCity.val,
                                hotelCityName: this.vm.hotelCity.name
                            });
                        }
                    }
                )
        );

        /**
         * 여행 날짜
         */
        this.subscriptionList.push(
            this.modalHotelCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev) => {
                        console.info('[modalHotelCalendar$ > subscribe]', ev);
                        if (ev) {
                            this.vm.checkDate.in = moment(ev.result.selectList[0].toString()).format('YYYY-MM-DD');
                            this.vm.checkDate.out = moment(ev.result.selectList[1].toString()).format('YYYY-MM-DD');
                            this.vm.checkInOutDate = this.makeCheckInOutTxt(this.vm.checkDate);

                            this.mainForm.patchValue({
                                checkDate: this.vm.checkDate
                            });
                            this.mainForm.patchValue({
                                checkInOutDate: this.vm.checkInOutDate
                            });
                        }
                    }
                )
        );

        /**
         * 객실 수, 인원 수
         */
        this.subscriptionList.push(
            this.modalHotelTravelerOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelTravelerOption$ > subscribe]', ev);
                        if (ev) {
                            console.info('[vm.hotelTravelerOption]');
                            this.vm.hotelTravelerOption = ev;
                            this.vm.travelerInfo = this.comHotelS.getTravelerInfo(this.vm.hotelTravelerOption.roomList, true);
                            this.mainForm.patchValue({
                                travelerInfo: this.vm.travelerInfo
                            });
                            this.mainForm.patchValue({
                                hotelTravelerOption: this.vm.hotelTravelerOption
                            });
                        }
                    }
                )
        );

        /**
         * 상세 검색
         */
        this.subscriptionList.push(
            this.modalHotelDetailOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelDetailOption$ > subscribe]', ev);
                        if (ev) {
                            this.vm.detailOption = _.cloneDeep(ev);
                            this.vm.detailInfo = this.comHotelS.getDetailOptInfo(this.vm.detailOption);
                            this.mainForm.patchValue({
                                detailOption: this.vm.detailOption
                            });
                            this.mainForm.patchValue({
                                detailInfo: this.vm.detailInfo
                            });
                        } else {
                            this.mainForm.get('detailOption').setValue(null);
                            this.mainForm.get('detailInfo').setValue(null);
                        }
                    }
                )
        );

        /**
         * 호텔 검색 RQ
         */
        this.subscriptionList.push(
            this.hotelListRq$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelListRq$ > subscribe]', ev);
                        if (ev) {
                            this.rqInfo = _.cloneDeep(ev.res);
                            this.rqInfoInit();
                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );
    }

    /**
     * 폼 초기화
     */
    mainFormInit() {
        this.mainFormCreate();
    }

    /**
     * 폼 생성
     * 빌더를 통해 폼을 생성한다.
     * key : html에서 [formControlName] 통해 전달 받은 문자열과 맵핑한다.
     * value : 셋팅할 데이터 정의 한다.
     *
     */
    mainFormCreate() {
        this.mainForm = this.fb.group({
            hotelCity: [this.vm.hotelCity.val, Validators.required],
            hotelCityName: [this.vm.hotelCity.name],
            checkDate: [this.vm.checkDate, Validators.required],
            checkInOutDate: [this.vm.checkDateInOut, Validators.required],
            hotelTravelerOption: [this.vm.hotelTravelerOption, Validators.required],
            travelerInfo: [this.vm.hotelTravelerOption.travelerInfo, Validators.required],
            detailOption: [this.vm.detailOption],
            detailInfo: [this.vm.detailInfo]
        });
    }

    /**
    * 3. 결과페이지로 페이지 이동
    */
    goToResultPage($form) {
        const checkInDate = `${moment($form.value.checkDate.in).format('YYYY-MM-DD')}`;
        const checkOutDate = `${moment($form.value.checkDate.out).format('YYYY-MM-DD')}`;
        console.info('goToResultPage' + $form.value);
        /**
         * 호텔 결과 페이지 Request Data Model
         * environment.STATION_CODE
         */
        const rqInfo = {
            city: this.vm.hotelCity.val,
            cityGubun: this.vm.hotelCity.codeName,
            cityName: this.vm.hotelCity.name,
            chkIn: checkInDate,
            chkOut: checkOutDate,
            roomList: this.vm.hotelTravelerOption.roomList
        };

        if (!_.isEmpty(this.vm.detailOption)) {
            const detailObj: object = {};
            let price: string;
            let review: string;
            let star: string;
            if (_.has(this.vm.detailOption, 'priceRanges'))
                price = this.makeObjStr(this.vm.detailOption.priceRanges);

            if (_.has(this.vm.detailOption, 'reviewRatings'))
                review = this.makeObjStr(this.vm.detailOption.reviewRatings);

            if (_.has(this.vm.detailOption, 'starRatings'))
                star = this.makeObjStr(this.vm.detailOption.starRatings);

            if (!_.isEmpty(price))
                detailObj['price'] = price;

            if (!_.isEmpty(review))
                detailObj['review'] = review;

            if (!_.isEmpty(star))
                detailObj['star'] = star;

            rqInfo['detail'] = detailObj;
        }

        console.info('[데이터 rqInfo]', rqInfo);

        const qsStr = qs.stringify(rqInfo);
        const path = '/hotel-search-result/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }

    makeObjStr(obj) {
        const list = [];
        _.forEach(obj, (v1) => {
            list.push(v1);
        });

        const returnStr = _.join(list, '@');
        console.info('makeObjStr', returnStr);
        return returnStr;
    }

    /**
     * 목적지 검색 이동
     */
    goToHotelModalDestination($itemCategoryCode, $storeId) {
        /**
         * 아이템 카테고리 코드
         * IC01 항공
         * IC02 호텔
         * IC03 렌터카
         * IC04 액티비티
         * IC05 일정표
         */
        const itemCategoryCode = $itemCategoryCode;
        const storeId = $storeId;

        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            majorDestinationRq: {
                rq: {
                    currency: 'KRW',
                    language: 'KO',
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: itemCategoryCode,
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
                        itemCategoryCode: itemCategoryCode,
                        keyword: null,
                        limits: [0, 20]
                    }
                },
            }
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);

        this.bsModalDestinatioRef = this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelMainSearch({
            hotelMainSearch: $obj
        }));
    }

    /**
     * 호텔 장소 검색 클릭
     */
    onHotelCity() {
        console.info('[호텔 장소 검색 클릭]');
        this.goToHotelModalDestination('IC02', 'hotelCity');
    }

    // 객실 수, 인원 수 선택
    onHotelTravelerOption() {
        console.info('[호텔 룸타입 선택 >> 객실 수, 인원 수 선택]');
        this.comHotelS.openHotelTravelerOption({ isResearch: true });
    }

    onHotelDetailOption() {
        console.info('[호텔 메인 >> 상세 검색 모달]');
        const initialState = {
            isResearch: true
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);
        this.bsModalDetailOptionRef = this.bsModalService.show(HotelModalDetailOptionComponent, { initialState, ...configInfo });
    }

    /**
     * 여행날짜 클릭
     */
    onDateClick() {
        console.info('[여행날짜]');
        this.openCalendar();
    }
    onCloseClick(e) {
        console.info('모달 닫기');
        this.modalClose();
    }


    /**
      * 달력 팝업
      */
    openCalendar() {
        console.info('[달력 팝업]');

        const itemCategoryCode = 'IC02';
        const storeId = 'hotelCalendar';

        // 모달 전달 데이터
        const initialState = {
            storeCategoryType: StoreCategoryTypes.HOTEL,
            storeId: storeId,

            step: 0,
            totStep: 2,
            tabTxtList: ['체크인', '체크아웃'],
            selectList: [],

            // step: 1,
            // totStep: 2,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-08'],

            // step: 2,
            // totStep: 2,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-06', '2020-04-09'],

            // step: 3,
            // totStep: 3,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-08', '2020-04-12', '2020-04-15'],

            // step: 4,
            // totStep: 4,
            // tabTxtList: ['대여일', '반납일', '마지막'],
            // selectList: ['2020-04-10', '2020-04-12', '2020-04-14', '2020-04-16'],

            rq: {
                currency: 'KRW',
                language: 'KO',
                stationTypeCode: environment.STATION_CODE,
                condition: {
                    itemCategoryCode: itemCategoryCode
                }
            }
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        console.info('[initialState]', initialState);


        // this.subscriptionList.push(
        //     this.modalHotelCalendar$
        //         .pipe(take(1))
        //         .subscribe(
        //             (ev: any) => {
        //                 console.info('[modalCalendar$ > subscribe]', ev);
        //                 if (ev) {
        //                     initialState.step = ev.result.step;
        //                     initialState.totStep = ev.result.totStep;
        //                     initialState.tabTxtList = ev.result.tabTxtList;
        //                     initialState.selectList = ev.result.selectList;
        //                 } else {
        //                     if (this.vm.checkDate.in && this.vm.checkDate.out) {
        //                         initialState.step = 2;
        //                         initialState.totStep = 2;
        //                         initialState.selectList[0] = this.vm.checkDate.in;
        //                         initialState.selectList[1] = this.vm.checkDate.out;
        //                     }
        //                 }
        //             }
        //         )
        // );
        this.bsModalCalendarRef = this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });

    }

    makeCheckInOutTxt($checkDate) {
        const lang = this.translateService.getDefaultLang();

        const chkIn = moment($checkDate.in, 'YYYY-MM-DD');
        const chkOut = moment($checkDate.out, 'YYYY-MM-DD');
        const dayDiff = chkOut.diff(chkIn, 'days'); //여행일수
        let dayTxt = '';
        if (lang == 'ko') {
            dayTxt = '박';
        } else {
            if (dayDiff > 1)
                dayTxt = 'nights';
            else
                dayTxt = 'night';
        }
        let txt = moment($checkDate.in.toString()).locale(lang).format('MM/DD (ddd)');
        txt += '-';
        txt += moment($checkDate.out.toString()).locale(lang).format('MM/DD (ddd)');
        txt += ' ' + dayDiff + dayTxt;
        return txt;
    }

    /**
     * 1. 유효성 체크
     * 2. vm 스토어에 저장
     * 3. 결과페이지로 페이지 이동
     * @param $form
     */
    onSubmit($form: any) {
        setTimeout(() => {
            console.info('[onSubmit]', $form, $form.value);
            console.info('[vm]', this.vm);

            if ($form.valid) {
                this.rxAlive = false;
                console.info('[1. 유효성 체크 성공]');
                const codeName = this.vm.hotelCity.codeName;
                if (codeName == 'hotels') {
                    // 3. 호텔 룸타입 선택 페이지 이동
                    this.comHotelS.onDstinationHotelDtl(this.vm);
                } else {
                    // 3. 결과페이지로 페이지 이동
                    this.goToResultPage($form);
                }

                this.modalClose();
            } else {

                _.forEach($form.controls,
                    ($val, $key) => {
                        if (!$val.valid) {
                            console.info('[$key | 유효성 체크 실패]', $key);
                            return false;

                            // switch ($key) {
                            //   case 'locationAccept':
                            //     break;
                            //   case 'formDateStr':
                            //     break;
                            //   case 'formTimeVal':
                            //     break;
                            //   case 'toDateStr':
                            //     break;
                            //   case 'toTimeVal':
                            //     break;
                            // }

                        }

                    }
                );

            }

        }); // end setTimeout

    } // end onSubmit

}
