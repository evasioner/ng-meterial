import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PageCodes } from 'src/app/common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-flight-booking-complete-page',
    templateUrl: './flight-booking-complete-page.component.html',
    styleUrls: ['./flight-booking-complete-page.component.scss']
})
export class FlightBookingCompletePageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];

    public sessionRQ: any;
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
        private apiBookingSvc: ApiBookingService,
        private alertService: ApiAlertService
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

    private headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_FLIGHT
        };
    }

    private sessionInit() {
        const sessionItem = JSON.parse(sessionStorage.getItem('flight-common'));
        console.log('aaaaa : ', sessionItem);
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
                        if (res.succeedYn) {
                            console.info('[API 호출 | 항공 예약 완료 정보 >]', res['result']);
                            this.resultList = res['result'];

                            this.loadingBool = true;
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        ];
        console.info('[3. API 호출 끝]');
    }

    // 예약리스트(마이페이지 이동)
    listLink() {
        const rqInfo =
        {
            'selectCode': '1',  //항공:1, 호텔:2, 액티비티:3, 렌터카:4, 묶음할인:5
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': this.sessionRQ.userNo,
                'bookingItemCode': this.sessionRQ.bookingItemCode,
                'excludeCancelYn': false
            }
        };
        const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        this.router.navigate([path], { relativeTo: this.route });
    }

    // 항공예약상세
    detailLink() {
        const rq = {
            userNo: this.sessionRQ.userNo,
            bookingItemCode: this.sessionRQ.bookingItemCode
        };

        console.info('[데이터 rq]', rq);
        const qsStr = qs.stringify(rq);

        const path = '/flight-booked-detail/' + qsStr;
        this.router.navigate([path], { relativeTo: this.route });
    }
}
