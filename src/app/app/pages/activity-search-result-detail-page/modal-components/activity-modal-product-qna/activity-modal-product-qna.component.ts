import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseChildComponent } from '../../../../pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-modal-product-qna',
    templateUrl: './activity-modal-product-qna.component.html',
    styleUrls: ['./activity-modal-product-qna.component.scss']
})
export class ActivityModalProductQnaComponent extends BaseChildComponent implements OnInit, OnDestroy {

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
