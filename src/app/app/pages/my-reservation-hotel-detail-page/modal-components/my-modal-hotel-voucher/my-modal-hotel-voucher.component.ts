import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, Input } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';
import { ApiAlertService } from 'src/app/common-source/services/api-alert/api-alert.service';

@Component({
    selector: 'app-my-modal-hotel-voucher',
    templateUrl: './my-modal-hotel-voucher.component.html',
    styleUrls: ['./my-modal-hotel-voucher.component.scss']
})
export class MyModalHotelVoucherComponent extends BaseChildComponent implements OnInit {
    @Input() rq: any;

    resultList: any;
    loadingBool: Boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef,
        private apiBookingSvc: ApiBookingService,
        public translateService: TranslateService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }
    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit | Invoice]');

        this.hotelInvoice(this.rq);
        // this.apiBookingSvc.POST_E_TICKET();

    }

    ngOnDestroy() {
    }

    /**
    * 항공 예약
    * 3. api 호출
    * @param $resolveData
    */
    async hotelInvoice($request) {
        await this.apiBookingSvc.POST_HOTEL_VOUCHER($request)
            .toPromise()
            .then((res: any) => {
                console.info('[API 호출 | 인보이스 조회 결과 >]', res);
                if (res.succeedYn) {
                    this.resultList = res['result']['invoice'][0];
                    this.loadingBool = true;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.errorMessage);
            });
        console.info('[3. API 호출 끝]');
    }


    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

}

