import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as hotelSearchResultPageSelectors from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-modal-align-filter',
    templateUrl: './hotel-modal-align-filter.component.html',
    styleUrls: ['./hotel-modal-align-filter.component.scss']
})
export class HotelModalAlignFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    mainForm: FormGroup; // 생성된 폼 저장

    rqInfo: any;
    hotelTransactionSetId: any;
    vm: any = {
        sortOrders: [
            {
                txt: '추천순',
                val: 'Recommend',
                checked: false
            },
            {
                txt: '높은 등급 순',
                val: 'StarRatingHighest',
                checked: false
            },
            {
                txt: '낮은 등급 순',
                val: 'StarRatingLowest',
                checked: false
            },
            {
                txt: '높은 가격 순',
                val: 'AmountHighest',
                checked: false
            },
            {
                txt: '낮은 가격 순',
                val: 'AmountLowest',
                checked: false
            }
        ],
        recome: {
            title: '추천순',
            active: false,
            val: ''
        },
        userRating: {
            title: '이용자 평점',
            active: false,
            val: ''
        },
        starRating: {
            title: '호텔 성급',
            active: false,
            val: ''
        },
        accommodation: {
            title: '숙소 유형',
            active: false,
            val: ''
        }
    };

    rxAlive: boolean = true;
    hotelListRq$: Observable<any>; // 호텔 검색 request
    hotelListRs$: Observable<any>; // 호텔 검색 결과

    loadingBool: boolean = false;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
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

    observableInit() {
        this.hotelListRq$ = this.store
            .pipe(select(hotelSearchResultPageSelectors.getSelectId('hotel-list-rq-info')));
        this.hotelListRs$ = this.store
            .pipe(select(hotelSearchResultPageSelectors.getSelectId('hotel-search-result')));
    }

    subscribeInit() {
        this.subscriptionList.push(
            this.hotelListRq$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelListRq$ > subscribe]', ev);
                        if (ev) {
                            this.rqInfo = _.cloneDeep(ev.res);
                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.hotelListRs$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelListRs$ > subscribe]', ev);
                        if (ev) {
                            this.hotelTransactionSetId = _.cloneDeep(ev.res.transactionSetId);
                            this.setAlign(ev.res.result);

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
     * hotel/list rs 값을 통해 정렬 값 셋팅
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
        console.info('[onSubmit]', $form.value);
        console.info('[hotelTransactionSetId]', this.hotelTransactionSetId);

        const rq = _.omit(this.rqInfo, 'rq');
        rq.hotelSearchTrd = this.hotelTransactionSetId;
        rq.sortOrder = $form.value.sortOrder;

        console.info('[rq]', rq);
        /**
         * 결과페이지 라우터 이동
         */

        if (rq.sortOrder !== 'Recommend') {
            rq.alignUpdate = 'true';
        } else {
            rq.alignUpdate = 'false';
        }

        const qsStr = qs.stringify(rq);
        const path = '/hotel-search-result/' + qsStr;
        const extras = {
            relativeTo: this.route
        };
        // 페이지 이동후 생명주기 재실행
        this.router.navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));

        this.modalClose();
    }
}
