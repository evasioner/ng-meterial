import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ApiBookingService } from 'src/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-flight-eticket',
    templateUrl: './my-modal-flight-eticket.component.html',
    styleUrls: ['./my-modal-flight-eticket.component.scss']
})
export class MyModalFlightEticketComponent extends BaseChildComponent implements OnInit {
    @Input() rq: any;

    resultList: any;
    loadingBool: Boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        private apiBookingSvc: ApiBookingService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit | E-Ticket]');

        this.flightEticket(this.rq);
    }

    /**
     * 항공 예약
     * 3. api 호출
     * @param $resolveData
     */
    async flightEticket($request) {
        // ---------[api 호출 | E-Ticket(항공) 조회]
        await this.apiBookingSvc.POST_E_TICKET($request)
            .toPromise()
            .then((res: any) => {
                console.info('[API 호출 | E-Ticket(항공) 조회 결과 >]', res);

                if (res.succeedYn) {
                    this.resultList = res['result']['eTickets'][0];
                    this.loadingBool = true;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err);
            });
        console.info('[3. API 호출 끝]');
    }

    modalClose() {
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }
}