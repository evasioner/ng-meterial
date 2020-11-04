import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-hotel-modal-roomtype-detail',
    templateUrl: './hotel-modal-roomtype-detail.component.html',
    styleUrls: ['./hotel-modal-roomtype-detail.component.scss']
})
export class HotelModalRoomtypeDetailComponent extends BaseChildComponent implements OnInit, OnDestroy {
    roomInfo: any;       // 객실 정보
    photoList: any = []; // 객실 사진 list

    roomInfoRq: any;
    amenities: any = [];
    slideConfig = { 'slidesToShow': 1, 'slidesToScroll': 10 };

    rxAlive: boolean = true;
    loadingBool: boolean = false;
    wifiBool: boolean = false;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public bsModalRef: BsModalRef,
        private apiHotelService: ApiHotelService,
        private comService: HotelComService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        super.ngOnInit();

        this.pageInit();
    }

    ngOnDestroy(): void {
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
     * 1. api 호출 (객실 정보)
     */
    pageInit() {
        console.info('[객실 정보 > rq]', this.roomInfoRq);
        // ---------[api 호출 | 객실 정보]
        this.subscriptionList = [
            this.apiHotelService.POST_HOTEL_ROOM_INFORMATION(this.roomInfoRq)
                .subscribe(
                    (res: any) => {
                        console.info('[객실 정보 > result]', res);
                        if (res['succeedYn']) {
                            this.roomInfo = _.cloneDeep(res['result'].room);
                            this.roomDetailInfoInit();
                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err);
                    }
                )
        ];
        // ---------[End api 호출 | 객실 정보]
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

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    public onCloseClick(event: any): void {
        event && event.preventDefault();

        console.info('모달 닫기');
        this.modalClose();
    }

    /**
     * 사진 URL _z -> _y 변경
     * 변경된 URL 로 존재하는 이미지만 화면상에 노출
     * @param $photos
     */
    changeUrlPhotoList(): void {
        const photoList = [];
        this.roomInfo.photos.forEach((item) => {
            if (item.photoUrl) { // photoUrl 값이 있을 경우
                const resultUrl = this.comService.replacePhotoUrl(item.photoUrl);
                item.photoUrl = resultUrl;
                photoList.push(item);
            }
        });

        if (photoList.length > 0)
            this.photoList = photoList;
    }
}