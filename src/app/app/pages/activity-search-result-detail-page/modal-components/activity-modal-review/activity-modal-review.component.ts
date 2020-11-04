import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseChildComponent } from '../../../../pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-modal-review',
    templateUrl: './activity-modal-review.component.html',
    styleUrls: ['./activity-modal-review.component.scss']
})
export class ActivityModalReviewComponent extends BaseChildComponent implements OnInit, OnDestroy {
    loadingBool: Boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
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
