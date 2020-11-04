import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-review-photo-detail',
    templateUrl: './review-photo-detail.component.html',
    styleUrls: ['./review-photo-detail.component.scss']
})
export class ReviewPhotoDetailComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    prev() {

    }
    next() {

    }
}
