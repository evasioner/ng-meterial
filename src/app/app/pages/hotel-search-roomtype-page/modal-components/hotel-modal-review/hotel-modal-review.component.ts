import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import * as _ from 'lodash';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-hotel-modal-review',
    templateUrl: './hotel-modal-review.component.html',
    styleUrls: ['./hotel-modal-review.component.scss']
})
export class HotelModalReviewComponent extends BaseChildComponent implements OnInit, OnDestroy {
    element: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy() {
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(event: MouseEvent) {
        event && event.preventDefault();

        console.info('모달 닫기');
        this.modalClose();
    }
}
