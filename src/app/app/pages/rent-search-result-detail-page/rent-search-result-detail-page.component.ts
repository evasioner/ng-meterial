import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertRentSearchResultDetailPage } from '../../store/rent-search-result-detail-page/rent-search-result-detail-page/rent-search-result-detail-page.actions';
import { clearRentModalDestinations } from '../../store/rent-common/rent-modal-destination/rent-modal-destination.actions';
import { clearRentModalCalendars } from '../../store/rent-common/rent-modal-calendar/rent-modal-calendar.actions';

import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { RentUtilService } from '../../common-source/services/rent-com-service/rent-util.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { ApiRentService } from '../../api/rent/api-rent.service';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-rent-search-result-detail-page',
    templateUrl: './rent-search-result-detail-page.component.html',
    styleUrls: ['./rent-search-result-detail-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})//RentSearchResultDetailPageComponent
export class RentSearchResultDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    ctx: any = this;
    headerType: any;
    headerConfig: any;

    vehiclesLocationsList: any; // api rs 위치정보
    vehiclesList: any; // api rs 렌터카 정보
    venhiclesFilter: any; // api rs 필터 정보
    venhiclesSelectFilter: any; // api rs 선택한 필터 정보

    vm: any = {
        detailFilterBool: false, // 상세검색 필터 적용 여부
        alignFilterBool: false, // 정렬 필터 적용 여부
    };

    loadingBool: boolean = false;
    previousUrl: string;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        public rentUtilSvc: RentUtilService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        private apiRentService: ApiRentService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
    }

    ngOnInit(): void {
        console.info('[ngOnInit > 렌터카 결과]', this.route);
        console.info('[ngOnInit > 렌터카 결과2]', this.router);

        super.ngOnInit();
        this.storeRentCommonInit(); // store > rent-common 초기화


        this.subscriptionList = [
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.pageInit(data.resolveData);
                    }
                )
        ];
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 페이지 초기화
     * 1. 헤더 초기화
     * 2. api 호출
     * - rs store 저장
     * @param $resolveData
     */
    pageInit($resolveData) {
        // ---------[rent-list-rq-info 스토어에 저장]
        this.upsertOne({
            id: 'rent-detail-rq-info',
            result: $resolveData
        });

        // ---------[헤더 초기화]
        const headerTitle = `02. ${$resolveData.rq.condition.pickup.cityCodeIata} 차량 확인`;
        const pickupDatetime = moment($resolveData.rq.condition.pickup.datetime).format('MM.DD(HH:mm)');
        const returnDateTime = moment($resolveData.rq.condition.return.datetime).format('MM.DD(HH:mm)');
        const headerTime = `${pickupDatetime}-${returnDateTime}`;
        this.headerInit('rentalcar', headerTitle, headerTime);
        // ---------[ end 헤더 초기화]

        // ---------[api 호출 | 렌터카 리스트]
        this.subscriptionList.push(
            this.apiRentService.POST_RENT_RENTRULE($resolveData.rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[렌터카 리스트 > res]', res['result']);

                            // this.vehiclesList = res['result'].vehicles;

                            // this.upsertOne({
                            //   id:'rent-list-rs',
                            //   result: res['result']
                            // });
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err) => {
                        this.alertService.showApiAlert(err);
                    },
                    () => {
                        this.loadingBool = true;
                    }
                )
        );
    }

    /**
     * 헤더 초기화
     */
    headerInit($iconType, $headerTitle, $headerTime) {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: $iconType,
            step: {
                title: $headerTitle,
                changeBtnFun: null
            },
            detail: $headerTime,
            ctx: this.ctx
        };
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store
            .dispatch(upsertRentSearchResultDetailPage({ rentSearchResultDetailPage: $obj }));
    }

    /**
     * store > rent-common 초기화
     */
    storeRentCommonInit() {
        console.info('[0. store > rent-common 초기화]');
        this.store.dispatch(clearRentModalDestinations());
        this.store.dispatch(clearRentModalCalendars());
    }

    onBackBtnClick($ctx) {
        const path = 'rent-main';
        $ctx.router.navigate([path]);
    }

    onChangeBtnClick($ctx) {
        // console.info('[변경 버튼 클릭]', $ctx.router);
        const path = 'rent-modal-research';
        const extras = {
            relativeTo: $ctx.route
        };
        $ctx.router.navigate([path], extras);
    }
}
