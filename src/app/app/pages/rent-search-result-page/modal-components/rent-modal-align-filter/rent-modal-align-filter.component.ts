import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as rentSearchResultPageSelectors from '../../../../store/rent-search-result-page/rent-search-result-page/rent-search-result-page.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-rent-modal-align-filter',
    templateUrl: './rent-modal-align-filter.component.html',
    styleUrls: ['./rent-modal-align-filter.component.scss']
})
export class RentModalAlignFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    mainForm: FormGroup; // 생성된 폼 저장

    rqInfo: any;
    isListType: boolean;

    vm: any = {
        sortOrderList: [
            {
                name: '추천순',
                val: 'Recommend',
                chk: false
            },
            {
                name: '높은 등급 순',
                val: 'GradeHighest',
                chk: false
            },
            {
                name: '낮은 등급 순',
                val: 'GradeLowest',
                chk: false
            },
            {
                name: '높은 가격 순',
                val: 'AmountHighest',
                chk: false
            },
            {
                name: '낮은 가격 순',
                val: 'AmountLowest',
                chk: false
            }
        ]
    };

    rxAlive: boolean = true;
    rentListRq$: Observable<any>; // 렌터카 검색 request
    rentListRs$: Observable<any>; // 렌터카 검색 결과

    loadingBool: boolean = false;

    transactionSetId: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.mainFormCreate();
        this.vmInit();
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

    vmInit() {
    }

    observableInit() {
        this.rentListRq$ = this.store
            .pipe(select(rentSearchResultPageSelectors.getSelectId('rent-list-rq-info')));
        this.rentListRs$ = this.store
            .pipe(select(rentSearchResultPageSelectors.getSelectId('rent-list-rs')));
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.rentListRq$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[rentListRq$ > subscribe]', ev);
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
            this.rentListRs$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[rentListRs$ > subscribe]', ev);
                        if (ev) {
                            this.setAlign(ev.res.result);
                            this.transactionSetId = ev.res.transactionSetId;
                            this.loadingBool = true;
                            this.isListType = ev.res.isListType;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );
    }

    /**
     * 필터 셋팅
     * rent/list rs 값을 통해 정렬 값 셋팅
     */
    setAlign($result) {
        console.info('[setAlign]', $result);
        const formControl: FormControl = this.mainForm.get('sortOrder') as FormControl;
        formControl.setValue($result.sortOrder);
    }

    /**
     * 폼 생성
     */
    mainFormCreate() {
        this.mainForm = this.fb.group({
            sortOrder: []
        });
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }
    onCloseClick(e) {
        console.info('모달 닫기');
        this.modalClose();
    }

    onSubmit($form: any) {
        this.modalClose();
        console.info('[onSubmit]', $form.value);

        this.rqInfo.rq.condition.sortOrder = $form.value.sortOrder;
        this.rqInfo.rq = { ...this.rqInfo.rq, transactionSetId: this.transactionSetId };

        if (this.rqInfo.rq.condition.sortOrder !== 'Recommend') {
            this.rqInfo.alignUpdate = 'true';
        } else {
            this.rqInfo.alignUpdate = 'false';
        }
        this.rqInfo.isListType = this.isListType;

        console.info('[rqInfo]', this.rqInfo);

        /**
         * 결과페이지 라어터 이동
         */
        const qsStr = qs.stringify(this.rqInfo);
        const path = '/rent-search-result/' + qsStr;

        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));
    }
}
