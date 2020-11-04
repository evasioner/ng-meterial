import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

//Component
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { CommonModalPhotoDetailComponent } from '../common-modal-photo-detail/common-modal-photo-detail.component';

@Component({
    selector: 'app-common-modal-photo-list',
    templateUrl: './common-modal-photo-list.component.html',
    styleUrls: ['./common-modal-photo-list.component.scss']
})
export class CommonModalPhotoListComponent extends BaseChildComponent implements OnInit, OnDestroy {
    category: any;
    photos: any;
    photoList: any;
    slideConfig = { 'slidesToShow': 1, 'slidesToScroll': 10 };

    currentSlide: number;
    slideCount: number;

    loadingBool: boolean = false;

    bsModalPhotoDetailRef: any;
    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private bsModalService: BsModalService,
        private bsModalRef: BsModalRef
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        const photos = _.sortBy(this.photos, 'displayOrder');
        this.photoList = _.cloneDeep(photos);
        console.info('[이미지 list]', this.photoList);
        this.loadingBool = true;
    }


    ngOnDestroy(): void {
        console.info('[photoList] ngOnDestroy');
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }


    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(event: MouseEvent) {
        event && event.preventDefault();

        console.info('모달 닫기');
        this.modalClose();
    }

    /**
     * 사진 상세 modal open
     */
    onPhotoDetail(idx: number) {
        console.log('사진 상세 modal open ...');
        const initialState = {
            category: this.category,
            photos: this.photoList,
            currentSlide: idx
        };
        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal m-ngx-slick-carousel is-img-viewer',
            animated: false
        };

        this.bsModalPhotoDetailRef = this.bsModalService.show(CommonModalPhotoDetailComponent, { initialState, ...configInfo });
    }

}
