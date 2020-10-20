import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

//store
import * as hotelRoomTypeSelectors from 'src/app/store/hotel-search-roomtype-page/hotel-search-roomtype/hotel-search-roomtype.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';

import { Subscription } from 'rxjs';


@Component({
    selector: 'app-hotel-modal-detail-image',
    templateUrl: './hotel-modal-detail-image.component.html',
    styleUrls: ['./hotel-modal-detail-image.component.scss']
})
export class HotelModalDetailImageComponent implements OnInit, OnDestroy {
    @ViewChild('slickModal') slickModal: SlickCarouselComponent;

    rxAlive: boolean = true;
    loadingBool: boolean = false;

    hotelInfo: any;
    photoList: any;
    slideCount: number;
    currentSlide: number;

    imagesSlider = {
        // "centerMode": true,
        // "centerPadding": "20px",
        focusOnSelect: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        draggable: true,
        asNavFor: '.slider-nav',
    };
    thumbnailsSlider = {
        // "centerMode": true,
        // "centerPadding": "20px",
        focusOnSelect: true,
        infinite: true,
        speed: 300,
        slidesToShow: 12,
        slidesToScroll: 1,
        draggable: true,
        asNavFor: '.slider-for'
    };
    private subscriptionList: Subscription[];

    constructor(
        private store: Store<any>,
        private bsModalRef: BsModalRef,
        private comService: HotelComService,
        public translateService: TranslateService
    ) {
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.hotelRoomTypeInit();
    }

    ngOnDestroy(): void {
        console.info('[photoList] ngOnDestroy');
        this.rxAlive = false;
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
    * 호텔 리스트 영역 초기화
    */
    hotelRoomTypeInit() {
        this.subscriptionList.push(
            this.store
                .pipe(
                    select(hotelRoomTypeSelectors.getSelectId('hotel-search-roomtype-info')), // 스토어 ID
                    takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('hotel-search-result-info > ', ev);
                        if (ev) {
                            this.hotelInfo = _.cloneDeep(ev.result.rs.result.hotel);
                            this.photoList = this.changeUrlPhotoList(this.hotelInfo.photos);
                            // this.photoList.forEach((item, index) => {
                            //   this.loadImageFromURL(item.photoUrl, index);
                            // });
                            this.loadingBool = true;
                        }
                    }
                )
        );
    }

    addSlide() {
        // this.urlList.push({img: "http://placehold.it/350x150/777777"})
    }

    removeSlide() {
        // this.urlList.length = this.urlList.length - 1;
    }

    /**
     * slick 초기화
     * @param e
     */
    slickInit(e) {
        console.log('slick initialized', e);
        this.slickModal.slickGoTo(this.currentSlide);
    }

    breakpoint(e) {
        console.log('breakpoint', e);
    }

    afterChange(e) {
        console.log('afterChange', e);
        this.currentSlide = e.slick.currentSlide;
        this.slideCount = e.slick.slideCount;
    }

    beforeChange(e) {
        console.log('beforeChange', e);
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * @param $photos
     */
    changeUrlPhotoList($photos): void {
        const photos = JSON.parse(JSON.stringify($photos));
        photos.forEach((item) => {
            if (item.photoUrl) { // photoUrl 값이 있을 경우
                const resultUrl = this.comService.replaceImageQulaity(item.photoUrl, '_z');
                item.photoUrl = resultUrl;
            }
        });

        return photos;
    }



    onCloseClick(e) {
        console.info('모달 닫기', e);
        this.modalClose();
    }


    next() {
        console.info('다음');
        // 이미지 갯수가 slidesToShow 보다 작거나 같을때, 마지막 슬라이스에서는 첫 슬라이드로 이동
        if (this.photoList.length <= this.thumbnailsSlider.slidesToShow && this.currentSlide + 1 === this.photoList.length)
            this.slickModal.slickGoTo(0);
        else
            this.slickModal.slickNext();
    }

    prev() {
        console.info('이전');
        // 이미지 갯수가 slidesToShow 보다 작거나 같을때, 첫 슬라이스에서는 마지막 슬라이드로 이동
        if (this.photoList.length <= this.thumbnailsSlider.slidesToShow && this.currentSlide === 0)
            this.slickModal.slickGoTo(this.photoList.length - 1);
        else
            this.slickModal.slickPrev();
    }

    onThumbnailEvt(e, $idx) {
        console.info('onThumbnailEvt >>> ', e);
        this.currentSlide = $idx;
    }

}
