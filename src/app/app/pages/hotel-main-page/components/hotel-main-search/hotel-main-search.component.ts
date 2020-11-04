import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile, take } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as hotelMainSearchSelectors from 'src/app/store/hotel-main-page/hotel-main-search/hotel-main-search.selectors';
import * as hotelModalDestinationSelectors from '../../../../store/hotel-common/hotel-modal-destination/hotel-modal-destination.selectors';
import * as hotelModalCalendarSelectors from '../../../../store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.selectors';
import * as hotelModalTravelerOptionSelectors from '../../../../store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.selectors';
import * as hotelModalDetailOptionSelectors from '../../../../store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as qs from 'qs';

import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { environment } from '@/environments/environment';

import { StoreCategoryTypes } from 'src/app/common-source/enums/store-category-types.enum';

import { ModalDestinationComponent } from 'src/app/common-source/modal-components/modal-destination/modal-destination.component';
import { HotelModalDetailOptionComponent } from 'src/app/common-source/modal-components/hotel-modal-detail-option/hotel-modal-detail-option.component';
import { CommonModalCalendarComponent } from 'src/app/common-source/modal-components/common-modal-calendar/common-modal-calendar.component';
import { CommonModalAlertComponent } from 'src/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

//store
import { upsertHotelMainSearch, clearHotelMainSearchs } from 'src/app/store/hotel-main-page/hotel-main-search/hotel-main-search.actions';
import { upsertHotelModalCalendar } from 'src/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { upsertHotelModalTravelerOption } from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import { upsertHotelModalDetailOption } from 'src/app/store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.actions';

