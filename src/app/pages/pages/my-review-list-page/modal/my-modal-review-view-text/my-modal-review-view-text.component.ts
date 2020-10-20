import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-modal-review-view-text',
    templateUrl: './my-modal-review-view-text.component.html',
    styleUrls: ['./my-modal-review-view-text.component.scss']
})
export class MyModalReviewViewTextComponent implements OnInit {

    constructor(
        private bsModalService: BsModalService,
        public bsModalRef: BsModalRef
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
}
