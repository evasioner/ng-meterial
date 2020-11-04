import { Component, Inject, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { upsertRentModalCalendar } from '@/app/store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';
import { upsertActivityModalCalendar } from '@/app/store/activity-common/activity-modal-calendar/activity-modal-calendar.actions';
import { upsertFlightModalCalendar } from '@/app/store/flight-common/flight-modal-calendar/flight-modal-calendar.actions';
import { upsertHotelModalCalendar } from '@/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { upsertAirtelModalCalendar } from '@/app/store/airtel-common/airtel-modal-calendar/airtel-modal-calendar.actions';
import { upsertMyModalCalendar } from '@/app/store/my-common/my-modal-calendar/my-modal-calendar.actions';

import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { RentUtilService } from '../../services/rent-com-service/rent-util.service';
import { ApiCommonService } from '@/app/api/common/api-common.service';

import { NumberPadPipe } from '../../pipe/number-pad/number-pad.pipe';

import { StoreCategoryTypes } from '../../enums/store-category-types.enum';
import { ApiAlertService } from '../../services/api-alert/api-alert.service';

@Component({
    selector: 'app-common-modal-calendar',
    templateUrl: './common-modal-calendar.component.html',
    styleUrls: ['./common-modal-calendar.component.scss']
})
export class CommonModalCalendarComponent implements OnInit, AfterViewChecked, OnDestroy {
    loadingBool: boolean = false;

    transactionSetId: string;

    step: number; // 현재 step , 0부터 시작
    totStep: number;
    tabTxtList: any; // 탭 텍스트 | totStep 추출
    selectList: any; // 선택한 항목, 셋팅 값 | step값 selectList.length 가 같아야 한다.
    tabSelectIdx: number; // 탭 클릭시 저장

    afterInfo: any = {
        tempList: null, // 선택 List
        tgIdx: null, // tabSelectIdx + 1
        tgLength: null, // afterInfo.tgList.length
        tgList: null,
        tgDate: null, // tgList[tgIdx]
        tgDateMoment: null, // moment(tgDate);
        diffList: null
    };


    tabList: any; // 초기화 데이터

    storeCategoryType: any;
    storeId: any;
    rq: any;
    res: any;

    vm: any = {
        tabList: [],
        weekList: null,
        calendarList: null
    };

    /**
     * 각 날짜마다 표시되는 class 집합
     * 초기화 용도
     */
    modelDayClass: any = {
        'day-selected': false, // 공통 사용
        'selected': false,
        'middle': false,
        'first-selected': false,
        'middle-selected': false,
        'last-selected': false
    };

    modelTabList: any = {
        chk: false,
        txtVal: '',
        dateVal: null
    };

    element: any;

    uiInProgressBool: boolean = true;
    scrollEventBool: boolean;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(DOCUMENT) private document: Document,
        public rentUtilSvc: RentUtilService,
        private store: Store<any>,
        private apiCommonService: ApiCommonService,
        public bsModalRef: BsModalRef,
        private numberPad: NumberPadPipe,
        private scrollToService: ScrollToService,
        private alertService: ApiAlertService
    ) {
        this.scrollEventBool = false;
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.modalInit();
    }

    ngAfterViewChecked() {
        if (this.loadingBool && !this.scrollEventBool) {
            this.scrollFirstMonth();
        }
    }

    ngOnDestroy(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }


    async modalInit() {
        this.loadingBool = false;

        if (this.transactionSetId) {
            const rq = { ...this.rq, transactionSetId: this.transactionSetId };
            this.getCalendarList(rq);
        } else {
            this.getCalendarList(this.rq);
        }
    }

    /**
     * 데이터 초기화
     * @param $res
     */
    vmInit($res) {
        const tempRes = _.cloneDeep($res);
        this.vm.weekList = tempRes.weekdayTitle; // 요일 데이터 초기화
        this.vm.calendarList = tempRes.calendars;
        this.calendarListInit(); // 캘린더 데이터 초기화
        this.tabListInit();
        this.afterCalendarListInit();
    }

    /**
     * tabList 초기화
     */
    tabListInit() {

        const tempTabList = [];

        for (let i = 0; i < this.totStep; i++) {
            const tempTabModel = {
                ...this.modelTabList
            };

            tempTabModel.txtVal = this.tabTxtList[i] || `name ${i}`;

            if (this.step === 0) { // 선택이 아무것도 안된 경우
                tempTabModel.chk = false;
                tempTabModel.dateVal = null;
                if (i === 0) {
                    tempTabModel.chk = true;
                }
            } else if (this.step > 0 && this.step <= this.totStep) {

                if (i === this.step) { //현재 step과 tapModel과 일치하는 경우
                    tempTabModel.chk = true;
                } else {
                    tempTabModel.chk = false;
                }

                if (i < this.step) {
                    const stepDate = this.selectList[i];
                    console.info('[stepDate]', stepDate, this.selectList);
                    tempTabModel.dateVal = stepDate;
                } else {
                    tempTabModel.dateVal = null;
                }
            }

            tempTabList.push(tempTabModel);
        }

        this.tabList = tempTabList;
        this.vm.tabList = tempTabList;
        console.info('[tempTabList]', tempTabList);
        console.info('[vm.calendarList]', this.vm.calendarList);


    }
    scrollFirstMonth() {
        if (this.tabList[0].dateVal !== null) {
            const dateId = this.tabList[0].dateVal.split('-').slice(0, 2).join('');
            console.log(this.document.getElementById(dateId));
            console.log(dateId);

            const config: ScrollToConfigOptions = {
                target: dateId,
                duration: 200,
                offset: -150
            };

            this.scrollToService.scrollTo(config);
            this.scrollEventBool = true;
        }

    }
    /**
     * 현제 데이터를 기준으로 날짜 셋팅
     */
    afterCalendarListInit() {
        this.uiInProgressBool = false;

        // 월 : monthItem
        _.forEach(this.vm.calendarList, ($monthItem, $monthIdx) => {
            const monthItem = $monthItem.days;

            // 1주 : weekItem
            _.forEach(monthItem, ($weekItem, $weekIdx) => {
                const weekItem = $weekItem;

                // 일 : dayItem
                _.forEach(weekItem, ($dayItem, $dayIdx) => {
                    const dayItem = $dayItem;

                    if (!dayItem.day) { // Null 일경우 중단.
                        return;
                    }

                    if (this.selectList.length === 0) {
                        return;
                    }

                    const selectList = this.selectList;

                    const cur = moment([dayItem.year, Number(dayItem.month - 1), dayItem.day]);

                    dayItem.dayClass = { ...this.modelDayClass }; // 날짜 class 초기화

                    const firstDateMoment = moment(selectList[0]);
                    const lastDateMoment = moment(selectList[selectList.length - 1]);
                    const firstCurDiffNum = firstDateMoment.diff(cur, 'days');
                    const lastCurDiffNum = lastDateMoment.diff(cur, 'days');

                    if (firstCurDiffNum < 0 && lastCurDiffNum > 0) {
                        dayItem.dayClass['middle'] = true;
                    }

                    /**
                     * 선택된 항목 선택하기
                     */
                    _.forEach(selectList, ($selectItem, $selectIdx) => {
                        const selectItem = moment($selectItem);
                        const selectIdx = Number($selectIdx);
                        /**
                         * 양수 : tg > cur | 이전 데이터
                         * 0 : tg = cur | 현재 데이터
                         * 음수 : tg < cur | 이후 데이터
                         */
                        const selectDiffNum = selectItem.diff(cur, 'days');

                        const isCur = (selectDiffNum === 0) ? true : false;

                        const isFirst = (selectIdx === 0) ? true : false;
                        const isLast = (selectIdx === selectList.length - 1) ? true : false;

                        const isFirstSelect = (isFirst && isCur) ? true : false;
                        const isMidSelect = (!isFirst && !isLast && isCur) ? true : false;
                        const isLastSelect = (isLast && isCur) ? true : false;

                        dayItem.dayClass['day-selected'] = true;
                        if (isFirstSelect) {
                            // console.info(`
                            // [isFirstSelect]
                            // [step] ${this.step}
                            // [totStep] ${this.totStep}
                            // [tabTxtList] ${this.tabTxtList}
                            // [selectList] ${this.selectList}
                            // `);
                            if (this.vm.tabList.length > 1) {
                                dayItem.dayClass = { ...this.modelDayClass };
                                dayItem.dayClass['first-selected'] = true;
                            } else {
                                dayItem.dayClass = { ...this.modelDayClass };
                                dayItem.dayClass['selected'] = true;
                            }
                        } else if (isLastSelect) {
                            // console.info(`
                            // [isLastSelect]
                            // [step] ${this.step}
                            // [totStep] ${this.totStep}
                            // [tabTxtList] ${this.tabTxtList}
                            // [selectList] ${this.selectList}
                            // `);

                            if (firstCurDiffNum === 0) {
                                dayItem.dayClass = { ...this.modelDayClass };
                                dayItem.dayClass['selected'] = true;
                            } else {
                                dayItem.dayClass = { ...this.modelDayClass };
                                dayItem.dayClass['last-selected'] = true;
                            }

                        } else if (isMidSelect) {
                            // console.info(`
                            // [isMidSelect]
                            // [step] ${this.step}
                            // [totStep] ${this.totStep}
                            // [tabTxtList] ${this.tabTxtList}
                            // [selectList] ${this.selectList}
                            // `);
                            if (firstCurDiffNum === 0) {
                                dayItem.dayClass = { ...this.modelDayClass };
                                dayItem.dayClass['first-selected'] = true;
                            } else {
                                dayItem.dayClass = { ...this.modelDayClass };
                                dayItem.dayClass['middle-selected'] = true;
                            }
                        } else if (!isFirstSelect && !isMidSelect && !isLastSelect) {
                        }

                    });

                });


            });
        });
        this.uiInProgressBool = true;
    }

    /**
     * 캘린더 처음 로딩시 초기화
     */
    calendarListInit() {
        // 월 : monthItem
        _.forEach(this.vm.calendarList, ($monthItem, $monthIdx) => {
            const monthIdx: number = Number($monthIdx);
            const monthItem = ($monthItem.days); // 월
            $monthItem.monthId = String($monthItem.year) + this.numberPad.transform($monthItem.month, 2);
            // 1주 : weekItem
            _.forEach(monthItem, ($weekItem, $weekIdx) => {

                const weekItem = $weekItem; // 주

                // 일 : dayItem
                _.forEach(weekItem, ($dayItem, $dayIdx) => {

                    const dayItem = $dayItem; // 일

                    dayItem.dayClass = { ...this.modelDayClass }; // 날짜 class 초기화

                    /**
                     * [오늘날짜보다 이전 날짜 음영처리 하기]
                     */
                    if (monthIdx === 0) { // monthIdx 가 0 일때 > 현재 날짜가 속해있는 month
                        dayItem.daysClass = {
                            passday: this.passdayInit(dayItem)
                        };
                    } else {
                        dayItem.daysClass = {
                            passday: false
                        };
                    }

                    // end [오늘날짜보다 이전 날짜 음영처리 하기]
                    dayItem.daysClass.holiday = dayItem.holidayYn;
                    dayItem.daysClass.today = this.todayInit(dayItem);
                });
            });
        });

        console.info('[vm.tabList]', this.vm.tabList);
        console.info('[vm.calendarList]', this.vm.calendarList);
    }

    /**
     * stepIncrease
     * increase
     */
    stepIncrease() {

        /**
         * tabList 초기화
         */
        _.forEach(this.vm.tabList, (tabItem) => {
            tabItem.chk = false;
            tabItem.dateVal = null;
        });

        /**
         * tabList 값 셋팅
         */
        _.forEach(this.selectList, (selectListItem, idx) => {
            this.vm.tabList[idx].dateVal = selectListItem;
        });

        const selectListLength = this.selectList.length;
        const tabListLength = this.vm.tabList.length;
        /**
         * tab 선택
         */
        if (selectListLength < tabListLength) {
            this.vm.tabList[selectListLength - 1].chk = true;
        }

        this.step = selectListLength;

    }

    /**
     * daysClass 초기화
     * @param $dayItem
     */
    passdayInit($dayItem): boolean {
        if ($dayItem.day) {
            const year = $dayItem.year;
            const month = this.rentUtilSvc.numberPad($dayItem.month, 2);
            const day = this.rentUtilSvc.numberPad($dayItem.day, 2);
            const curDateMoment = moment(`${year}-${month}-${day}`);

            const diffNum = this.getTodayDiff(curDateMoment);

            if (diffNum > 0) { // 오늘 보다 이전
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    todayInit($dayItem): boolean {
        if ($dayItem.day) {
            const year = $dayItem.year;
            const month = this.rentUtilSvc.numberPad($dayItem.month, 2);
            const day = this.rentUtilSvc.numberPad($dayItem.day, 2);
            const curDateMoment = moment(`${year}-${month}-${day}`);

            const diffNum = this.getTodayDiff(curDateMoment);

            if (diffNum === 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getCalendarList($rq) {
        this.loadingBool = false;
        this.subscriptionList = [
            this.apiCommonService.POST_CALENDAR($rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.transactionSetId = res.transactionSetId;
                            this.res = res.result;

                            console.info('[res]', this.res);
                            this.vmInit(this.res);
                            this.loadingBool = true;
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        ];
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * 각 카테고리별 스토어 액션 변경 해야됨.
     *
     * @param $obj
     */
    upsertOne($obj) {
        switch (this.storeCategoryType) {

            case StoreCategoryTypes.FLIGHT:
                this.store.dispatch(upsertFlightModalCalendar({
                    flightModalCalendar: $obj
                }));
                break;

            case StoreCategoryTypes.HOTEL:
                this.store.dispatch(upsertHotelModalCalendar({
                    hotelModalCalendar: $obj
                }));
                break;

            case StoreCategoryTypes.AIRTEL:
                this.store.dispatch(upsertAirtelModalCalendar({
                    airtelModalCalendar: $obj
                }));
                break;

            case StoreCategoryTypes.RENT:
                this.store.dispatch(upsertRentModalCalendar({
                    rentModalCalendar: $obj
                }));
                break;

            case StoreCategoryTypes.ACTIVITY:
                this.store.dispatch(upsertActivityModalCalendar({
                    activityModalCalendar: $obj
                }));
                break;

            case StoreCategoryTypes.MY:
                this.store.dispatch(upsertMyModalCalendar({
                    myModalCalendar: $obj
                }));
                break;

            default:
                console.log('[storeCategoryType]', this.storeCategoryType);
        }
    }

    getItemDate($dayItem) {
        if ($dayItem.day) {
            const year = $dayItem.year;
            const month = this.rentUtilSvc.numberPad($dayItem.month, 2);
            const day = this.rentUtilSvc.numberPad($dayItem.day, 2);
            const curDateMoment = moment(`${year}-${month}-${day}`);

            return curDateMoment;
        } else {
            return null;
        }
    }

    getTodayDiff($tgDate: any) {
        const today = moment().format('YYYY-MM-DD');
        return moment(today).diff($tgDate, 'days');
    }


    onSubmitClick() {
        // console.info('[onSubmitClick]');
        // console.info(`
        //                     [step] ${this.step}
        //                     [totStep] ${this.totStep}
        //                     [tabTxtList] ${this.tabTxtList}
        //                     [selectList] ${this.selectList}
        //                     `);

        this.upsertOne({
            id: this.storeId,
            result: {
                step: this.step,
                totStep: this.totStep,
                tabTxtList: this.tabTxtList,
                selectList: this.selectList,
            }
        });

        this.modalClose();
    }

    onCloseClick() {
        this.modalClose();
    }

    /**
     * 날짜 선택
     * @param e
     * @param $weekItem
     * @param $weekList
     * @param $monthItem
     */
    onDayClick(e, $weekItem) {
        // console.info('[날짜 클릭]', e, $weekItem, $weekList, $monthItem);
        // console.info('[날짜 클릭 > e.currentTarget]', e.currentTarget);
        // console.info('[날짜 클릭 > e.currentTarget.parentNode]', e.currentTarget.parentNode);
        // console.info('[날짜 클릭 > e.target]', e.target);
        // console.info('[날짜 클릭 > e.target.parentNode]', e.target.parentNode.parentNode);
        // console.info('[날짜 클릭 > classList.contains]', e.target.parentNode.parentNode.classList.contains('passday'));
        const tg = e.currentTarget.parentNode;

        const isPassday = tg.classList.contains('passday');
        const isComplete = (this.step >= this.totStep) ? true : false;

        if (!this.uiInProgressBool) { // ui 변경중일때는 클릭 이벤트 안되도록
            return;
        }

        if (isPassday) {
            return;
        } // 비활성 날짜 클릭시 리턴

        if (isComplete) {
            return;
        } // 정해지 step 초과시 리턴

        const cur = moment([$weekItem.year, Number($weekItem.month - 1), $weekItem.day]);

        // 이전날짜보다 이전 선택시 리턴
        if (this.step > 0) {
            const beforeSelectItem = this.selectList[this.step - 1];
            const beforeSelectItemMoment = moment(beforeSelectItem);

            const beforeSelectItemDiffNum = beforeSelectItemMoment.diff(cur, 'days');

            let beforeBool: boolean;
            if (_.isEqual(this.storeCategoryType, StoreCategoryTypes.HOTEL)) // 호텔일 경우, 같은 날짜 선택 방지
                beforeBool = (beforeSelectItemDiffNum >= 0) ? true : false;
            else
                beforeBool = (beforeSelectItemDiffNum > 0) ? true : false;

            if (beforeBool) {
                return;
            }
        }
        // end 이전날짜보다 이전 선택시 리턴

        const selectItem = this.getItemDate($weekItem).format('YYYY-MM-DD');
        this.selectList.push(selectItem);

        this.afterCalendarListInit();

        this.stepIncrease();

        // console.info('[step === totStep]', this.step, this.totStep);
        // console.info('[vm.calendarList]', this.vm.calendarList);
        // console.info(`
        //     [step] ${this.step}
        //     [totStep] ${this.totStep}
        //     [tabTxtList] ${this.tabTxtList}
        //     [selectList] ${this.selectList}
        //     `
        // );
        this.scrollEventBool = false;

    }

    onTabClick($idx) {
        this.tabSelectIdx = $idx;
        this.afterInfoInit(); // 자동 추가 기능


        const curStep = this.step;

        // 현재 step 보다 앞에 있는 tab 은 클릭할수 없다.
        if (curStep < $idx) {
            return;
        }

        const selectList = _.cloneDeep(this.selectList);
        this.step = $idx;
        this.selectList = _.slice(selectList, 0, $idx);
        this.tabListInit();

        if (curStep >= $idx) {
            if ($idx === 0) {
                this.vmInit(this.res);
            } else {
                this.afterCalendarListInit();
            }
        } else {
            console.info('[취소 불가]', curStep, $idx);
        }

    }

    afterInfoInit() {
        const afterInfo: any = {
            tempList: null, // 선택 List
            tgIdx: null, // tabSelectIdx + 1
            tgLength: null, // afterInfo.tgList.length
            tgList: null,
            tgDate: null, // tgList[tgIdx]
            tgDateMoment: null, // moment(tgDate);
            diffList: null
        };
        this.afterInfo = afterInfo; // 초기화

        const tempList = _.cloneDeep(this.selectList);
        const tgIdx = this.tabSelectIdx + 1;
        const tgLength = tempList.length;
        const tgList = _.slice(tempList, tgIdx, tgLength); // 선택 이후 날자 리스트
        const tgDate = tempList[this.tabSelectIdx]; // 탭으로 선택한 날자
        const tgDateMoment = moment(tgDate);
        const diffList = [];

        _.forEach(tgList, (item) => {
            const itemMoment = moment(item);
            const itemDiffNum = itemMoment.diff(tgDateMoment, 'days');
            diffList.push(itemDiffNum);
        });

        this.afterInfo = { tempList, tgIdx, tgLength, tgList, tgDate, tgDateMoment, diffList };

    }
}
