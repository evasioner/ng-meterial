import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';

import { HeaderTypes } from '@/app/common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-flight-booking-complete-page',
    templateUrl: './flight-booking-complete-page.component.html',
    styleUrls: ['./flight-booking-complete-page.component.scss']
})
export class FlightBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private sessionRQ: any;

    public loadingBool: Boolean = false;
    public resultList: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private apiBookingSvc: ApiBookingService
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

    ngOnInit(): void {
        console.info('[ngOnInit > 예약완료 페이지]');
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    private initialize() {
        this.headerInit();
        this.sessionInit();
    }

    /**
    * headerInit
    * 헤더 초기화
    *
    * @param detail 상세 내역
    */
    private headerInit(): void {
        this.headerType = HeaderTypes.PAGE;
    }

    private sessionInit() {
        const sessionItem = JSON.parse(localStorage.getItem('flight-common'));
        if (!_.isEmpty(sessionItem.flightSessionStorages.entities)) {
            this.sessionRQ = sessionItem.flightSessionStorages.entities['flight-booking-complete'].option;

            const rqInfo =
            {
                'stationTypeCode': environment.STATION_CODE,
                'currency': 'KRW',
                'language': 'KO',
                'condition': {
                    'bookingItemCode': this.sessionRQ.bookingItemCode,
                }
            };

            console.log(this.sessionRQ);
            console.log(rqInfo);


            this.flightSummarySearch(rqInfo);
        }
    }

    /**
     * 항공 예약 완료 정보
     * @param $resolveData bookingItemCode(예약 번호)
     */
    private flightSummarySearch($resolveData) {
        this.subscriptionList = [
            this.apiBookingSvc.POST_BOOKING_FLIGHT_SUMMARY($resolveData)
                .subscribe(
                    (res: any) => {
                        console.info('[API 호출 | 항공 예약 완료 정보 >]', res['result']);
                        this.resultList = res['result'];

                        this.loadingBool = true;
                    },
                    (err: any) => {
                        console.info('[err]', err);

                    }
                )
        ];
        console.info('[3. API 호출 끝]');
    }

    // 예약리스트
    listLink(event: MouseEvent) {
        event && event.preventDefault();

        const rqInfo =
        {
            'selectCode': '1',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.sessionRQ.userNo,
                'bookingItemCode': this.sessionRQ.bookingItemCode
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        this.router.navigate([path], { relativeTo: this.route });
    }

    // 항공예약상세
    detailLink(event: MouseEvent) {
        event && event.preventDefault();

        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.sessionRQ.userNo,
                'bookingItemCode': this.sessionRQ.bookingItemCode
            }
        };
        const path = '/my-reservation-flight-detail/' + qs.stringify(rqInfo);
        this.router.navigate([path], { relativeTo: this.route });
    }
}
