import { ModalMypageMainComponent } from '@/app/layouts/page-layout/modal-components/modal-mypage-main/modal-mypage-main.component';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-review-detail',
    templateUrl: './review-detail.component.html',
    styleUrls: ['./review-detail.component.scss']
})
export class ReviewDetailComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    menuClick() {
        this.modalClose();
        const initialState = {

        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalService.show(ModalMypageMainComponent, { initialState, ...configInfo });
    }
}
