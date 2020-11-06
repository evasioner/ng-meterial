import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { Store, select } from '@ngrx/store';
import * as myModalCalendarSelectors from '../../../../store/my-common/my-modal-calendar/my-modal-calendar.selectors';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { takeWhile } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { clearMyModalCalendars } from 'src/app/store/my-common/my-modal-calendar/my-modal-calendar.actions';
import { upsertMyReservationList } from 'src/app/store/my-reservation/my-reservation-list/my-reservation-list.actions';
import * as moment from 'moment';
import { StoreCategoryTypes } from '../../../../common-source/enums/store-category-types.enum';
import * as _ from 'lodash';
import { environment } from '@/environments/environment';
import { CommonModalCalendarComponent } from '@/app/common-source/modal-components/common-modal-calendar/common-modal-calendar.component';

@Component({
    selector: 'app-date-search',
    templateUrl: './date-search.component.html',
    styleUrls: ['./date-search.component.scss']
})
export class DateSearchComponent extends BaseChildComponent implements OnInit {
    dateForm: FormGroup; // 생성된 폼 저장
    modalCalendar$: Observable<any>; // 캘린더
    rxAlive: boolean = true;
    bsModalRef: BsModalRef;
    foldingKey: boolean = false;
    periodKey: any = 0;

    vm: any = {
        formDateStr: null, // 검색시작 일자
        toDateStr: null // 검색종료 일자
    };
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private bsModalService: BsModalService
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    @ViewChild('chkId') chkId: ElementRef;

    ngOnInit(): void {
        super.ngOnInit();
        this.storeMyCommonInit(); // store > my-common 초기화
        this.dateFormInit(); // 폼 초기화
        this.observableInit();  // 옵져버블 초기화
        this.subscribeInit(); // 서브스크라이브 초기화

    }

    vmInit() {
        console.info('[vm 초기화]');
        this.rxAlive = true;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    // 옵져버블 초기화
    observableInit() {
        // 캘린더
        this.modalCalendar$ = this.store.pipe(
            select(myModalCalendarSelectors.getSelectId(['my-main']))
        );
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.modalCalendar$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[modalCalendar$ > subscribe]', ev);
                        if (ev) {
                            this.vm.formDateStr = ev.result.selectList[0];
                            this.vm.toDateStr = ev.result.selectList[1];
                            this.dateForm.patchValue({
                                formDateStr: this.vm.formDateStr,
                                toDateStr: this.vm.toDateStr
                            });
                        }
                    }
                )
        );
    }

    dateFormInit() {
        this.dateFormCreate();
    }

    dateFormCreate() {
        this.vm.formDateStr = moment().subtract(1, 'months').format('YYYY-MM-DD');  // 검색기간 초기값
        this.vm.toDateStr = moment().format('YYYY-MM-DD');                          // 검색기간 초기값
        this.dateForm = this.fb.group({
            formDateStr: [this.vm.formDateStr, Validators.required], // 검색시작 일자
            toDateStr: [this.vm.toDateStr, Validators.required], // 검색종료 일자
        });
    }

    selectFolding() {
        this.foldingKey = !this.foldingKey;
    }

    // 3달후 날짜, 3달전 날짜
    aaa() {
        const futureMonth = moment().add(3, 'months');
        const pastMonth = moment().subtract(3, 'months');
        console.log('futureMonth >>>', futureMonth.format('YYYY-MM-DD'));
        console.log('pastMonth >>>', pastMonth.format('YYYY.MM.DD (ddd)'));
    }

    // 검색기간 버튼 클릭
    clickPeriod(param) {
        this.periodKey = param;

        if (param === 0) {
            this.vm.formDateStr = moment().subtract(1, 'months').format('YYYY-MM-DD');
            this.vm.toDateStr = moment().format('YYYY-MM-DD');
        } else if (param === 1) {
            this.vm.formDateStr = moment().subtract(3, 'months').format('YYYY-MM-DD');
            this.vm.toDateStr = moment().format('YYYY-MM-DD');
        } else if (param === 2) {
            this.vm.formDateStr = moment().subtract(6, 'months').format('YYYY-MM-DD');
            this.vm.toDateStr = moment().format('YYYY-MM-DD');
        } else if (param === 3) {
            this.vm.formDateStr = null;
            this.vm.toDateStr = null;
        }
    }

    // 검색시작 일자 클릭
    onFromDateClick() {
        if (document.getElementById('chkId').classList.contains('default')) { // 검색기간 직접입력을 선택했을때
            this.openCalendar(0);
        }
    }

    // 검색종료 일자 클릭
    onToDateClick() {
        if (document.getElementById('chkId').classList.contains('default')) { // 검색기간 직접입력을 선택했을때
            this.openCalendar(1);
        }
    }



    // 달력 팝업
    openCalendar($tgNum) {
        console.info('[달력 팝업 > $tgNum]', $tgNum);

        const itemCategoryCode = 'IC05';
        const storeId = 'my-main';

        // 모달 전달 데이터
        const initialState = {
            storeCategoryType: StoreCategoryTypes.MY,
            storeId: storeId,
            step: 2,
            totStep: 2,
            tabTxtList: ['시작일', '종료일'],
            selectList: [this.vm.formDateStr, this.vm.toDateStr],

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
        initialState.step = $tgNum;
        initialState.selectList = _.slice(initialState.selectList, 0, $tgNum);
        this.bsModalService.show(CommonModalCalendarComponent, { initialState, ...configInfo });
    }

    // 데이터 추가 | 업데이트 action => key 값을 확인
    upsertOne($obj) {
        this.store.dispatch(upsertMyReservationList({
            myReservationList: $obj
        }));
    }

    storeMyCommonInit() {
        this.store.dispatch(clearMyModalCalendars());
    }

    onSubmit() {

    }
}
