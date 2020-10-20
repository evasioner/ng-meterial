import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store } from '@ngrx/store';

//store
import { upsertHotelSearchRoomtype } from 'src/app/store/hotel-search-roomtype-page/hotel-search-roomtype/hotel-search-roomtype.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

import * as _ from 'lodash';

import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-modal-room-information',
    templateUrl: './hotel-modal-room-information.component.html',
    styleUrls: ['./hotel-modal-room-information.component.scss']
})
export class HotelModalRoomInformationComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @ViewChild('slickModal') slickModal: SlickCarouselComponent;
    roomInfoRq: any; //input

    amenities: any = [];
    roomInfo: any;       // 객실 정보
    photoList: any = []; // 객실 사진 list

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    wifiBool: boolean = false;

    slideCount: number;
    currentSlide: number = 0;
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
        slidesToShow: 8,
        slidesToScroll: 1,
        draggable: true,
        asNavFor: '.slider-for'
    };
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private apiHotelService: ApiHotelService,
        private comService: HotelComService,
        private bsModalRef: BsModalRef,
        public translateService: TranslateService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.pageInit();
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
     * 페이지 초기화
     * @param $resolveData
     */
    pageInit() {
        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_ROOM_INFORMATION(this.roomInfoRq)
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[pageInit > POST_HOTEL_ROOM_INFORMATION]', res);
                            this.roomInfo = _.cloneDeep(res['result'].room);
                            this.roomDetailInfoInit();
                            //store 저장
                            this.upsertOne({
                                id: 'hotel-roomtype-detail-info',
                                res: res
                            });
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                        this.loadingBool = false;
                    },
                    () => {
                        console.log('POST_HOTEL_ROOM_INFORMATION completed.');
                        this.loadingBool = true;
                    }
                )
        );
    }

    roomDetailInfoInit() {
        this.amenities = _.sortBy(this.roomInfo.amenities, 'id');
        _.forEach(this.amenities, (item) => {
            const searchResultVal = item.name.search(new RegExp('wifi', 'i')); // 대소문자 구문 안함.
            if (searchResultVal !== -1)
                this.wifiBool = true;
        });

        this.changeUrlPhotoList();
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelSearchRoomtype({
            hotelSearchRoomtype: _.cloneDeep($obj)
        }));
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

    /**
    * 사진 URL _z -> _y 변경
    * 변경된 URL 로 존재하는 이미지만 화면상에 노출
    */
    changeUrlPhotoList(): void {
        const photoList = [];
        this.roomInfo.photos.forEach((item) => {
            if (item.photoUrl) {
                const resultUrl = this.comService.replaceImageQulaity(item.photoUrl, '_z');
                item.photoUrl = resultUrl;
                photoList.push(item);
            }
        });

        if (photoList.length > 0)
            this.photoList = photoList;
    }
    //------------------------------[slick]

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

    //------------------------------[end slick]

}
