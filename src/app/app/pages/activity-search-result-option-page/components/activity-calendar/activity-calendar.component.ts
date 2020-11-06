import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { upsertActivityCalendar } from '@/app/store/activity-search-result-option-page/activity-calendar/activity-calendar.actions';


import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';
import * as _ from 'lodash';

import { CalendarRqSet } from './models/activity-calendar.model';

import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { ApiCommonService } from '@/app/api/common/api-common.service';

@Component({
    selector: 'app-activity-calendar',
    templateUrl: './activity-calendar.component.html'
})
export class ActivityCalendarComponent extends BaseChildComponent implements OnInit, OnDestroy {
    public viewModel: any;
    private dataModel: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public translateService: TranslateService,
        private apiCommonS: ApiCommonService
    ) {
        super(platformId);

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

    /**
     * initialize
     * 화면 초기화
     */
    private initialize(): void {
        this.viewModel = {
            calendar: {
                header: [],
                weekList: [],
                calendars: [],
                month: ''
            }
        };
        this.dataModel = {};
        this.subscriptionList = [];
        this.subscribeInit();
    }

    /**
     * subscribeInit
     * 구독 준비
     */
    private subscribeInit(): void {
        this.subscriptionList = [
            this.apiCommonS.POST_CALENDAR(CalendarRqSet)
                .subscribe(
                    (res: any): void => {
                        console.log(res);

                        this.dataModel = _.cloneDeep(res.result);

                        if (this.dataModel) {
                            this.setViewModel();
                        }
                    }
                )
        ];
    }

    private upsertOne($obj) {
        this.store.dispatch(upsertActivityCalendar({
            activityCalendar: $obj
        }));
    }

    /**
     * setViewModel
     * 화면 그리기
     */
    private setViewModel(): void {
        this.viewModel = {
            header: [
                { active: false, title: '수령일', fullDate: null, year: null, month: null, date: null, options: [] },
                { active: false, title: '반납일', fullDate: null, year: null, month: null, date: null, options: [] }
            ],
            weekList: this.dataModel.weekdayTitle,
            month: moment(this.dataModel.period.firstDate, 'YYYY-MM-DD').format('YYYY.MM'),
            calendars: []
        };
        this.viewModel.minDate = this.dataModel.calendars[0];
        this.viewModel.maxDate = this.dataModel.calendars[this.dataModel.calendars.length - 1];
        this.setMonth();
    }

    /**
     * setNewMonth
     * 달력 데이터 설정
     */
    private setMonth(): void {
        const year = Number(moment(this.viewModel.month, 'YYYY.MM').format('YYYY'));
        const month = Number(moment(this.viewModel.month, 'YYYY.MM').format('MM'));

        this.viewModel.calendars = this.dataModel.calendars.map(
            (calendarItem: any) => {
                calendarItem.days = calendarItem.days.map(
                    (weekendItem: any): any => {
                        return weekendItem.map(
                            (item: any): any => {
                                let makeDate: string = null;

                                if (item.year) {
                                    makeDate = moment(`${item.year}-${item.month}-${item.day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
                                }

                                item.className = item.holidayYn ? 'days holiday' : 'days';
                                item.subClassName = 'day';
                                item.disabled = false;
                                item.checked = false;
                                item.text = null;

                                if (makeDate) {
                                    if (moment(moment().format('YYYY-MM-DD')).isSame(makeDate)) {
                                        item.className = item.holidayYn ? 'days passday today holiday' : 'days passday today';
                                        item.subClassName = 'day';
                                        item.disabled = true;
                                        item.checked = false;
                                        item.text = null;
                                    }

                                    if (moment(makeDate).isBefore(moment().format('YYYY-MM-DD'))) {
                                        item.className = item.holidayYn ? 'days passday holiday' : 'days passday';
                                        item.subClassName = 'day';
                                        item.disabled = true;
                                        item.checked = false;
                                        item.text = null;
                                    }
                                } else {
                                    item.className = item.holidayYn ? 'days passday holiday' : 'days passday';
                                    item.subClassName = 'day';
                                    item.disabled = true;
                                    item.checked = false;
                                    item.text = null;
                                }

                                return item;
                            }
                        );
                    }
                );

                if ((Number(calendarItem.year) === year) && (Number(calendarItem.month) === month)) {
                    calendarItem.checked = true;
                    this.viewModel.month = this.viewModel.month;
                } else {
                    calendarItem.checked = false;
                }

                return calendarItem;
            }
        );
    }

    /**
     * setNewMonth
     * 신규 달력 표시
     *
     * @param newMonth 사용자가 누른 버튼에 해당하는 월
     */
    private setNewMonth(newMonth: string): void {
        const year = Number(moment(newMonth, 'YYYY.MM').format('YYYY'));
        const month = Number(moment(newMonth, 'YYYY.MM').format('MM'));

        this.viewModel.calendars = this.viewModel.calendars.map(
            (calendarItem: any) => {
                if ((Number(calendarItem.year) === year) && (Number(calendarItem.month) === month)) {
                    calendarItem.checked = true;
                    this.viewModel.month = newMonth;
                } else {
                    calendarItem.checked = false;
                }

                return calendarItem;
            }
        );
    }

    /**
     * resetDate
     * 선택 날짜 초기화
     *
     * @param event 마우스, 터치 이벤트
     * @param index 헤더 번호
     */
    public resetDate(event: MouseEvent, index: number): any {
        event && event.preventDefault();

        if (!this.viewModel.header[index].fullDate) {
            return;
        }

        this.viewModel.header = [
            { active: false, title: '수령일', fullDate: null, year: null, month: null, date: null, options: [] },
            { active: false, title: '반납일', fullDate: null, year: null, month: null, date: null, options: [] }
        ];
        this.setMonth();
        this.upsertOne({
            id: ActivityStore.STORE_CALENDAR,
            result: _.cloneDeep(this.viewModel.header)
        });
    }

    /**
     * prevMonth
     * 달력 이전달로 이동
     *
     * @param event 마우스, 터치 이벤트
     */
    public prevMonth(event: MouseEvent): void {
        event && event.preventDefault();

        // isSameOrBefore의 날짜가 달력 최소 날짜보다 작으면 true;
        const minFlag = moment(`${this.viewModel.minDate.year}.${this.viewModel.minDate.month}`, 'YYYY.MM')
            .isSameOrBefore(moment(this.viewModel.month, 'YYYY.MM').subtract(1, 'M'));

        minFlag && this.setNewMonth(moment(this.viewModel.month, 'YYYY.MM').subtract(1, 'M').format('YYYY.MM'));
    }

    /**
     * nextMonth
     * 달력 다음달로 이동
     *
     * @param event 마우스, 터치 이벤트
     */
    public nextMonth(event: MouseEvent): void {
        event && event.preventDefault();

        // isSameOrBefore의 날짜가 달력 최대 날짜보다 크면 true;
        const maxFlag = moment(`${this.viewModel.maxDate.year}.${this.viewModel.maxDate.month}`, 'YYYY.MM')
            .isSameOrAfter(moment(`${this.viewModel.month}`, 'YYYY.MM').add(1, 'M'));
        maxFlag && this.setNewMonth(moment(this.viewModel.month, 'YYYY.MM').add(1, 'M').format('YYYY.MM'));
    }

    /**
     * onDayClick
     *
     * @param event 마우스, 터치 이벤트
     * @param item 선택일 데이터
     */
    public onDayClick(event: MouseEvent, item: any) {
        event && event.preventDefault();

        let newDate = false;
        if (!item.disabled && !item.checked) {
            this.viewModel.header = this.viewModel.header.map(
                (headerItem: any, headerIndex: number) => {
                    if (!headerItem.fullDate) {
                        newDate = true;
                        headerItem.fullDate = moment([item.year, (item.month - 1), item.day]).format('YYYY.MM.DD');
                        headerItem.year = item.year;
                        headerItem.month = item.month;
                        headerItem.date = item.day;
                        headerIndex === 0 ? headerItem.active = true : headerItem.active = false;
                        headerIndex === 1 ?
                            this.viewModel.header[0].active = false
                            : this.viewModel.header[0].active = true;
                        // 2개 선택 시 기능 임시 제거 hwcho 2020.08.02
                        // checkFlag = false;
                        headerItem.options = item.options;

                        item.checked = true;
                        // 2개 선택 시 기능 임시 제거 hwcho 2020.08.02
                        // item.subClassName = (headerIndex === 0 ? 'day first-selected' : 'day last-selected');
                        // item.text = (headerIndex === 0 ? '수령일' : '반납일');
                        item.subClassName = 'day selected';
                        item.text = '수령일';
                    }

                    return headerItem;
                }
            );

            if (newDate) {
                this.upsertOne({
                    id: ActivityStore.STORE_CALENDAR,
                    result: _.cloneDeep(this.viewModel.header)
                });
            }
        }
    }
}
