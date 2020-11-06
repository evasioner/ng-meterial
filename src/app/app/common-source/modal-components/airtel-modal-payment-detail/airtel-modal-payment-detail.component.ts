import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as flightSearhchResultSelector from 'src/app/store/flight-common/flight-search-result/flight-search-result.selectors';

@Component({
    selector: 'app-airtel-modal-payment-detail',
    templateUrl: './airtel-modal-payment-detail.component.html',
    styleUrls: ['./airtel-modal-payment-detail.component.scss']
})
export class AirtelModalPaymentDetailComponent extends BaseChildComponent implements OnInit, OnDestroy {
    flightListRs$: Observable<any>;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }
    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit | 결제 상세]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.storeInit();
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    storeInit() {
        this.flightListRs$ = this.store.select(
            flightSearhchResultSelector.getSelectId('flight-list-rs')
        );
    }

    modalClose() {
        this.bsModalRef.hide();
    }
}
