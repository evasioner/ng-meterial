import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ReviewPhotoDetailComponent } from '../review-photo-detail/review-photo-detail.component';

@Component({
    selector: 'app-review-photo-list',
    templateUrl: './review-photo-list.component.html',
    styleUrls: ['./review-photo-list.component.scss']
})
export class ReviewPhotoListComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    photoDetailClick() {

        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(ReviewPhotoDetailComponent, { initialState, ...configInfo });
    }
}
