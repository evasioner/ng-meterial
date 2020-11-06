import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-qna-view',
    templateUrl: './my-modal-qna-view.component.html',
    styleUrls: ['./my-modal-qna-view.component.scss']
})
export class MyModalQnaViewComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    public viewModel: any;
    bookingItemCode: any;
    boardMasterSeq: any;
    requestDatetime: any;
    questionTitle: any;
    questionDetail: any;
    answerDetail: any;
    handleFinishDatetime: any;

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
        console.log(this.viewModel, 'this.viewModel');
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
