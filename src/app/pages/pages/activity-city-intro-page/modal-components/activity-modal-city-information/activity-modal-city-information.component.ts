import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getSelectId } from '@/app/store/activity-city-intro-page/activity-city-search/activity-city-search.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ViewModel, ViewModelCurrencySet, ViewModelPlugSet, ViewModelSet, ViewModeltimeSet } from './models/activity-modal-city-information.model';

import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-modal-city-information',
    templateUrl: './activity-modal-city-information.component.html',
    styleUrls: ['./activity-modal-city-information.component.scss']
})
export class ActivityModalCityInformationComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private subscribeList: Subscription[];

    public viewModel: ViewModel;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef,
        private store: Store<any>,
        public translateService: TranslateService
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');

        this.subscribeList.map(
            (item) => {
                item && item.unsubscribe();
            }
        );
    }

    /**
     * initialize
     * 데이터 초기화
     */
    private initialize(): void {
        this.viewModel = ViewModelSet;
        this.dataModel = {
            rquest: {},
            response: {},
            transactionSetId: null,
        };
        this.subscribeInit();
    }

    /**
     * subscribeInit
     * 구독 생성
     */
    private subscribeInit(): void {
        this.subscribeList = [
            combineLatest(
                this.store.pipe(
                    select(getSelectId([ActivityStore.STORE_CITYINTRO_RQ]))
                ),
                this.store.pipe(
                    select(getSelectId(ActivityStore.STORE_CITYINTRO_RS))
                )
            )
                .subscribe(
                    ([res1, res2]) => {
                        this.dataModel.rquest = _.cloneDeep(res1);
                        this.dataModel.response = _.cloneDeep(res2);

                        if (this.dataModel.rquest && this.dataModel.response) {
                            this.setViewModel();
                        }
                    }
                )
        ];
    }

    /**
     * setViewModel
     * 화면 구성용 값 설정
     */
    private setViewModel(): void {
        console.log(this.dataModel);

        this.viewModel = {
            cityName: this.dataModel.response.result.city.cityNameLn || '',
            currency: { ...this.dataModel.response.result.info.currency, ...{ now: new Date() } } || ViewModelCurrencySet,
            plug: this.dataModel.response.result.info.plug || ViewModelPlugSet,
            time: this.dataModel.response.result.info.time || ViewModeltimeSet,
            weather: this.dataModel.response.result.info.weathers.map(
                (item: any) => {
                    item.weatherDate = moment(item.weatherDate, 'YYYY-MM-DD').format('MM.DD');
                    return item;
                }
            )
        };

        // 시간 출력을 위한 변환
        this.viewModel.time.fullLocalTime = moment(this.viewModel.time.local, 'hh:mm').format('YYYY/MM/DD hh:mm');
    }

    public modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * onCloseClick
     *
     * @param event 돔 이벤트
     */
    public onCloseClick(event: any) {
        event && event.preventDefault();

        this.modalClose();
    }
}
