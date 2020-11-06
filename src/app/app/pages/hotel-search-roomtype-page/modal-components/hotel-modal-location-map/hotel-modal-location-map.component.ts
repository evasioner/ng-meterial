import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { Observable, Subscription } from 'rxjs';
import { AgmMap, ControlPosition } from '@agm/core';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as hotelSearchRoomtypeSelector from 'src/app/store/hotel-search-roomtype-page/hotel-search-roomtype/hotel-search-roomtype.selectors';

declare var google: any;

@Component({
    selector: 'app-hotel-modal-location-map',
    templateUrl: './hotel-modal-location-map.component.html',
    styleUrls: ['./hotel-modal-location-map.component.scss']
})
export class HotelModalLocationMapComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @ViewChild(AgmMap) agmMap: AgmMap;
    map: any;

    element: any;
    rxAlive: boolean = true;
    loadingBool: boolean = false;
    hotelRoomtypeRq: any;
    hotelInfo: any;
    hotelRoomtypeInfo$: Observable<any>;
    hotelRoomtypeRq$: Observable<any>;
    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.observableInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
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
     * 옵저버블 초기화
     */
    observableInit() {
        this.hotelRoomtypeInfo$ = this.store.select(
            hotelSearchRoomtypeSelector.getSelectId(['hotel-information-rs'])
        );

        this.hotelRoomtypeRq$ = this.store.select(
            hotelSearchRoomtypeSelector.getSelectId(['hotel-roomtype-rq-info'])
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        console.info('[hotelRoomtypeRq>> subscribeInit]');

        this.subscriptionList.push(
            this.hotelRoomtypeInfo$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelRoomtypeInfo$ > subscribe]', ev);
                        if (ev) {
                            this.hotelInfo = _.cloneDeep(ev.res);
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.hotelRoomtypeRq$
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelRoomtypeRq$ > subscribe]', ev);
                        if (ev) {
                            this.hotelRoomtypeRq = _.cloneDeep(ev.res.rq);
                        }
                    }
                )
        );
    }


    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }
    onCloseClick() {
        console.info('모달 닫기');
        this.modalClose();
    }

    /**
     * 지도 옵션 설정
     */
    onMapReady(map) {
        this.map = map;
        this.map.setOptions({
            zoomControl: 'true',
            scrollwheel: false,
            zoomControlOptions: {
                position: ControlPosition.TOP_LEFT
            },
            maxZoom: 18, //최대 줌
            minZoom: 1,  //최소 줌
            mapTypeControl: true, // 지도 유형(ROADMAP, SATELLITE, HYBRID 또는 TERRAIN)
            mapTypeControlOptions: {
                mapTypeId: google.maps.MapTypeId.SATELLITE
            },

            disableDefaultUI: true, //기본 UI 사용 여부
            disableDoubleClickZoom: true, //더블클릭 중심으로 확대 사용 여부
            draggable: true, //지도 드래그 이동 사용 여부
            keyboardShortcuts: true, //키보드 단축키 사용 여부

            scaleControl: true, // 지도로 드래그해서 스트리트 뷰를 활성화할 수 있는 펙맨 아이콘이 있습니다. 기본적으로 이 컨트롤은 지도의 오른쪽 아래 근처에 나타납니다.
            streetViewControl: true, // 경사진 이미지가 포함된 지도에 틸트와 회전 옵션 조합을 제공합니다. 기본적으로 이 컨트롤은 지도의 오른쪽 아래 근처에 나타납니다.
            rotateControl: true, // 지도 배율 요소를 표시합니다. 이 컨트롤은 기본적으로 비활성화되어 있습니다.

            fullscreenControl: true
        });
    }
}
