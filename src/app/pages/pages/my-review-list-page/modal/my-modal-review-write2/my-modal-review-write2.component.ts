import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MyModalReviewWriteCompleteComponent } from '../my-modal-review-write-complete/my-modal-review-write-complete.component';

@Component({
    selector: 'app-my-modal-review-write2',
    templateUrl: './my-modal-review-write2.component.html',
    styleUrls: ['./my-modal-review-write2.component.scss']
})
export class MyModalReviewWrite2Component implements OnInit {

    constructor(
        private bsModalService: BsModalService,
        public bsModalRef: BsModalRef
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    writeComplete() {
        this.modalClose();
        const initialState = {};

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(MyModalReviewWriteCompleteComponent, { initialState, ...configInfo });
    }
}
