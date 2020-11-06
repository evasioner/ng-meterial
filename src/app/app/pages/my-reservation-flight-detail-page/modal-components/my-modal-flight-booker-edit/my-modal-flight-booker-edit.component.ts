import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/internal/operators/take';

import { TranslateService } from '@ngx-translate/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiMypageService } from '@/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { HeaderTypes } from '@/app/common-source/enums/header-types.enum';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-flight-booker-edit',
    templateUrl: './my-modal-flight-booker-edit.component.html',
    styleUrls: ['./my-modal-flight-booker-edit.component.scss']
})
export class MyModalFlightBookerEditComponent extends BaseChildComponent implements OnInit, OnDestroy {
    headerType: any;
    rxAlive: boolean = true;
    headerConfig: any;
    resolveData: any;
    $element: any;
    instantTicketing: boolean;
    summary: any;                   // 예약정보
    itineraries: Array<any>;        // 상세 스케줄
    booker: any;                    // 예약자 정보
    travelers: Array<any>;          // 탑승자 정보
    loadingBool: Boolean = false;
    flightDetail: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService
    ) {
        super(platformId);

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

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '예약 상세 내역',
            key: null,
        };
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
        this.booker = res['result']['booker'];                 // 예약자 정보
        this.travelers = res['result']['travelers'];            // 탑승자 정보

        console.info('summary >>>', this.summary);
        console.info('itineraries >>>', this.itineraries);
        console.info('booker >>>', this.booker);
        console.info('travelers >>>', this.travelers);
        // console.info('fromLabel >>>', this.fromLabel);
        // console.info('toLabel >>>', this.toLabel);
        // console.info('dateDiff >>>', this.dateDiff);
    }

    onCloseClick() {
        this.closeAllModals();
    }

}