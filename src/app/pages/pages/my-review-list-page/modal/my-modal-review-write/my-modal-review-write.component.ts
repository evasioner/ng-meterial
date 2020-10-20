import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { MyModalReviewWrite2Component } from '../my-modal-review-write2/my-modal-review-write2.component';

@Component({
    selector: 'app-my-modal-review-write',
    templateUrl: './my-modal-review-write.component.html',
    styleUrls: ['./my-modal-review-write.component.scss']
})
export class MyModalReviewWriteComponent implements OnInit {

    constructor(
        private bsModalService: BsModalService,
        public bsModalRef: BsModalRef
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    nextStep() {
        this.modalClose();
        const initialState = {};

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(MyModalReviewWrite2Component, { initialState, ...configInfo });
    }
}
