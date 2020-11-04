import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as activitySearchResultPageSelectors from '../../../../store/activity-search-result-page/activity-result-search/activity-result-search.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { ActivityComServiceService } from 'src/app/common-source/services/activity-com-service/activity-com-service.service';

import { ActivityEnums } from '../../../activity-page/enums/activity-enums.enum';

import { BaseChildComponent } from '../../../../pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-modal-align-filter',
    templateUrl: './activity-modal-align-filter.component.html',
    styleUrls: ['./activity-modal-align-filter.component.scss']
})
export class ActivityModalAlignFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    mainForm: FormGroup; // 생성된 폼 저장

    rqInfo: any;

    vm: any = {
        sortOrderList: [
            {
                name: '추천순',
                val: 'Recommend',
                chk: false
            },
            {
                name: '인기순',
                val: 'Popularity',
                chk: false
            },
            {
                name: '낮은가격순',
                val: 'AmountLowest',
                chk: false
            },
            {
                name: '높은가격순',
                val: 'AmountHighest',
                chk: false
            },
            {
                name: '최근순',
                val: 'Newest',
                chk: false
            },
            {
                name: '평점순',
                val: 'ReviewAverage',
                chk: false
            }
        ]
    };

    rxAlive: boolean = true;
    activityListRq$: Observable<any>; // 액티비티 검색 request
    activityListRs$: Observable<any>; // 액티비티 검색 결과

    loadingBool: boolean = false;

    transactionSetId: any;
    private alignUpdate: boolean;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private router: Router,
        private fb: FormBuilder,
        private readonly activityComServiceService: ActivityComServiceService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);

        this.alignUpdate = false;
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.rxAlive = true;
        this.mainFormCreate();
        this.observableInit();
        this.subscribeInit();
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
     * 폼 생성
     */
    mainFormCreate() {
        this.mainForm = this.fb.group({
            sortOrder: []
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
                            this.setAlign(ev.result.result);
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
     * activity/list rs 값을 통해 정렬 값 셋팅
     */
    setAlign($result) {
        const formControl: FormControl = this.mainForm.get('sortOrder') as FormControl;
        formControl.setValue($result.sortOrder);
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        this.modalClose();
    }

    onSubmit($form: any) {
        this.modalClose();
        this.rqInfo.rq.condition.sortOrder = $form.value.sortOrder;
        this.rqInfo.rq.condition.limits = [0, 10]; // 1페이지를 조회한다.
        this.rqInfo.rq = { ...this.rqInfo.rq, transactionSetId: this.transactionSetId };
        const rsData = this.activityComServiceService.beforeEncodingRq(_.cloneDeep(this.rqInfo));

        if (rsData.sortOrder !== 'Recommend') {
            rsData.alignUpdate = 'true';
        } else {
            rsData.alignUpdate = 'false';
        }

        /**
         * 결과페이지 라우터 이동
         */
        const qsStr = qs.stringify(rsData);
        const path = ActivityEnums.PAGE_SEARCH_RESULT + qsStr;

        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }

}
