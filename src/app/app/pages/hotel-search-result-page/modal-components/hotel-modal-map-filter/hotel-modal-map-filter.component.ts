import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { takeWhile, debounceTime } from 'rxjs/operators';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

import { upsertHotelSearchResult } from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.actions';

import * as hotelSearchResultSelector from 'src/app/store/hotel-search-result-page/hotel-search-result/hotel-search-result.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { AgmMap, ControlPosition, LatLngBounds } from '@agm/core';

import * as _ from 'lodash';

import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

declare var google: any;

@Component({
    selector: 'app-hotel-modal-map-filter',
    templateUrl: './hotel-modal-map-filter.component.html',
    styleUrls: ['./hotel-modal-map-filter.component.scss']
})
export class HotelModalMapFilterComponent extends BaseChildComponent implements OnInit, OnDestroy {

    @ViewChild(AgmMap) agmMap: AgmMap;
    map: any;
    mapInfo: any = {
        centerLat: 0,
        centerLng: 0,
        zoomLevel: 0
    };
    geography: any;

    selectedHotel: any;
    selectedHotelCode: any;

    vm: any;
    hotelList: any;
    hotelListLen: number;
    hotelListRq: any;
    hotelSearchCon: any;
    hotelTransactionSetId: any;


    rxAlive: boolean = true;
    loadingBool: boolean = false;
    hotelListRq$: Observable<any>;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        private store: Store<any>,
        private apiHotelService: ApiHotelService,
        private comService: HotelComService,
        public bsModalRef: BsModalRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: ApiAlertService
    ) {
        super(platformId);

        this.subscriptionList = [];
    }

    ngOnInit() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        if (this.geography) {
            this.mapInfo.centerLat = this.geography.centerLatitude;
            this.mapInfo.centerLng = this.geography.centerLongitude;
            this.mapInfo.zoomLevel = this.geography.zoomLevel;
        }

        console.info(this.mapInfo);
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        console.info('[map filter >> subscribeInit]');
        this.subscriptionList = [
            this.store.select(
                hotelSearchResultSelector.getSelectId(['hotel-list-rq-info'])
            )
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (ev: any) => {
                        console.info('[hotelListRq$ > subscribe]', ev.res);
                        if (ev) {
                            this.hotelListRq = _.cloneDeep(ev.res);
                            this.hotelSearchCon = this.hotelListRq.rq;
                            this.hotelSearchCon.transactionSetId = this.hotelTransactionSetId;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        ];
    }

    boundsHotelResearch($mapCon) {
        // ---------[api 호출 | 호텔 리스트]
        const mapSearchCon = {
            stationTypeCode: environment.STATION_CODE,
            currency: this.hotelSearchCon.currency,
            language: this.hotelSearchCon.language,
            transactionSetId: this.hotelSearchCon.transactionSetId,
            condition: $mapCon
        };
        console.info('boundsHotelResearch', mapSearchCon);
        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_MAP(mapSearchCon)
                .subscribe(
                    (res: any) => {
                        console.info('[호텔 > res]', res);
                        if (res.succeedYn) {
                            this.vm = _.cloneDeep(res);
                            this.setHotelList();
                            this.loadingBool = true;
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);

                        }
                    },
                    (err: any) => {
                        // 하림대리가 알아서 하겠지
                        // this.alertService.showApiAlert(err);
                        console.info('[err]', err);
                        if (this.rxAlive) {
                            const error = err.error;
                            if (error.errorCode === 'error.hotel.map.empty')
                                this.refresh();
                        }
                    }
                )
        );
    }

    setHotelList() {
        this.hotelTransactionSetId = this.vm['transactionSetId'];

        const res = this.vm['result'];
        this.hotelList = res['hotels'];
        this.hotelListLen = res['hotels'].length;
    }
    /**
     * vm 스토어에 저장
     */
    vmStoreUpdate() {
        console.info('[vmStoreUpdate > vm 스토어에 저장]', this.vm);
        this.upsertOne({
            id: 'hotel-search-result',
            res: this.vm
        });
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    /**
     * page 새로고침
     */
    refresh() {
        this.router.navigateByUrl(`/`, { skipLocationChange: true }).then(
            () => {
                this.router.navigateByUrl(this.route.snapshot['_routerState'].url);
            }
        );
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertHotelSearchResult({
            hotelSearchResult: $obj
        }));
    }
    changeDefaultPhotoUrl($hotelUrl) {
        let resultUrl = this.comService.replacePhotoUrl($hotelUrl);
        try {
            const imageElement = new Image();
            imageElement.src = resultUrl;
            imageElement.onload = () => {
                console.info('.onload', resultUrl);
            };
            imageElement.onerror = () => {
                resultUrl = null;
                console.info('onerro', resultUrl);
            };
        } catch (e) {
        }

        return resultUrl;

    }
    onHotelDtl($hotelCode) {
        console.log('move hotel detail...', this.hotelListRq);

        const rqInfo = {
            city: this.hotelListRq.city,
            cityGubun: this.hotelListRq.cityGubun,
            cityName: this.hotelListRq.cityName,
            chkIn: this.hotelListRq.chkIn,
            chkOut: this.hotelListRq.chkOut,
            roomList: this.hotelListRq.roomList,
            hCode: $hotelCode,
            trd: this.hotelTransactionSetId
        };

        console.info('[데이터 rqInfo]', rqInfo);

        this.comService.goToHotelSearchRoomtype(rqInfo);
    }

    /**
     *호텔 등급 클래스명 구하기
     * @param $star -> ex) 5.0 / 4.5 ...
     */
    getHotelStarRating($star) {
        if (!$star) {
            return '0';
        }

        const hotelGradeCodeSplit = $star.split('.');
        let result = hotelGradeCodeSplit[0];
        if (hotelGradeCodeSplit[1] > 0) {
            result += 'h';
        }
        return result;
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
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },

            disableDefaultUI: true, //기본 UI 사용 여부
            disableDoubleClickZoom: true, //더블클릭 중심으로 확대 사용 여부
            draggable: true, //지도 드래그 이동 사용 여부
            keyboardShortcuts: true, //키보드 단축키 사용 여부

            scaleControl: true, // 지도로 드래그해서 스트리트 뷰를 활성화할 수 있는 펙맨 아이콘이 있습니다. 기본적으로 이 컨트롤은 지도의 오른쪽 아래 근처에 나타납니다.
            streetViewControl: true, // 경사진 이미지가 포함된 지도에 틸트와 회전 옵션 조합을 제공합니다. 기본적으로 이 컨트롤은 지도의 오른쪽 아래 근처에 나타납니다.
            rotateControl: true, // 지도 배율 요소를 표시합니다. 이 컨트롤은 기본적으로 비활성화되어 있습니다.

            fullscreenControl: true,
            clickableIcons: false //google map icon 클릭
        });
        this.subscriptionList.push(
            this.agmMap.boundsChange
                .pipe(
                    takeWhile(() => this.rxAlive),
                    debounceTime(300)
                )
                .subscribe(
                    (LatLngBound: LatLngBounds) => {
                        console.info('bounds', LatLngBound);
                        const mapCon = _.omit(this.hotelSearchCon.condition, 'limits', 'dynamicRateYn', 'sortOrder');
                        mapCon.leftBottom = {
                            latitude: LatLngBound.getSouthWest().lat(),
                            longitude: LatLngBound.getSouthWest().lng()
                        };
                        mapCon.rightTop = {
                            latitude: LatLngBound.getNorthEast().lat(),
                            longitude: LatLngBound.getNorthEast().lng()
                        };
                        this.boundsHotelResearch(mapCon);
                    }
                )
        );
    }

    /**
     * 좌표값으로 중앙 설정
     */
    setCenter($hotel): void {
        const centerLoca = $hotel;
        if (centerLoca.latitude !== null && centerLoca.longitude !== null) {
            this.map.panTo({
                lat: centerLoca.latitude,
                lng: centerLoca.longitude,
            });
        }
    }

    /**
     * 오버레이 클릭 이벤트
     *
     */
    onOverlayClick(i) {
        this.selectedHotel = this.hotelList[i];
        console.info('[onOverlayClick] selectedHotel', this.selectedHotel);
        this.selectedHotelCode = this.selectedHotel.hotelCode;

        if (this.selectedHotel.defaultPhotoUrl) {
            this.selectedHotel.defaultPhotoUrl = this.comService.replacePhotoUrl(this.selectedHotel.defaultPhotoUrl);
        }

        this.setCenter(this.selectedHotel);
    }

    /**
     * 지도 정보창 닫기
     */
    onInfoClose() {
        this.selectedHotel = null;
        this.selectedHotelCode = null;
    }
}