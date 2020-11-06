import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, Input } from '@angular/core';


import { TranslateService } from '@ngx-translate/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiMypageService } from '@/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';


import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-flight-booker-edit',
    templateUrl: './my-modal-flight-booker-edit.component.html',
    styleUrls: ['./my-modal-flight-booker-edit.component.scss']
})
export class MyModalFlightBookerEditComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() rq: any;

    resultList: any;
    loadingBool: Boolean = false;
    booker: any;
    flightDetail: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        private apiBookingSvc: ApiBookingService,
        private apiMypageSvc: ApiMypageService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit ]');

        this.flightBookerEdit(this.rq);
    }



    ngOnDestroy() {

        this.modalClose();

    }

    modalClose() {
        this.bsModalRef.hide();
    }


    async flightBookerEdit($request) {
        // ---------[api 호출 | E-Ticket(항공) 조회]
        await this.apiMypageSvc.POST_BOOKING_FLIGHT_DETAIL($request)
            .toPromise()
            .then((res: any) => {
                console.info('[API 호출]', res);

                if (res.succeedYn) {
                    this.resultList = res['result']['booker'][0];
                    this.flightDetail = res['result'];
                    this.loadingBool = true;
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
        console.info('[3. API 호출 끝]');
    }
    async pageInit(resolveData) {
        const res = await this.flightBookerEdit(resolveData);

        this.booker = res['result']['booker'];                 // 예약자 정보

        console.info('booker >>>', this.booker);


    }
    onCloseClick() {
        this.modalClose();
    }

}