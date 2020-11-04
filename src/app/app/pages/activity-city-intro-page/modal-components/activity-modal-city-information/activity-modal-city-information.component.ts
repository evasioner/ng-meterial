import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { getSelectId } from '@/app/store/activity-city-intro-page/activity-city-search/activity-city-search.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import * as _ from 'lodash';

import { ActivityEnums } from '@/app/pages/activity-page/enums/activity-enums.enum';

import { ViewModel, ViewModelSet, ViewModelCurrencySet, ViewModeltimeSet, ViewModelPlugSet, ViewModelWeatherSet } from './models/activity-modal-city-information.model';

import { BaseChildComponent } from '../../../../pages/base-page/components/base-child/base-child.component';
import { ViewModelWeather } from '../../components/activity-city-search/models/activity-city-search.model';

@Component({
    selector: 'app-activity-modal-city-information',
    templateUrl: './activity-modal-city-information.component.html',
    styleUrls: ['./activity-modal-city-information.component.scss']
})
export class ActivityModalCityInformationComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private dataModel: any;
    private observableList: any;
    private subscriptionList: Subscription[];

    public viewModel: ViewModel;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef,
        private store: Store<any>,
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

        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
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
        this.observableList = {};
        this.subscriptionList = [];
        this.observableInit();
        this.subscribeInit();
    }

    /**
     * observableInit
     * 감시 초기화
     */
    private observableInit(): void {
        this.observableList = {
            activityCityRq$: this.store.pipe(
                select(getSelectId([ActivityEnums.STORE_CITYINTRO_RQ]))
            ),
            activiTyCityRs$: this.store.pipe(
                select(getSelectId(ActivityEnums.STORE_CITYINTRO_RS))
            )
        };
    }

    /**
     * subscribeInit
     * 구독 생성
     */
    private subscribeInit(): void {
        this.subscriptionList.push(
            combineLatest(
                this.observableList.activityCityRq$,
                this.observableList.activiTyCityRs$
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
        );
    }

    /**
     * setViewModel
     * 화면 구성용 값 설정
     */
    private setViewModel(): void {
        this.viewModel = {
            cityName: this.dataModel.response.result.city.cityNameLn || '',
            currency: { ...this.dataModel.response.result.info.currency, ...{ now: new Date() } } || ViewModelCurrencySet,
            plug: this.dataModel.response.result.info.plug || ViewModelPlugSet,
            time: this.dataModel.response.result.info.time || ViewModeltimeSet,
            weather: this.dataModel.response.result.info.weathers.map(
                (item: ViewModelWeather) => {
                    item.weatherDate = moment(item.weatherDate).format('YYYY.MM.DD');
                    return item;
                }
            ) || ViewModelWeatherSet
        };
        console.log(this.viewModel.weather)

        // 시간 출력을 위한 변환
        this.viewModel.time.fullLocalTime = moment(this.viewModel.time.local, 'hh:mm').format('YYYY/MM/DD hh:mm');
    }

    modalClose() {
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
