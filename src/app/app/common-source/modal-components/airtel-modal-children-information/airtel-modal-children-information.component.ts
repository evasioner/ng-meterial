import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-airtel-modal-children-information',
    templateUrl: './airtel-modal-children-information.component.html',
    styleUrls: ['./airtel-modal-children-information.component.scss']
})
export class AirtelModalChildrenInformationComponent extends BaseChildComponent implements OnInit, OnDestroy {
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit() {
        console.info('[ngOnInit | 아동/유아 항공권 예약안내]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    modalClose() {
        this.bsModalRef.hide();
    }
}
