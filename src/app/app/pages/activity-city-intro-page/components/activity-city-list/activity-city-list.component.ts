import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, combineLatest, Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { TranslateService } from '@ngx-translate/core';

import * as activityCityIntroPageSelectors from '../../../../store/activity-city-intro-page/activity-city-search/activity-city-search.selectors';
import * as _ from 'lodash';

import { ViewModelSet, ViewModel, ViewModelActivety } from './models/activity-city-list.model';

import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-city-list',
    templateUrl: './activity-city-list.component.html',
    styleUrls: ['./activity-city-list.component.scss']
})
export class ActivityCityListComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() private target: string;
    public viewModel: ViewModel;
    private dataModel: any;
    private observableList: any;
    private subscribeList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public translateService: TranslateService,
        private router: Router
    ) {
        super(platformId);

        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscribeList && this.subscribeList.map(
            (item: Subscription) => {
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
            response: {},
            cityName: {}
        };
        this.observableList = {
            activityCityRs$: null as Observable<any>,
            activityCityName$: null as Observable<any>,
        };
        this.subscribeList = [];
        this.observableInit();
        this.subscribeInit();
    }

    /**
     * observableInit
     * 감시 초기화
     */
    private observableInit(): void {
        this.observableList = {
            activityCityRs$: this.store
                .pipe(select(activityCityIntroPageSelectors.getSelectId(ActivityStore.STORE_CITYINTRO_RS))),
            activityCityName$: this.store
                .pipe(select(activityCityIntroPageSelectors.getSelectId(ActivityStore.STORE_CITYINTRO_CITYNAME)))
        };
    }

    /**
     * subscribeInit
     * 구독 생성
     */
    private subscribeInit(): void {
        this.subscribeList = [
            combineLatest(
                this.observableList.activityCityRs$,
                this.observableList.activityCityName$
            )
                .subscribe(
                    ([res1, res2]): void => {
                        this.dataModel = {
                            response: _.cloneDeep(res1),
                            cityName: _.cloneDeep(res2)
                        };

                        if (
                            this.dataModel.response &&
                            this.dataModel.cityName
                        ) {
                            this.setViewMode();
                        }
                    }
                )
        ];
    }

    /**
     * setViewModel
     * 화면 구성용 값 설정
     */
    private setViewMode(): void {
        this.viewModel = {
            loadingFlag: false,
            cityName: this.dataModel.cityName.result || ViewModelSet.cityName,
            activityType: {
                'recommends': '추천',
                'bests': '베스트'
            }[this.target],
            activityList: this.dataModel.response.result[this.target] &&
                this.dataModel.response.result[this.target].map(
                    (item: ViewModelActivety): ViewModelActivety => {
                        let originItem: ViewModelActivety = item;

                        return originItem = {
                            ...item,
                            ...{ activityLocationName: `${this.dataModel.response.result.city.countryNameLn}, ${this.dataModel.response.result.city.cityNameLn}` }
                        };
                    }
                )
        };
    }

    /**
     * onGoDetailPage
     * 액티비티 클릭 - 상세페이지로 이동
     */
    public onGoDetailPage(event: any, index: number): void {
        event && event.preventDefault();

        this.router.navigate(['/activity-search-result-detail']);
    }
}
