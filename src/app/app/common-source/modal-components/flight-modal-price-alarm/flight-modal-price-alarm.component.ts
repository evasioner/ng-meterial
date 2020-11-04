import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-flight-modal-price-alarm',
    templateUrl: './flight-modal-price-alarm.component.html',
    styleUrls: ['./flight-modal-price-alarm.component.scss']
})
export class FlightModalPriceAlarmComponent extends BaseChildComponent implements OnInit, OnDestroy {
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit() {
        console.info('[ngOnInit | 가격 알림 설정]');
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        // this.modalClose();
    }


    modalClose() {
        this.bsModalRef.hide();
    }
}
