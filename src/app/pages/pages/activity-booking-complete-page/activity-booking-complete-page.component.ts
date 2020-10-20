import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as qs from 'qs';
import * as moment from 'moment';

import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';

import { environment } from '@/environments/environment';

import { PageCodes } from '@/app/common-source/enums/page-codes.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';
import { MyCommon } from '@/app/common-source/enums/my/my-common.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-activity-booking-complete-page',
    templateUrl: './activity-booking-complete-page.component.html',
    styleUrls: ['./activity-booking-complete-page.component.scss']
})
export class ActivityBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private dataModel: any;

    public headerConfig: any;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private route: ActivatedRoute,
        private jwtService: JwtService,
        private router: Router
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();

        this.headerSet();
        this.loginInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
        // this.closeAllModals();
    }

    /**
    * initialize
    * 초기화
    */
    private initialize(): void {
        this.dataModel = {};
        this.viewModel = {};
    }

    private headerSet() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    private loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl)
            .then(
                (resp: any) => {
                    if (resp) {
                        this.sessionInit();
                        this.setViewModel();
                    }
                },
                (err: any) => {
                    console.info('[jwtService.loginGuardInit > err]', err);
                }
            );
    }

    /**
     * sessionInit
     * 세션 데이터 초기화
     */
    private sessionInit(): void {
        const sessionItem = JSON.parse(sessionStorage.getItem(ActivityStore.STORE_COMMON));

        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            this.dataModel = _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_BOOKING_RS].result)
        } else {

        }
    }

    private setViewModel() {
        this.viewModel = _.cloneDeep(this.dataModel);
        this.viewModel.date = moment(this.viewModel.date).format('YYYY-MM-DD(dd)');
    }

    public detailLink(event: MouseEvent) {
        event && event.preventDefault();

        const rqMypageInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW', // TODO - user setting
            'language': 'KO', // TODO - user setting
            'condition': {
                'userNo': this.dataModel.userNo,
                'bookingItemCode': this.dataModel.bookingItemCode
            }
        };

        this.router.navigate([`${MyCommon.PAGE_RESERVATION_ACTIVITY_DETAIL}${qs.stringify(rqMypageInfo)}`]);
    }
    public listLink(event: MouseEvent) {
        event && event.preventDefault();

        const rqMypageInfo =
        {
            'selectCode': '3',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW', // TODO - user setting
            'language': 'KO', // TODO - user setting
            'condition': {
                'userNo': this.dataModel.userNo
            }
        };

        this.router.navigate([`${MyCommon.PAGE_RESERVATION_ACTIVITY_LIST}${qs.stringify(rqMypageInfo)}`]);
    }
}
