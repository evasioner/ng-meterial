import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MyModalReviewViewTextComponent } from '../my-modal-review-view-text/my-modal-review-view-text.component';

@Component({
    selector: 'app-my-modal-review-write-complete',
    templateUrl: './my-modal-review-write-complete.component.html',
    styleUrls: ['./my-modal-review-write-complete.component.scss']
})
export class MyModalReviewWriteCompleteComponent implements OnInit {

    constructor(
        private bsModalService: BsModalService,
        public bsModalRef: BsModalRef
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    viewMyReview() {
        this.modalClose();
        const initialState = {};

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(MyModalReviewViewTextComponent, { initialState, ...configInfo });
    }

}
