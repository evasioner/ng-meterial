import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { clearActivityModalDestinations } from 'src/app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';
import { upsertActivityCitySearch } from '@/app/store/activity-city-intro-page/activity-city-search/activity-city-search.actions';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { ApiActivityService } from 'src/app/api/activity/api-activity.service';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { ActivityEnums } from '../activity-page/enums/activity-enums.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-activity-city-intro-page',
    templateUrl: './activity-city-intro-page.component.html',
    styleUrls: ['./activity-city-intro-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivityCityIntroPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;

    loadingBool: Boolean = false;
    resolveData: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
        private readonly activityComServiceService: ActivityComServiceService,
        private readonly apiActivityService: ApiActivityService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

        this.subscriptionList = [];
        this.subscribeInit();
    }

    ngOnInit() {
        super.ngOnInit();
        this.storeActivityCommonInit(); // store > activity-common 초기화
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private subscribeInit() {
        /**
         * 초기화 데이터
         */
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        const rsData = this.activityComServiceService.afterEncodingRq(_.cloneDeep(data.resolveData));
                        this.resolveData = rsData;

                        this.pageInit();
                    }
                )
        );
    }

    /**
     * 페이지 초기화
     * 1. rq 스토어에 저장
     * 2. City값 세팅
     * 3. api 호출
     * - rs store 저장
     *
     * @param $resolveData
     */
    pageInit() {
        // ---------[activity-cityintro-rq-info 스토어에 저장]
        this.upsertOne({
            id: ActivityEnums.STORE_CITYINTRO_RQ,
            result: this.resolveData
        });

        // ---------[api 호출 | 액티비티 도시인트로]
        this.subscriptionList.push(
            this.apiActivityService.POST_ACTIVITY_CITY(this.resolveData.rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[액티비티 도시인트로 > res]', res['result']);

                            //this.transactionSetId = res['transactionSetId'];
                            const cityName = (res['result'].city.cityNameLn != null) ? res['result'].city.cityNameLn : res['result'].city.cityNameEn;
                            this.headerInit(cityName);

                            this.upsertOne({
                                id: ActivityEnums.STORE_CITYINTRO_RS,
                                result: res['result']
                            });
                            this.upsertOne({
                                id: ActivityEnums.STORE_CITYINTRO_CITYNAME,
                                result: cityName
                            });
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        );
        // ---------[End api 호출 | 액티비티 도시인트로]
        this.loadingBool = true;
    }

    headerInit($headerCityName) {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: $headerCityName + ' 검색 결과',
            key: null
        };
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertActivityCitySearch({
            activityCitySearch: $obj
        }));
    }

    /**
     * store > activity-common 초기화
     */
    storeActivityCommonInit() {
        this.store.dispatch(clearActivityModalDestinations());
    }
}
