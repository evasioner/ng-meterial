import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-modal-mileage-notice',
    templateUrl: './my-modal-mileage-notice.component.html',
    styleUrls: ['./my-modal-mileage-notice.component.scss']
})
export class MyModalMileageNoticeComponent extends BaseChildComponent implements OnInit {
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
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
