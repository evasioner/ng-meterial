import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import * as qs from 'qs';

//component
import { BasePageComponent } from '../base-page/base-page.component';

//service
import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { JwtService } from '../../common-source/services/jwt/jwt.service';

//store
import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-hotel-booking-complete-page',
    templateUrl: './hotel-booking-complete-page.component.html',
    styleUrls: ['./hotel-booking-complete-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotelBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscribeList: Subscription[];
    rxAlive: boolean = true;

    hotelBookingRs: any;
    userInfo: any;

    commonUserInfo$: any;

    public headerType: any;
    public headerConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private router: Router,
        private route: ActivatedRoute,
        public jwtService: JwtService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.initialize();
    }

    ngOnInit(): void {
        super.ngOnInit();

        if (this.isBrowser) {
            const session = JSON.parse(localStorage.getItem('hotel-common'));
            console.info(session);
            if (!_.isEmpty(session.hotelSessionStorages.entities)) {
                this.hotelBookingRs = session.hotelSessionStorages.entities['hotel-booking-rs'].result;
            }
            console.info('session booking info rq', this.hotelBookingRs);
            console.info('[this.isBrowser]', this.isBrowser);

            const curUrl = this.route.snapshot['_routerState'].url;
            console.info('[this.isBrowser > curUrl]', curUrl);

            this.jwtService.loginGuardInit(curUrl).then(
                (e) => {
                    console.info('[jwtService.loginGuardInit > ok]', e);
                    if (e) {
                        this.pageInit();
                    }
                },
                (err) => {
                    console.info('[jwtService.loginGuardInit > err]', err);
                });
        }
    }

    ngOnDestroy() {
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
        this.rxAlive = false;
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
        this.subscribeList = [];
        this.observableInit();
        this.subscribeInit();
    }

    private observableInit() {
        this.commonUserInfo$ = this.store
            .pipe(select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])));
    }

    private subscribeInit() {
        this.subscribeList.push(
            this.commonUserInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[userInfo]', ev);
                        if (ev) {
                            this.userInfo = ev.userInfo;
                        }
                    }
                )
        );
    }

    /**
    * 페이지 초기화
    *
    * @param $resolveData
    */
    async pageInit() { }

    public myBookingListLink() {
        const rqInfo: any =
        {
            'selectCode': '2',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.userInfo.user.userNo
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        this.router.navigate([path]);
    }

    public myBookingDetailLink() {
        const rqInfo: any =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.userInfo.user.userNo,
                'bookingItemCode': this.hotelBookingRs.bookingItems[0].bookingItemCode
            }
        };
        const path = '/my-reservation-hotel-detail/' + qs.stringify(rqInfo);
        this.router.navigate([path]);
    }

}