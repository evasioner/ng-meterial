import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-common-modal-photo-detail',
    templateUrl: './common-modal-photo-detail.component.html',
    styleUrls: ['./common-modal-photo-detail.component.scss']
})
export class CommonModalPhotoDetailComponent extends BaseChildComponent implements OnInit, OnDestroy, AfterViewInit {
    category: any;
    photos: any;
    currentSlide: number;
    slideCount: number;
    loadingBool: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngAfterViewInit(): void {
        this.loadingBool = true;
    }

    ngOnDestroy(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(e) {
        console.info('모달 닫기', e);
        this.modalClose();
    }
}

