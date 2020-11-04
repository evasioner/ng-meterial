import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';

import { ReviewDetailComponent } from '../review-detail/review-detail.component';

@Component({
    selector: 'app-review-write-complete',
    templateUrl: './review-write-complete.component.html',
    styleUrls: ['./review-write-complete.component.scss']
})
export class ReviewWriteCompleteComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    reviewDetail() {
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(ReviewDetailComponent, { initialState, ...configInfo });
    }
    myReviewList() {
        this.modalClose();
        const path = '/my-review-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
}
