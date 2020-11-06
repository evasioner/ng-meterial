import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiFlightService } from '@app/api/flight/api-flight.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { MyModalFlightEticketComponent } from './modal-components/my-modal-flight-eticket/my-modal-flight-eticket.component';
import { MyModalFlightMileageAccumComponent } from './modal-components/my-modal-flight-mileage-accum/my-modal-flight-mileage-accum.component';
import { MyModalFlightBookerEditComponent } from './modal-components/my-modal-flight-booker-edit/my-modal-flight-booker-edit.component';
import { MyModalFlightDocumentComponent } from './modal-components/my-modal-flight-document/my-modal-flight-document.component';
import { MyModalFlightPassportComponent } from './modal-components/my-modal-flight-passport/my-modal-flight-passport.component';
import { MyModalFlightPassingerComponent } from './modal-components/my-modal-flight-passinger/my-modal-flight-passinger.component';
import { CommonModalAlertComponent } from '@app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-my-reservation-flight-detail-page',
    templateUrl: './my-reservation-flight-detail-page.component.html',
    styleUrls: ['./my-reservation-flight-detail-page.component.scss']
})
export class MyReservationFlightDetailPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;
    bsModalRef: BsModalRef;
    loadingBool: Boolean = false;
    resolveData: any;
    result: any;
    summary: any;                   // 예약정보
    itineraries: Array<any>;        // 상세 스케줄
    button: any;                    // 버튼 비/활성 여부
    consultings: Array<any>;        // 문의사항
    booker: any;                    // 예약자 정보
    travelers: Array<any>;          // 탑승자 정보
    payments: any;                  // 결제정보
    ancillary: any;                 // 부가서비스 결제 정보
    fromLabel: any;
    toLabel: any;
    dateDiff: any;
    foldingYn: boolean = false;
    toggleYn: boolean = false;
    cabinClass: any;
    flag: Array<any>;
    transfer: Array<any>;
    instantTicketing: boolean;
    howMany: any = '';
    pageReLoad: any;
    configInfo: ModalOptions;
    sessionRQ: any;

    flightDetail: any;
    dDay: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        public bsModalService: BsModalService,
        private apiflightSvc: ApiFlightService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        const userNo = Number(_
                            .chain(this.resolveData)
                            .get('condition.userNo')
                            .value());
                        // .map((o) => {
                        //     return Number(o);
                        // });
                        console.info('Number(userNo)>>', userNo);
                        this.resolveData.condition.userNo = userNo;
                        console.info('[1. route 통해 데이터 전달 받기]', this.resolveData);
                        this.pageInit(this.resolveData);
                    }
                )
        );
        this.instantTicketing = true;
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '예약 상세 내역',
            key: null,
        };
    }

    selectFolding() {
        this.foldingYn = !this.foldingYn;
    }

    toggleClass() {
        (<HTMLInputElement>event.target).classList.toggle('active');
        // console.info('event.currentTarget >>>>>>>>>>>>>>>', event.currentTarget);
    }

    // sessionInit() {
    //     const sessionItem = JSON.parse(sessionStorage.getItem('flight-common'));
    //     if (!_.isEmpty(sessionItem.flightSessionStorages.entities)) {
    //       this.sessionRQ = sessionItem.flightSessionStorages.entities["flight-booking-complete"].option;
    //     }
    //     // this.loadingBool = true;
    //   }

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
                this.alertService.showApiAlert(err);
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

                    this.loadingBool = true;
                    // this.loadingBar.complete();
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
    }

    async pageInit(resolveData) {
        const res = await this.callFlightReservationtDetailApi(resolveData);
        // summary: any;           // 예약정보
        // itineraries: Array<any>;     // 상세 스케줄
        // booker: any;                // 예약자 정보
        // travelers: Array<any>;          // 탑승자 정보
        // payments: any;               // 결제정보
        // ancillary: any;       // 부가서비스 결제 정보

        this.summary = res['result']['summary'];           // 예약정보
        this.itineraries = res['result']['itineraries'];        // 상세 스케줄
        this.transfer = this.itineraries.map(el => {          // 각 여정의 segment 갯수 배열(환승여부의 표시를 위한data)
            return el.segments.length;
        });
        console.info('this.transfer>>>>', this.transfer);
        this.button = res['result']['button'];                  // 버튼 비/활성 여부
        this.consultings = res['result']['consultings'];        // 문의사항
        this.booker = res['result']['booker'];                 // 예약자 정보
        this.travelers = res['result']['travelers'];            // 탑승자 정보
        this.payments = res['result']['payments'];              // 결제정보
        this.ancillary = res['result']['ancillary'];     // 부가서비스 결제 정보
        this.howMany = resolveData.rq.condition.adultCount + resolveData.rq.condition.childCount + resolveData.rq.condition.infantCount;
        // 요일 추출
        const week = new Array('일', '월', '화', '수', '목', '금', '토');
        const fromDay = new Date(this.summary.travelFromDate).getDay();
        const toDay = new Date(this.summary.travelToDate).getDay();
        this.fromLabel = week[fromDay];
        this.toLabel = week[toDay];
        this.dateDiff = Math.ceil(fromDay - toDay);

        // 좌석 등급
        switch (this.itineraries[0].segments[0].cabinClassCode) {
            case 'Y': {
                this.cabinClass = '일반석(이코노미)';
                break;
            }
            case 'W': {
                this.cabinClass = '일반석(프리미엄 이코노미)';
                break;
            }
            case 'F': {
                this.cabinClass = '일등석';
                break;
            }
            case 'C': {
                this.cabinClass = '비즈니스석';
                break;
            }
            default: {
                this.cabinClass = '';
                break;
            }
        }
        // 가는편, 오는편, 여정1...
        if (this.itineraries.length === 1) {
            this.flag = ['가는편'];
        } else if (this.itineraries.length === 2) {
            this.flag = ['가는편', '오는편'];
        } else {
            this.flag = ['여정1', '여정2', '여정3', '여정4', '여정5', '여정6'];
        }
        console.info('this.cabinClass>>>', this.cabinClass);

        console.info('summary >>>', this.summary);
        console.info('itineraries >>>', this.itineraries);
        console.info('button >>>', this.button);
        console.info('consultings >>>', this.consultings);
        console.info('booker >>>', this.booker);
        console.info('travelers >>>', this.travelers);
        console.info('payments >>>', this.payments);
        console.info('ancillary >>>', this.ancillary);
        // console.info('fromLabel >>>', this.fromLabel);
        // console.info('toLabel >>>', this.toLabel);
        // console.info('dateDiff >>>', this.dateDiff);
    }

    // 일정변경
    openScheduleChange() {
        alert('일정변경');
    }

    // 예약자 정보변경 모달
    openBookerEdit() {
        const initialState = {
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        this.bsModalRef = this.bsModalService.show(MyModalFlightBookerEditComponent, { initialState, ...configInfo });
    }

    // 여권정보 등록/수정
    openPassportEdit(trav) {
        const initialState = {
            traveler: trav,
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        console.info('[initialState]', initialState);
        this.bsModalRef = this.bsModalService.show(MyModalFlightPassportComponent, { initialState, ...configInfo });
    }

    // 증빙서류 등록/수정
    openDocumentEdit() {
        const initialState = {
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        this.bsModalRef = this.bsModalService.show(MyModalFlightDocumentComponent, { initialState, ...configInfo });
    }

    // E-Ticket 모달
    openFlightEticket() {
        const rqInfo =
        {
            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'bookingItemCode': "2007271004-F01",//this.resolveData.bookingItemCode
                userNo: Number(this.resolveData.userNo),

            }
        };

        const initialState: any = {
            rq: rqInfo
        };

        this.bsModalService.show(MyModalFlightEticketComponent, { initialState, ...this.configInfo });
    }


    // 항공 예약 취소 모달
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


    // // 항공 좌석선택 모달
    // openFlightSeatmap() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalFlightSeatmapComponent, { initialState, ...configInfo });
    // }

    // // 항공 추가수하물 모달
    // openFlightBagDrop() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalFlightBagDropComponent, { initialState, ...configInfo });
    // }

    // 항공 마일리지 적립 모달
    openFlightMileageAccum() {
        const initialState = {
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        this.bsModalRef = this.bsModalService.show(MyModalFlightMileageAccumComponent, { initialState, ...configInfo });
    }

    // // 항공 요금규정 모달
    // openFlightFareRule() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalFlightFareRuleComponent, { initialState, ...configInfo });
    // }

    // // 항공 Wifi & USIM 모달
    // openFlightWifi() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalFlightWifiComponent, { initialState, ...configInfo });
    // }

    // // 항공 여행자보험 모달
    // openFlightTravelInsu() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalFlightTravelInsuComponent, { initialState, ...configInfo });
    // }

    // // 항공 기내식신청 모달
    // openFlightMeal() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalFlightMealComponent, { initialState, ...configInfo });
    // }

    // // 요금 규정 모달
    // openFareRule() {
    //     const initialState = {
    //         list: [
    //             'Open a modal with component', 'Pass your data', 'Do something else', '...'
    //         ],
    //         title: 'Modal with component'
    //     };
    //     const configInfo = {
    //         class: 'm-ngx-bootstrap-modal',
    //         animated: true
    //     };
    //     this.bsModalRef = this.bsModalService.show(MyModalFlightFareRuleComponent, { initialState, ...configInfo });
    // }

    // 탑승자 정보보기 모달
    openPassinger(travelers) {
        const initialState = {
            travelers: travelers,
            list: [
                'Open a modal with component', 'Pass your data', 'Do something else', '...'
            ],
            title: 'Modal with component'
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: true
        };
        this.bsModalRef = this.bsModalService.show(MyModalFlightPassingerComponent, { initialState, ...configInfo });
    }

    openOneonon() {
        alert('1:1 문의');
    }

}



