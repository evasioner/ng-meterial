import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile, take, debounceTime, finalize } from 'rxjs/operators';

import { Store } from '@ngrx/store';

//store
import { upsertHotelSearchResultMapPage, clearHotelSearchResultMapPages } from 'src/app/store/hotel-search-result-page/hotel-search-result-map-page/hotel-search-result-map-page.actions';
import { clearHotelSearchResultPages } from 'src/app/store/hotel-search-result-page/hotel-search-result-page/hotel-search-result-page.actions';
import { clearHotelModalDestinations } from 'src/app/store/hotel-common/hotel-modal-destination/hotel-modal-destination.actions';
import { clearHotelModalCalendars } from 'src/app/store/hotel-common/hotel-modal-calendar/hotel-modal-calendar.actions';
import { clearHotelModalTravelerOptions } from 'src/app/store/hotel-common/hotel-modal-traveler-option/hotel-modal-traveler-option.actions';
import { clearHotelModalDetailOptions } from 'src/app/store/hotel-common/hotel-modal-detail-option/hotel-modal-detail-option.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CountdownTimerService } from 'ngx-timer';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { AgmMap, ControlPosition, LatLngBounds } from '@agm/core';

import * as _ from 'lodash';
import * as qs from 'qs';

import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';
import { HotelComService } from 'src/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiHotelService } from 'src/app/api/hotel/api-hotel.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { SearchResultPageState } from '@/app/common-source/enums/search-result-page-state.enum';

import { BasePageComponent } from '../base-page/base-page.component';

declare var google: any;

