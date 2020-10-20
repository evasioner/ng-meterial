import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiFlightService } from 'src/app/api/flight/api-flight.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PageCodes } from 'src/app/common-source/enums/page-codes.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from 'src/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';
import { FlightModalEticketComponent } from 'src/app/common-source/modal-components/flight-modal-eticket/flight-modal-eticket.component';

@Component({
    selector: 'app-flight-booked-detail-page',
    templateUrl: './flight-booked-detail-page.component.html',
    styleUrls: ['./flight-booked-detail-page.component.scss']
})
export class FlightBookedDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    sessionRQ: any;
    loadingBool: Boolean = false;
    flightDetail: any;
    resolveData: any;

    dDay: any;

    // ngx-bootstrap config
    configInfo: any = {
        class: 'm-ngx-bootstrap-modal',
        animated: false
    };

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private apiflightSvc: ApiFlightService,
        private apiMypageService: ApiMypageService,
        private bsModalService: BsModalService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );
    }

    ngOnInit(): void {
        console.info('[ngOnInit > 예약완료 페이지]');
        super.ngOnInit();
        this.headerInit();
        // this.sessionInit();

        console.info('[routeInit]');

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.resolveData = _.cloneDeep(data.resolveData);
                        this.resvDetail();
                    }
                )
        );
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    sessionInit() {
        const sessionItem = JSON.parse(sessionStorage.getItem('flight-common'));
        if (!_.isEmpty(sessionItem.flightSessionStorages.entities)) {
            this.sessionRQ = sessionItem.flightSessionStorages.entities['flight-booking-complete'].option;
        }
        // this.loadingBool = true;
    }

    async flightResvCancel($request) {
        // ---------[api 호출 | 예약취소]
        await this.apiflightSvc.POST_FLIGHT_CANCEL($request)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info('[ 예약취소 > res.result]', res.result);
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.errorMessage);
            });
        console.info('[3. API 호출 끝]');
    }

    // API 호출 전체 예약상세
    async callFlightReservationtDetailApi(resolveData) {
        console.info('resolveData >>>>>>>>>>>>>>>', resolveData);
        // this.loadingBool = false;
        // this.loadingBar.start();
        return this.apiMypageService.POST_BOOKING_FLIGHT_DETAIL(resolveData)
            .toPromise()
            .then((res: any) => {
                console.info('[항공예약상세 > res]', res);
                if (res.succeedYn) {
                    this.flightDetail = res['result'];

                    this.dataInit();

                    this.loadingBool = true;
                    // this.loadingBar.complete();
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.errorMessage);
            });
    }
    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_FLIGHT
        };
    }

    dataInit() {
        const momentRange = extendMoment(moment);

        const fromDate = moment(this.flightDetail.summary.travelFromDate, 'YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD');

        const dDay = momentRange.range(moment(today), fromDate);
        this.dDay = dDay.diff('days');
    }

    // 항공예약상세
    resvDetail() {
        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'userNo': Number(this.resolveData.userNo),
                'bookingItemCode': this.resolveData.bookingItemCode
            }
        };
        // const path = '/my-reservation-list/' + qs.stringify(rqInfo);
        // this.router.navigate([path], {relativeTo : this.route});
        this.callFlightReservationtDetailApi(rqInfo);
    }

    // E-Ticket 보기
    onEticket() {
        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'bookingItemCode': this.resolveData.bookingItemCode //현재는 발권이 안되기 때문에 테스트 예약번호 "2007271004-F01" 사용중.. 추후 변경예정 ---> this.resolveData.bookingItemCode
            }
        };

        const initialState: any = {
            rq: rqInfo
        };

        this.bsModalService.show(FlightModalEticketComponent, { initialState, ...this.configInfo });
    }

    // 항공예약취소
    resvCancel() {
        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'bookingItemCodes': [this.resolveData.bookingItemCode],
                'smsSendYn': false
            }
        };
        const initialState = {
            titleTxt: '항공예약 취소',
            alertHtml: `${this.flightDetail.summary.bookingName}   ${this.flightDetail.summary.travelFromDate}(${moment(this.flightDetail.summary.travelFromDate).format('ddd')}) - ${this.flightDetail.summary.travelToDate}(${moment(this.flightDetail.summary.travelToDate).format('ddd')}) <br/>예약번호 : YB${this.flightDetail.summary.bookingCode}`,
            cancelObj: {
                fun: () => {
                }
            },
            okObj: {
                fun: () => {
                    this.flightResvCancel(rqInfo);
                }
            }
        };
        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...this.configInfo });
        // this.flightResvCancel(rqInfo);
        // const path = '/my-reservation-flight-detail/' + qs.stringify(rqInfo);
        // this.router.navigate([path], {relativeTo : this.route});
    }
    goToReservation() {
        const path = '/my-reservation-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToRecent() {
        const path = '/my-recent-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToWish() {
        const path = '/my-wish-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToCoupon() {
        // this.onCloseClick();
        const path = '/my-coupon-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToQna() {
        const path = '/my-qna-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToReview() {
        const path = '/my-review-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToCustomer() {
        // const path = '/my-customer-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToNotice() {
        const path = '/my-notice-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
    goToEvent() {
        // const path = '/my-promotion-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToShare() {
        // const path = '/my-share-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToSeller() {
        // const path = '/my-seller-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
    goToAgreement() {
        // const path = '/my-agreement-list';
        // const extras = {
        //     relativeTo: this.route
        // };
        // this.router.navigate([path], extras);
    }
}
