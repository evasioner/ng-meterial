import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';
import { ActivityEnums } from '../activity-page/enums/activity-enums.enum';
import { BasePageComponent } from '../base-page/base-page.component';
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import { JwtService } from '../../common-source/services/jwt/jwt.service';
import { environment } from '@/environments/environment';
import { clearActivityModalDestinations } from 'src/app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';
import { clearActivityResultSearchs } from 'src/app/store/activity-search-result-page/activity-result-search/activity-result-search.actions';
import { clearActivityCitySearchs } from 'src/app/store/activity-city-intro-page/activity-city-search/activity-city-search.actions';
import { clearActivitySearchResultDetailPages } from 'src/app/store/activity-search-result-detail-page/activity-search-result-detail-page/activity-search-result-detail-page.actions';
import { clearActivitySearchResultOptionPages } from 'src/app/store/activity-search-result-option-page/activity-search-result-option-page/activity-search-result-option-page.actions';
import { clearActivitySessionStorages } from 'src/app/store/activity-common/activity-session-storage/activity-session-storage.actions';
import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';
import * as qs from 'qs';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-activity-booking-complete-page',
    templateUrl: './activity-booking-complete-page.component.html',
    styleUrls: ['./activity-booking-complete-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivityBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;

    public loadingBool: Boolean = false;

    private dataModel: any;
    private subscriptionList: Subscription[];

    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
        public jwtService: JwtService) {
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
        this.headerInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private initialize(): void {
        this.dataModel = {};
        this.viewModel = {};
        this.subscriptionList = [];
        this.sessionInit();
        this.storeClear(); // store > activity-common 초기화
        this.loginInit();
    }

    private sessionInit() {
        const sessionItem = JSON.parse(localStorage.getItem(ActivityEnums.STORE_COMMON));

        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            console.log('abcd : ', sessionItem.activitySessionStorages.entities)
            this.dataModel.booking = _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityEnums.STORE_BOOKING].result);
        }
    }

    private storeClear() {
        this.store.dispatch(clearActivityModalDestinations());
        this.store.dispatch(clearActivityCitySearchs());
        this.store.dispatch(clearActivityResultSearchs());
        this.store.dispatch(clearActivitySearchResultDetailPages());
        this.store.dispatch(clearActivitySearchResultOptionPages());
    }

    private loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        console.info('[this.isBrowser > curUrl]', curUrl);
        this.jwtService.loginGuardInit(curUrl)
            .then(
                (e) => {
                    console.info('[jwtService.loginGuardInit > ok]', e);
                    if (e) {
                        this.setViewModel();
                    }
                },
                (err) => {
                    console.info('[jwtService.loginGuardInit > err]', err);
                }
            );

        this.subscriptionList.push(
            this.store
                .pipe(
                    select(commonUserInfoSelectors.getSelectId(['commonUserInfo']))
                )
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.dataModel.userInfo = _.cloneDeep(ev.userInfo);
                            this.dataModel.traveler = _.cloneDeep(ev.traveler);
                            console.info('[userInfo]', this.dataModel.userInfo);
                            console.info('[traveler]', this.dataModel.traveler);
                        }
                    }
                )
        );
    }

    private setViewModel() {
        this.loadingBool = true;
        this.viewModel = {
            bookingItemCode: this.dataModel.booking.bookingItems[0].bookingItemCode,
        };
    }

    private headerInit() {
        this.headerType = HeaderTypes.PAGE;
        this.headerConfig = null;
    }

    private storeActivitySessionInit() {
        this.store.dispatch(clearActivitySessionStorages());
    }

    /**
     * 액티비티예약상세 마이페이지 상세페이지 이동
     */
    detailLink(event: MouseEvent) {
        event && event.preventDefault();

        this.storeActivitySessionInit();
        const rqMypageInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW', // TODO - user setting
            'language': 'KO', // TODO - user setting
            'condition': {
                'userNo': this.dataModel.userInfo.user.userNo,
                'bookingItemCode': this.viewModel.bookingItemCode
            }
        };

        const path = '/my-reservation-activity-detail/' + qs.stringify(rqMypageInfo);
        this.router.navigate([path]);
    }

    /**
     * 액티비티예약상세 마이페이지 목록페이지 이동
     */
    listLink(event: MouseEvent) {
        event && event.preventDefault();

        this.storeActivitySessionInit();
        const rqMypageInfo =
        {
            'selectCode': '3',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW', // TODO - user setting
            'language': 'KO', // TODO - user setting
            'condition': {
                'userNo': this.dataModel.userInfo.user.userNo,
            }
        };

        const path = '/my-reservation-list/' + qs.stringify(rqMypageInfo);
        this.router.navigate([path]);
    }
}
