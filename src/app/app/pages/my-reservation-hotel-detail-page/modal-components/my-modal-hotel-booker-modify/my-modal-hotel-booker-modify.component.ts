import { Component, Inject, PLATFORM_ID, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoadingBarService } from '@ngx-loading-bar/core';

import * as _ from 'lodash';

import { ApiMypageService } from '@/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-hotel-booker-modify',
    templateUrl: './my-modal-hotel-booker-modify.component.html',
    styleUrls: ['./my-modal-hotel-booker-modify.component.scss']
})
export class MyModalHotelBookerModifyComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    $element: any;
    booker: any;
    rxAlive: boolean = true;

    loadingBool: Boolean = false;
    headerType: any;
    headerConfig: any;
    bsModalRef: BsModalRef;
    consultings: any[] = [];
    rooms: any[] = [];
    summary: any;
    resolveData: any;
    hotelBookingInfo: any;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        private el: ElementRef,
        private route: ActivatedRoute,
        private apiMypageService: ApiMypageService,
        private loadingBar: LoadingBarService,
        public bsModalService: BsModalService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        const userNo = Number(
                            _.chain(this.resolveData).get('condition.userNo').value()
                        );
                        this.resolveData.condition.userNo = userNo;
                        console.info('[1. route 통해 데이터 전달 받기]', this.resolveData);
                        this.pageInit(this.resolveData);
                    }
                )
        );
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

    // modalClose() {
    //     const bodyEl = document.getElementsByTagName('body')[0];
    //     bodyEl.classList.remove('overflow-none');
    //     this.bsModalRef.hide();
    // }


    async callHotelReservationtDetailApi($rq) {
        console.info('>>>> call api start', $rq);
        this.loadingBool = false;
        this.loadingBar.start();
        return this.apiMypageService.POST_BOOKING_RENT_DETAIL($rq)
            .toPromise()
            .then((res: any) => {
                console.info('[호텔예약상세 > res]', res);

                if (res.succeedYn) {
                    this.loadingBool = true;
                    this.loadingBar.complete();
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
        // resolveData.currency = 'JGT';
        // resolveData.language = 'EN';
        const res = await this.callHotelReservationtDetailApi(resolveData);

        this.booker = res['result']['booker'];
        this.summary = res['result']['summary'];

        console.info('this.booker>>>', this.booker);
    }

    onCloseClick() {
        this.closeAllModals();
    }
}