@Component({
    selector: 'app-hotel-main-search',
    templateUrl: './hotel-main-search.component.html',
    styleUrls: ['./hotel-main-search.component.scss']
})
export class HotelMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup; // 생성된 폼 저장
    vm: any = {
        title: '<span>항공+호텔</span><span>최대 <span class="color-point2">20%할인</span></span>',
        hotelCity: null,
        checkDate: null,
        checkInOutDate: null,
        hotelTravelerOption: null,
        detailOption: null,
        detailInfo: null
    };

    rxAlive: boolean = true;
    modalhotelCity$: Observable<any>; //도시 or 공항 검색
    modalHotelCalendar$: Observable<any>; //여행날짜
    modalHotelTravelerOption$: Observable<any>; //인원 선택
    modalHotelDetailOption$: Observable<any>;   //상세 옵션
    loadingBool: Boolean = false;
    bsModalRef: BsModalRef;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private bsModalService: BsModalService,
        private comHotelS: HotelComService
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.vmInit();
        this.mainSearchAgainInit();

        // store > hotel-common 초기화
        // this.storeHotelCommonInit();
        //this.purposeListInit(); // 호텔 이용목적 radio 다국어 처리

        this.mainFormInit(); // 폼 초기화
        this.observableInit(); // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
        console.info('[ngOnDestroy > main search rxAlive]', this.rxAlive);
    }

    /**
     * 모든 bsModal 창 닫기
     */
    closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }


    /**
     * store > hotel-common 초기화
     */
    // storeHotelCommonInit() {
    //   console.info('[0. store > hotel-common 초기화]');
    //   this.store.dispatch(clearHotelModalDestinations());
    //   this.store.dispatch(clearHotelModalCalendars());
    //   this.store.dispatch(clearHotelModalTravelerOptions());
    //   this.store.dispatch(clearHotelModalDetailOptions());
    // }

    /**
     * vm 초기화
     */
    vmInit() {
        console.info('[vm 초기화]');
        this.vm.hotelCity = {};
        this.vm.checkDate = {};
        this.vm.hotelTravelerOption = {
            id: 'hotelTravelerOption',
            roomList: '2^0^'
        };
        this.vm.travelerInfo = this.comHotelS.getTravelerInfo(this.vm.hotelTravelerOption.roomList, true);
        this.vm.detailOption = {};
    }

    /**
     * 검색 결과 >  에러 > 다시 검색 클릭 >  메인 이동 시,
     * store 저장된 데이터 불러오기
     * 1. search form 데이터 세팅
     * 2. store clear
     */
    mainSearchAgainInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelMainSearchSelectors.getSelectId('hotel-search-again')),
                    takeWhile(val => this.rxAlive)
                )
                .subscribe(
                    (ev: any) => {
                        console.info('mainSearchAgainInit', ev);
                        if (ev) {
                            const search: any = _.cloneDeep(ev.search);
                            ///--- 1. search form 데이터 세팅----------------------------------
                            // 도시 검색
                            this.vm.hotelCity = {
                                val: search.city,
                                codeName: search.cityGubun,
                                name: search.cityName,
                            };

                            // 여행 날짜 store upsert
                            this.upsertOne({
                                result: {
                                    step: 2,
                                    totStep: 2,
                                    tabTxtList: ['체크인', '체크아웃'],
                                    selectList: [search.chkIn, search.chkOut]
                                }
                            }, 'hotelCalendar');

                            // 객실 정보 데이터 세팅 및 store upsert
                            this.vm.hotelTravelerOption.roomList = search.roomList;
                            this.upsertOne(this.vm.hotelTravelerOption, 'hotelTravelerOption');

                            // 상세 옵션 데이터 세팅 및 store upsert
                            if (_.has(search, 'detail')) {
                                if (_.has(search.detail, 'price')) {
                                    this.vm.detailOption.priceRanges = {
                                        min: search.detail.price[0],
                                        max: search.detail.price[1]
                                    };
                                }

                                if (_.has(search.detail, 'review'))
                                    this.vm.detailOption.reviewRatings = {
                                        min: search.detail.review[0],
                                        max: search.detail.review[1]
                                    };

                                if (_.has(search.detail, 'star'))
                                    this.vm.detailOption.starRatings = search.detail.star;

                                this.upsertOne(this.vm.detailOption, 'hotelDetailOpt');
                            }

                            ///--- 2. store clear ----------------------------------
                            this.store.dispatch(clearHotelMainSearchs());
                        }
                    }
                )
        );
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
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        console.info('[main >> subscribeInit]');
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
                                hotelCityName: this.vm.hotelCity.name,
                                // hotelCityNameLn: this.vm.hotelCity.nameLn
                            });
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.modalHotelTravelerOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelTravelerOption$ > subscribe]', ev);
                        if (ev) {
                            console.info('[vm.hotelTravelerOption]');
                            this.vm.hotelTravelerOption = _.cloneDeep(ev);
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

        this.subscriptionList.push(
            this.modalHotelDetailOption$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelTravelerOption$ > subscribe]', ev);
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

        this.subscriptionList.push(
            this.modalHotelCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalHotelCalendar$ > subscribe]', ev);
                        if (ev) {
                            this.vm.checkDate.in = moment(ev.result.selectList[0].toString()).format('YYYY-MM-DD');
                            this.vm.checkDate.out = moment(ev.result.selectList[1].toString()).format('YYYY-MM-DD');
                            this.hotelCanlendarInit();
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
    }

    hotelCanlendarInit() {
        const lang = this.translateService.getDefaultLang();
        const chkIn = moment(this.vm.checkDate.in);
        const chkOut = moment(this.vm.checkDate.out);
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

        this.vm.checkInOutDate = moment(this.vm.checkDate.in.toString()).locale(lang).format('MM/DD (ddd)');
        this.vm.checkInOutDate += '-';
        this.vm.checkInOutDate += moment(this.vm.checkDate.out.toString()).locale(lang).format('MM/DD (ddd)');
        this.vm.checkInOutDate += ' ' + dayDiff + dayTxt;

    }

    /**
     * 호텔 이용목적 radio 다국어 처리
     */
    // purposeListInit() {
    //     this.subscriptionList.push(
    //         this.translateService.getTranslation(this.translateService.getDefaultLang())
    //             .pipe(take(1))
    //             .subscribe(
    //                 (ev) => {
    //                     this.vm.purposeList[0].htmlTxt = ev.MAIN_SEARCH.PURPOSE_TRAVEL;
    //                     this.vm.purposeList[1].htmlTxt = ev.MAIN_SEARCH.PURPOSE_LEAVE;
    //                 }
    //             )
    //     );
    // }

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
            hotelCityName: [this.vm.hotelCity.name, Validators.required],
            //hotelCityNameLn: [this.vm.hotelCity.nameLn, Validators.required],
            checkDate: [this.vm.checkDate, Validators.required],
            checkInOutDate: [this.vm.checkInOutDate, Validators.required],
            hotelTravelerOption: [this.vm.hotelTravelerOption, Validators.required],
            travelerInfo: [this.vm.travelerInfo, Validators.required],
            detailOption: [this.vm.detailOption],
            detailInfo: [this.vm.detailInfo]
        });
    }

    /**
     * 3. 결과페이지로 페이지 이동
     */
    goToResultPage($form) {
        console.info('goToResultPage' + $form.value);
        /**
         * 호텔 결과 페이지 Request Data Model
         * environment.STATION_CODE
         */
        const rqInfo = {
            city: this.vm.hotelCity.val,
            cityGubun: this.vm.hotelCity.codeName,
            cityName: this.vm.hotelCity.name,
            chkIn: this.vm.checkDate.in,
            chkOut: this.vm.checkDate.out,
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
        this.router.navigate([path], extras);
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

        this.bsModalRef = this.bsModalService.show(ModalDestinationComponent, { initialState, ...configInfo });
    }
    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne2($obj) {
        this.store.dispatch(upsertHotelMainSearch({
            hotelMainSearch: $obj
        }));
    }

    upsertOne($obj: any, $storeId: any) {
        const obj: any = $obj;
        if (!_.has(obj, 'id'))
            obj.id = $storeId;
        switch ($storeId) {
            case 'hotelCalendar':
                this.store.dispatch(upsertHotelModalCalendar({
                    hotelModalCalendar: obj
                }));
                break;

            case 'hotelTravelerOption':
                this.store.dispatch(upsertHotelModalTravelerOption({
                    hotelModalTravelerOption: obj
                }));
                break;
            case 'hotelDetailOpt':
                this.store.dispatch(upsertHotelModalDetailOption({
                    hotelModalDetailOption: obj
                }));
                break;
            default:
                console.log('[$storeId]', $storeId);
        }
    }
    /**
     * 1. 유효성 체크
     * 2. 결과페이지로 페이지 이동
     * @param $form
     */
    onSubmit($form: any) {

        // setTimeout(() => {

        console.info('[onSubmit]', $form, $form.value);
        console.info('[vm]', this.vm);

        if ($form.valid) {
            console.info('[1. 유효성 체크 성공]');
            this.rxAlive = false;
            const codeName = this.vm.hotelCity.codeName;
            if (codeName == 'hotels') {
                // 호텔 룸타입 선택 페이지 이동
                this.comHotelS.onDstinationHotelDtl(this.vm);
            } else {
                // 결과페이지로 페이지 이동
                this.goToResultPage($form);
            }

        } else {

            const alert = '검색조건이 모두 입력되지 않았습니다. 검색 조건을 확인해주세요.';
            this.searchAlert(alert);
            _.forEach($form.controls,
                ($val, $key) => {
                    if (!$val.valid) {
                        console.info('[$key | 유효성 체크 실패]', $key);
                        return false;

                        // switch ($key) {
                        //   case 'hotelCity':
                        //     break;
                        //   case 'hotelTravelerOption':
                        //     break;
                        // }

                    }

                }
            );

        }

        // }); // end setTimeout

    } // end onSubmit

    /**
     * 호텔 장소 검색 클릭
     */
    onHotelCity() {
        console.info('[호텔 장소 검색 클릭]');
        this.goToHotelModalDestination('IC02', 'hotelCity');
    }

    // 객실 수, 인원 수 선택
    onHotelTravelerOption() {
        console.info('[호텔 메인 >> 상세 검색 모달]');
        this.comHotelS.openHotelTravelerOption({});
    }

    onHotelDetailOption() {
        console.info('[호텔 메인 >> 상세 검색 모달]');

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(HotelModalDetailOptionComponent, { ...configInfo });
    }

    /**
     * 여행날짜 클릭
     */
    onDateClick() {
        console.info('[여행날짜]');
        this.openCalendar();
        // this.comHotelS.openHotelCalendar();
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
        //                 }
        //             }
        //         )
        // );
        this.bsModalRef = this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });

    }

    searchAlert($str: string) {
        const initialState = {
            titleTxt: $str,
            closeObj: {
                fun: () => { }
            },
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
}
