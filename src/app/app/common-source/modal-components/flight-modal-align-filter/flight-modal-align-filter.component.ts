import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as flightSearchResultSelector from 'src/app/store/flight-common/flight-search-result/flight-search-result.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-flight-modal-align-filter',
    templateUrl: './flight-modal-align-filter.component.html',
    styleUrls: ['./flight-modal-align-filter.component.scss']
})
export class FlightModalAlignFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {
    alignFilterForm: FormGroup;
    isSubmitted = false;

    listRS: any;

    flightSearchListRQ$: Observable<any>;
    flightSearchListRS$: Observable<any>;

    private subscriptionList: Subscription[];

    alive: any = true;

    vm: any = {
        sortOrders: [
            {
                sortCd: 'AmountAsc',
                sortNm: '최저가순'
            },
            {
                sortCd: 'AmountDesc',
                sortNm: '최고가순'
            },
            {
                sortCd: 'DurationAsc',
                sortNm: '최단 여행 시간순'
            },
            {
                sortCd: 'DurationDesc',
                sortNm: '최장 여행 시간순'
            },
            {
                sortCd: 'DepartureTimeAsc',
                sortNm: '빠른 출발순'
            },
            {
                sortCd: 'DepartureTimeDesc',
                sortNm: '늦은 출발순'
            },
            {
                sortCd: 'ArrivalTimeAsc',
                sortNm: '빠른 도착순'
            },
            {
                sortCd: 'ArrivalTimeDesc',
                sortNm: '늦은 도착순'
            },
            {
                sortCd: 'RecommendDesc',
                sortNm: '추천순'
            },
            // {
            //   sortCd: "AirlineNameAsc",
            //   sortNm: "항공사순"
            // },
            {
                sortCd: 'ViaCountAsc',
                sortNm: '직항만 우선, 경유 적은 순'
            }
        ]
    };

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private router: Router,
        private fb: FormBuilder,
        private store: Store<any>,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit() {
        super.ngOnInit();
        console.info('[ngOnInit | 필터(정렬)]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.formInit();
        this.storeInit();
        this.storeSubscribe();
    }

    ngOnDestroy() {
        this.alive = false;

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    formInit() {
        this.alignFilterForm = this.fb.group({
            alignSortOrders: ['', [Validators.required]]
        });
    }

    storeInit() {
        this.flightSearchListRS$ = this.store.select(
            flightSearchResultSelector.getSelectId(['flight-list-rs'])
        );

        this.flightSearchListRQ$ = this.store.select(
            flightSearchResultSelector.getSelectId(['flight-list-rq-info'])
        );
    }

    storeSubscribe() {
        this.subscriptionList.push(
            this.flightSearchListRS$
                .pipe(takeWhile(() => this.alive))
                .subscribe(
                    ev => {
                        console.info('[flightSearchListRS$ > subscribe]', ev);
                        if (ev) {
                            this.listRS = ev.option;
                            this.alignFilterForm.patchValue({
                                alignSortOrders: ev.option.result.sortOrder
                            });
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.flightSearchListRQ$
                .pipe(takeWhile(() => this.alive))
                .subscribe(
                    ev => {
                        console.info('[flightSearchListRQ$ > subscribe]', ev);
                    }
                )
        );
    }

    modalClose() {
        this.bsModalRef.hide();
    }

    onSubmit(flightSearchListRQ$: any) {
        this.isSubmitted = true;

        if (!this.alignFilterForm.valid) {
            return false;
        }

        console.info(
            '[form getValue >]', this.alignFilterForm.get('alignSortOrders').value
        );

        const listRQ = _.cloneDeep(flightSearchListRQ$);

        listRQ.option.rq.condition.sortOrder = this.alignFilterForm.get(
            'alignSortOrders'
        ).value;

        console.info('[listRQ >]', listRQ);

        let page = '';
        switch (listRQ.pageId) {
            case 'flightSearchResultGoPage':
                page = '/flight-search-result-go/';
                break;

            case 'flightSearchResultComePage':
                page = '/flight-search-result-come/';
                break;

            case 'flightSearchResultMultiPage':
                page = '/flight-search-result-multi/';
                break;
        }

        // 필터 변경 여부
        if (listRQ.option.rq.condition.sortOrder !== 'RecommendDesc') {
            listRQ.option.alignUpdate = 'true';
        } else {
            listRQ.option.alignUpdate = 'false';
        }

        // transactionSetId 추가(검색-예약 트랜잭션을 묶어주는값)
        listRQ.option.rq.transactionSetId = this.listRS.transactionSetId;

        // const base64Str = this.base64Svc.base64EncodingFun(listRQ.option);
        const queryString = qs.stringify(listRQ.option);
        const path = page + queryString;

        // 페이지 이동후 생명주기 재실행
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate([path]));

        this.modalClose();
    }
}