@Component({
    selector: 'app-hotel-search-result-map-page',
    templateUrl: './hotel-search-result-map-page.component.html',
    styleUrls: ['./hotel-search-result-map-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotelSearchResultMapPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    @ViewChild(AgmMap) agmMap: AgmMap;
    map: any;
    mapInfo: any = {
        centerLat: 0,
        centerLng: 0,
        zoomLevel: 0,
        draggable: false,
        bounds: null
    };
    selectedHotel: any;
    selectedHotelCode: any;

    ctx: any = this;
    headerType: any;
    headerConfig: any;
    element: any;
    rxAlive: boolean = true;

    vm: any;
    resolveData: any;

    isForFilter: boolean;
    hotelListRq: any; // hotel/list rq
    hotelMapRq: any; // hotel/map rq
    hotelList: Array<any> = []; // hotel/list rs > hotelList
    hotelListLen: number;
    hotelTransactionSetId: any; // hotel/list rs > 트랜잭션 Id

    loadingBool: boolean = false;
    apiLoadingBool: boolean = false;
    researchBool: boolean = false;
    asideBool: boolean = false;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
        private el: ElementRef,
        private comService: HotelComService,
        private apiHotelService: ApiHotelService,
        private bsModalService: BsModalService,
        private loadingBar: LoadingBarService,
        private countdownTimerService: CountdownTimerService,
        private location: Location,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.element = this.el.nativeElement;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        console.info('[ngOnInit]');
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-x');

        this.headerInit();
        this.timerInit();
        this.storeHotelCommonInit();
        this.routeInit();
    }

    ngOnDestroy() {
        console.info('[ngOnDestroy > rxAlive]', this.rxAlive);
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-x');

        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );

        this.rxAlive = false;
        this.closeAllModals();
    }

    timerInit() {
        const cdate = new Date();
        const timerVal = 10; // 타이머 분 설정
        cdate.setMinutes(cdate.getMinutes() + timerVal);
        this.countdownTimerService.startTimer(cdate);

        this.subscriptionList = [
            this.countdownTimerService.onTimerStatusChange
                .pipe(takeWhile(() => this.rxAlive))
                .subscribe(
                    (status: any) => {
                        if (status === 'END') {
                            this.rxAlive = false;
                            console.info('[status]', status);
                            console.info('[rxAlive]', this.rxAlive);
                            console.info('[timerValue]', this.countdownTimerService.timerValue);

                            const alertTxt = '검색 후 10분이 경과하여 재검색 합니다.';
                            this.comService.timerAlert(alertTxt);
                        }
                    })
        ];
    }

    /**
     * 라우트 초기화 : get으로 데이터 전달 받음
     */
    routeInit() {
        console.info('[routeInit]');

        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                        this.resolveData = _.cloneDeep(data.resolveData);

                        const rq = this.comService.makeHotelListRq(data.resolveData);

                        this.resolveData.rq = _.cloneDeep(rq);
                        this.resolveData.rq.condition.limits = [0, 10];
                        this.hotelListRq = _.cloneDeep(this.resolveData.rq);
                        this.hotelMapRq = _.cloneDeep(this.resolveData.rq);
                        this.hotelMapRq.condition = _.omit(rq.condition, 'dynamicRateYn', 'sortOrder', 'limits');

                        this.vmInit();

                        if (this.isBrowser) {
                            console.info('[1-1. 가공된 rq 데이터]', rq);
                            this.pageInit();
                        }
                    })
        );
    }

    pageInit() {
        const rq = this.resolveData.rq;
        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_LIST(rq)
                .pipe(
                    takeWhile(() => this.rxAlive),
                    finalize(
                        () => {
                            console.log('POST_HOTEL_LIST completed.');
                            this.loadingBool = true;
                        }
                    )
                )
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[pageInit > POST_HOTEL_LIST]', res);
                            this.mapInfo.centerLat = Number(res['result'].geography.centerLatitude);
                            this.mapInfo.centerLng = Number(res['result'].geography.centerLongitude);
                            this.mapInfo.zoomLevel = Number(res['result'].geography.zoomLevel);
                            console.info('[맵 정보]', this.mapInfo);
                            this.rsDataInit(this.resolveData, res);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    },
                )
        );
    }

    vmInit() {
        const RESOLVE_DATA = this.resolveData;
        this.vm = {
            city: RESOLVE_DATA.city,
            chkIn: RESOLVE_DATA.chkIn,
            chkOut: RESOLVE_DATA.chkOut,
            roomList: RESOLVE_DATA.roomList,

            rq: RESOLVE_DATA.rq,
            rs: null
        };

        if (_.has(RESOLVE_DATA, 'filter'))
            this.vm['filter'] = RESOLVE_DATA.filter;

        if (_.has(RESOLVE_DATA, 'hotelSearchTrd'))
            this.vm['hotelSearchTrd'] = RESOLVE_DATA.hotelSearchTrd;

        console.info('[vmInit] > this.vm', this.vm);
        console.info('[vmInit] > RESOLVE_DATA', RESOLVE_DATA);

        this.upsertOne({
            id: 'hotel-resolve-data',
            result: this.resolveData
        });
    }

    /**
     * 전달 받은 데이터를 스토어에 저장
     * @param $res
     */
    rsDataInit($resolveData, $res) {
        console.info('[rsDataInit]', $res);
        const STORE_DATA = $resolveData;
        this.vm = {
            city: STORE_DATA.city,
            chkIn: STORE_DATA.chkIn,
            chkOut: STORE_DATA.chkOut,
            roomList: STORE_DATA.roomList,
            rq: STORE_DATA.rq,
            rs: $res,
            state: SearchResultPageState.IS_DEFAULT
        };

        if (_.has(STORE_DATA, 'filter'))
            this.vm['filter'] = STORE_DATA.filter;

        if (_.has(STORE_DATA, 'hotelSearchTrd'))
            this.vm['hotelSearchTrd'] = STORE_DATA.hotelSearchTrd;

        this.upsertOne({
            id: 'hotel-search-result-info',
            result: this.vm
        });
    }

    boundsHotelResearch($LatLngBound): any {
        const rq = _.cloneDeep(this.hotelMapRq);
        rq.condition['leftBottom'] = {
            latitude: $LatLngBound.getSouthWest().lat(),
            longitude: $LatLngBound.getSouthWest().lng()
        };
        rq.condition['rightTop'] = {
            latitude: $LatLngBound.getNorthEast().lat(),
            longitude: $LatLngBound.getNorthEast().lng()
        };

        this.loadingBar.start();
        this.apiLoadingBool = false;
        this.mapInfo.draggable = false;
        // ---------[api 호출 | 호텔 리스트]s
        this.isForFilter = false;
        this.hotelList = [];
        this.hotelListLen = 0;

        this.subscriptionList.push(
            this.apiHotelService.POST_HOTEL_MAP(rq)
                .pipe(
                    finalize(
                        () => {
                            this.loadingBar.complete();
                            this.mapInfo.draggable = true;
                        }
                    )
                )
                .subscribe(
                    (res: any) => {
                        console.info('[hotel/map > res]', res);
                        if (res.succeedYn) {
                            this.setHotelList(res);
                            this.apiLoadingBool = true;
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any): void => {
                        console.info('[err]', err);
                        // this.alertService.showApiAlert(err.error.errorMessage);
                        if (this.rxAlive) {
                            const error = err.error;
                            if (error)
                                if (error.errorCode === 'error.hotel.map.empty')
                                    this.comService.refresh(); //새로고침
                        }
                    }
                )
        );
    }

    headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_HOTEL
        };
    }

    /**
     * 모든 bsModal 창 닫기
     */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        console.info('upsertOne');
        this.store.dispatch(upsertHotelSearchResultMapPage({
            hotelSearchResultMapPage: $obj
        }));
    }

    /**
    * store > hotel-common 초기화
    */
    storeHotelCommonInit() {
        console.info('[0. store > hotel-common 초기화]');
        this.store.dispatch(clearHotelModalDestinations());
        this.store.dispatch(clearHotelModalCalendars());
        this.store.dispatch(clearHotelModalTravelerOptions());
        this.store.dispatch(clearHotelModalDetailOptions());
        this.store.dispatch(clearHotelSearchResultPages());
        this.store.dispatch(clearHotelSearchResultMapPages());
    }

    /**
    * 지도 옵션 설정
    */
    onMapReady(map) {
        this.map = map;
        this.map.setOptions({
            scrollwheel: false,
            zoomControl: 'true',
            zoomControlOptions: {
                position: ControlPosition.BOTTOM_RIGHT
            },
            maxZoom: 18, //최대 줌
            minZoom: 1,  //최소 줌
            mapTypeControl: true, // 지도 유형(ROADMAP, SATELLITE, HYBRID 또는 TERRAIN)
            mapTypeControlOptions: {
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },

            disableDefaultUI: true, //기본 UI 사용 여부
            disableDoubleClickZoom: true, //더블클릭 중심으로 확대 사용 여부
            keyboardShortcuts: true, //키보드 단축키 사용 여부

            scaleControl: true, // 지도로 드래그해서 스트리트 뷰를 활성화할 수 있는 펙맨 아이콘. 기본적으로 이 컨트롤은 지도의 오른쪽 아래 근처에 나타납니다.
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
                    (latLngBound: LatLngBounds) => {
                        this.mapInfo.bounds = latLngBound;
                        this.boundsHotelResearch(latLngBound);
                    }
                )
        );
    }

    setHotelList($res) {
        this.hotelTransactionSetId = this.vm['transactionSetId'];
        const res = $res['result'];
        this.hotelList = this.changeDefaultPhotoUrl(res['hotels']);
        this.hotelListLen = res['hotels'].length;
    }

    /**
     * 호텔 리스트 화질 변경
     * @param $hotels
     */
    changeDefaultPhotoUrl($hotels) {
        const hotels = JSON.parse(JSON.stringify($hotels));
        hotels.forEach((item) => {
            if (item.defaultPhotoUrl)
                item.defaultPhotoUrl = this.comService.replaceImageQulaity(item.defaultPhotoUrl, '_b');
        });

        return hotels;
    }

    /**
    * aside 호텔 검색 결과 목록 btn evt
    * @param e
    */
    btnAsideEvt(event: MouseEvent) {
        event && event.preventDefault();

        if (this.apiLoadingBool)
            this.asideBool = !this.asideBool;
    }

    /**
     * aside 호텔 검색 결과 목록 > 호텔 click evt
     * @param $hotItem
     */
    mapItemEvt($hotItem) {
        this.setCenter($hotItem);
        this.selectHotelInit($hotItem);
        //this.asideBool = !this.asideBool;
    }

    /**
     * search-form-top Output Evt
     * 재검색 모달창 오픈
     * @param e
     */
    openResearchEvt(event: MouseEvent) {
        event && event.preventDefault();

        if (this.apiLoadingBool) {
            this.researchBool = true;
            console.info('openResearchEvt > researchBool', this.researchBool);
        }
    }

    /**
     * hotel-research-form Output Evt
     * 재검색 모달창 닫기
     * @param e
     */
    closeResearchEvt(event: MouseEvent) {
        event && event.preventDefault();

        this.researchBool = false;
    }

    private makeNewUrl(data): any {
        //---------------------- -- 1. limit session 삭제
        this.comService.deleteSessionItem('hotel-search-limit');

        //-------------------------------------------- 2. rq 셋팅
        const RES_VM = _.cloneDeep(data.rq);
        const URL = _.cloneDeep(data.url);
        const rqInfo = {
            city: RES_VM.city,
            chkIn: RES_VM.chkIn,
            chkOut: RES_VM.chkOut,
            roomList: RES_VM.roomList,
        };

        if (_.has(RES_VM, 'limits'))
            rqInfo['limits'] = RES_VM.limits;

        if (_.has(RES_VM, 'sortOrder'))
            rqInfo['sortOrder'] = RES_VM.sortOrder;

        if (_.has(RES_VM, 'filter'))
            rqInfo['filter'] = RES_VM.filter;

        if (_.has(RES_VM, 'hotelSearchTrd'))
            rqInfo['hotelSearchTrd'] = RES_VM.hotelSearchTrd;

        console.info('[makeNewUrl : ', rqInfo);

        //--------------------------------------------- 3. 결과 페이지 이동
        return {
            locationPath: `/${URL}/${encodeURIComponent(qs.stringify(rqInfo))}`,
            urlPath: `/${URL}/${qs.stringify(rqInfo)}`,
            rqInfo: rqInfo
        };
    }

    /**
    * 필터/정렬 Output Evt
    * 1. limit session 삭제
    * 2. rq 셋팅
    * 3. 결과 페이지 이동
    * @param e
    */
    onSearchOutEvt(e) {
        console.info('[page -> onSearchEvt e]', e);
        const info = this.makeNewUrl(e);
        this.location.replaceState(info.locationPath);
        this.hotelMapRq = this.comService.makeHotelListRq(info.rqInfo);
        this.hotelMapRq.condition = _.omit(this.hotelMapRq.condition, 'dynamicRateYn', 'sortOrder', 'limits');
        this.boundsHotelResearch(this.mapInfo.bounds);
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
     * 좌표값으로 중앙 설정
     */
    setCenter($hotel): void {
        this.apiLoadingBool = false;
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
     * - 현재 정보창 호텔과 같은 호텔 클릭 시, 정보창 닫아준다.
     */
    onOverlayClick(e, i) {
        const bool: boolean = !(this.selectedHotelCode === this.hotelList[i].hotelCode);
        if (bool) {
            this.setCenter(this.hotelList[i]);
            this.selectHotelInit(this.hotelList[i]);
        } else { // 같은 호텔일 경우
            const activeBool: boolean = e.currentTarget.classList.contains('active');
            console.info(activeBool);
            if (activeBool)
                e.currentTarget.classList.remove('active');
            else
                e.currentTarget.classList.add('active');
        }
    }

    selectHotelInit($selHotel) {
        this.selectedHotel = $selHotel;
        this.selectedHotelCode = $selHotel.hotelCode;

        if (this.selectedHotel.defaultPhotoUrl)
            this.selectedHotel.defaultPhotoUrl = this.comService.replaceImageQulaity(this.selectedHotel.defaultPhotoUrl, '_b');
    }

    onMapHotelDtl($hotelItem) {
        const VM_DATA = this.vm;
        const rqInfo = {
            city: VM_DATA.city,
            chkIn: VM_DATA.chkIn,
            chkOut: VM_DATA.chkOut,
            roomList: VM_DATA.roomList,
            hCode: $hotelItem.hotelCode
        };

        let regionCode;
        if (_.has(VM_DATA.rq.condition, 'regionCode'))
            regionCode = VM_DATA.rq.condition.regionCode;

        console.info('[데이터 rqInfo]', rqInfo);
        this.comService.moveRoomtypePage(rqInfo, VM_DATA.rs.transactionSetId, regionCode);
    }

    public onPageMvoe(data: any) {
        console.info('[onPageMvoe] data', data);
        const info = this.makeNewUrl(data);
        console.info('[onPageMvoe] info', info);
        this.router.navigate([info.urlPath]);
    }
}
